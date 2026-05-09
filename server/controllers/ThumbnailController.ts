import { Request, Response } from 'express';
import Thumbnail from '../models/Thumbnail.js';
import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';
import ai from '../configs/ai.js';

// Credit costs
const CREDIT_COSTS = {
    standard: 5,
    premium: 10,
};

const stylePrompts = {
    'Bold & Graphic': 'professional YouTube thumbnail, dramatic studio lighting, explosive high contrast composition, vivid saturated colors, cinematic wide angle shot, sharp focus, no text no words no letters no numbers',
    'Tech/Futuristic': 'professional YouTube thumbnail, futuristic sci-fi background, glowing neon elements, dark background with electric blue and purple glow, digital particles, cyberpunk atmosphere, sharp 8K, no text no words no letters no numbers',
    'Minimalist': 'professional YouTube thumbnail, ultra clean minimalist composition, single bold centered subject, lots of negative space, modern flat design, crisp edges, no text no words no letters no numbers',
    'Photorealistic': 'professional YouTube thumbnail, hyperrealistic DSLR photography, 85mm lens bokeh, natural dramatic lighting, ultra sharp subject focus, lifelike textures, 8K resolution, no text no words no letters no numbers',
    'Illustrated': 'professional YouTube thumbnail, vibrant digital illustration, bold thick outlines, exaggerated expressive characters, vivid flat colors, comic book energy, no text no words no letters no numbers',
};

const colorSchemeDescriptions = {
    vibrant: 'extremely vibrant saturated colors, electric reds yellows and cyans, maximum color punch',
    sunset: 'cinematic warm sunset palette, deep oranges burnt reds and soft purples, golden hour glow',
    forest: 'rich natural greens and deep earthy browns, fresh organic feel',
    neon: 'intense neon glow, electric magenta cyan and yellow, dark background',
    purple: 'deep royal purples and electric violets, magenta accents, luxurious mood',
    monochrome: 'dramatic black and white, deep blacks crisp whites, strong shadows',
    ocean: 'deep ocean blues and turquoise teals, refreshing aquatic palette',
    pastel: 'soft dreamy pastel tones, light pinks lavenders and mint greens',
};

const aspectRatioDimensions = {
    '16:9': { width: 1280, height: 720 },
    '1:1':  { width: 1024, height: 1024 },
    '9:16': { width: 720, height: 1280 },
};

const buildAIPrompt = async (title: string, style: string, color_scheme: string, user_prompt: string, aspect_ratio: string): Promise<string> => {
    // Detect gender keywords — must be outside try so fallback can access it
    const combined = title.toLowerCase() + ' ' + (user_prompt || '').toLowerCase();
    const femaleWords = ['girl', 'woman', 'female', 'lady', 'sister', 'mother', 'mom', 'wife', 'daughter', 'she', 'her', 'women'];
    const maleWords = ['boy', 'man', 'male', 'guy', 'brother', 'father', 'dad', 'husband', 'son', 'he', 'his', 'men'];
    const isFemale = femaleWords.some(w => combined.includes(w));
    const isMale = maleWords.some(w => combined.includes(w));
    // Handle both genders mentioned together
    const genderHint = (isFemale && isMale) ? 'both a man and a woman together' : isFemale ? 'female woman girl' : isMale ? 'male man boy' : '';

    try {
        const styleDesc = stylePrompts[style as keyof typeof stylePrompts];
        const colorDesc = colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions];

        const geminiPrompt = `You are an expert YouTube thumbnail designer and AI image prompt engineer.

Generate a single highly detailed image generation prompt for FLUX.1 AI to create a stunning YouTube thumbnail BACKGROUND IMAGE for the topic: "${title}".

Requirements:
- Style: ${styleDesc}
- Color scheme: ${colorDesc}
- Aspect ratio: ${aspect_ratio}
${user_prompt ? `- Additional visual details: ${user_prompt}` : ''}
${genderHint ? `- IMPORTANT: The person in this image MUST be ${genderHint}. This is critical.` : ''}

Strict Rules:
1. Decide smartly whether a human person is needed:
   - Include a human if the topic is about personal finance, fitness, lifestyle, cooking, gaming, reactions, tutorials, or people-focused content
   - Skip human if the topic is about nature, technology concepts, animals, space, or object-focused content
   - If human included: expressive shocked or excited face in foreground, close-up shot, dramatic emotion
   - STRICTLY follow the gender specified — if girl/woman/female is mentioned, the person MUST be female. If boy/man/male is mentioned, the person MUST be male.
2. Focus on highly specific visual elements that represent "${title}"
3. Make it look like a PREMIUM magazine cover or Netflix thumbnail — cinematic, dramatic, ultra realistic
4. Strong depth of field — sharp foreground, slightly blurred background
5. Dramatic studio or cinematic lighting — rim light, volumetric light, HDR
6. ABSOLUTELY NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS anywhere in the image
7. Leave the bottom 30% slightly darker or simpler for text placement
8. Single paragraph, no line breaks, max 150 words

Return ONLY the raw image prompt with no explanation.`;

        const response: any = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: geminiPrompt,
        });

        const aiPrompt = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (aiPrompt) {
            return aiPrompt + ' Absolutely no text, no words, no letters, no numbers, no captions, no watermarks anywhere in the image.';
        }
    } catch (e) {
        console.log('Gemini prompt enhancement failed, using fallback:', e);
    }

    return `Premium YouTube thumbnail background image for "${title}", ${genderHint ? `featuring a ${genderHint},` : ''} ${stylePrompts[style as keyof typeof stylePrompts]}, ${colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]}, ${user_prompt || ''}, ultra high quality, 8K, sharp focus, cinematic lighting. No text, no words, no letters, no numbers, no captions, no watermarks, no typography, no signs, no writing anywhere in the entire image.`;
};

export const generateThumbnail = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const { title, prompt: user_prompt, style, aspect_ratio, color_scheme, text_overlay, text_color, text_position, model } = req.body;

        // Credit cost based on model
        const creditCost = model === 'premium' ? CREDIT_COSTS.premium : CREDIT_COSTS.standard;

        // Check user credits
        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ message: 'User not found' });
        if (user.credits < creditCost) {
            return res.status(403).json({ message: `Insufficient credits. You need ${creditCost} credits but have ${user.credits}. Please purchase more credits.` });
        }

        // Deduct credits before generating
        user.credits -= creditCost;
        await user.save();

        const thumbnail = await Thumbnail.create({
            userId,
            title,
            prompt_used: user_prompt,
            user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating: true,
        });

        const prompt = await buildAIPrompt(title, style, color_scheme, user_prompt, aspect_ratio);
        console.log('Generated prompt:', prompt);

        const dimensions = aspectRatioDimensions[aspect_ratio as keyof typeof aspectRatioDimensions] || aspectRatioDimensions['16:9'];

        // Step 1: Generate image with Pollinations AI (free, no API key needed)
        const isPremium = model === 'premium';

        // Premium: higher resolution output only — same prompt as standard
        const premiumDimensions = {
            '16:9': { width: 1920, height: 1080 },
            '1:1':  { width: 1440, height: 1440 },
            '9:16': { width: 1080, height: 1920 },
        };
        const finalDimensions = isPremium
            ? (premiumDimensions[aspect_ratio as keyof typeof premiumDimensions] || premiumDimensions['16:9'])
            : dimensions;

        // SAME prompt for both standard and premium — no difference in logic
        const safePrompt = prompt.length > 500 ? prompt.slice(0, 500) : prompt;
        const seed = Math.floor(Math.random() * 2147483647);

        // HuggingFace FLUX.1-schnell — fast and high quality
        const hfResponse = await fetch(
            'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: safePrompt,
                    parameters: {
                        width: finalDimensions.width,
                        height: finalDimensions.height,
                        num_inference_steps: isPremium ? 12 : 8,
                        guidance_scale: 0,
                        seed: seed,
                        negative_prompt: 'text, words, letters, numbers, captions, watermark, blurry, low quality, distorted',
                    },
                }),
            }
        );

        if (!hfResponse.ok) {
            const errText = await hfResponse.text();
            throw new Error(`Hugging Face API error: ${errText}`);
        }

        const imageBuffer = await hfResponse.arrayBuffer();
        const base64Image = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`;

        // Step 2: Upload raw image to Cloudinary
        // Premium: apply AI enhance + sharpen for extra quality
        const uploadResult = await cloudinary.uploader.upload(base64Image, {
            resource_type: 'image',
            ...(isPremium && {
                transformation: [
                    { effect: 'enhance' },
                    { effect: 'sharpen:80' },
                    { quality: 'auto:best' },
                ]
            })
        });

        // Step 3: Build final URL with text overlay using Cloudinary transformations
        let finalUrl = uploadResult.secure_url;

        if (text_overlay) {
            const fontSize = Math.round(dimensions.width / 15);
            const textWidth = Math.round(dimensions.width * 0.85);
            const yPos = 30;

            // Use user selected text color or fallback to white
            const textColor = text_color || '#FFFFFF';

            // Map text_position to Cloudinary gravity
            const positionMap: Record<string, { gravity: string; y: number }> = {
                top:    { gravity: 'north', y: 30 },
                center: { gravity: 'center', y: 0 },
                bottom: { gravity: 'south', y: 30 },
            };
            const { gravity, y: yOffset } = positionMap[text_position || 'bottom'];

            // Sanitize title for Cloudinary
            const sanitizedTitle = title
                .toUpperCase()
                .replace(/,/g, '%2C')
                .replace(/\//g, '%2F')
                .replace(/!/g, '%21')
                .replace(/\?/g, '%3F')
                .replace(/&/g, '%26')
                .replace(/'/g, '%27')
                .replace(/"/g, '%22');

            finalUrl = cloudinary.url(uploadResult.public_id, {
                transformation: [
                    {
                        overlay: {
                            font_family: 'Arial',
                            font_size: fontSize,
                            font_weight: 'bold',
                            text: sanitizedTitle,
                            text_align: 'center',
                        },
                        color: textColor,
                        gravity,
                        y: yOffset,
                        width: textWidth,
                        crop: 'fit',
                        effect: 'shadow:60',
                    },
                ],
                secure: true,
            });
        }

        thumbnail.image_url = finalUrl;
        thumbnail.isGenerating = false;
        await thumbnail.save();

        res.json({ message: 'Thumbnail Generated', thumbnail, credits: user.credits });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteThumbnail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.session;

        await Thumbnail.findByIdAndDelete({ _id: id, userId });

        res.json({ message: 'Thumbnail deleted successfully' });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const recreateThumbnail = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const { prompt, aspect_ratio, image_url, model } = req.body;
        const CREDIT_COST = model === 'premium' ? 10 : 5;

        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ message: 'User not found' });
        if (user.credits < CREDIT_COST) return res.status(403).json({ message: `Insufficient credits. You need ${CREDIT_COST} credits but have ${user.credits}.` });

        // Step 1: Get source image
        let imageBase64 = '';
        let mimeType = 'image/png';
        if (req.file) {
            imageBase64 = req.file.buffer.toString('base64');
            mimeType = req.file.mimetype || 'image/png';
        } else if (image_url) {
            const imgRes = await fetch(image_url);
            if (!imgRes.ok) throw new Error('Failed to fetch image from URL');
            imageBase64 = Buffer.from(await imgRes.arrayBuffer()).toString('base64');
            const ct = imgRes.headers.get('content-type');
            if (ct) mimeType = ct.split(';')[0];
        } else {
            return res.status(400).json({ message: 'Please provide an image file or URL' });
        }

        // Step 2: Upload original to Cloudinary
        const originalUpload = await cloudinary.uploader.upload(
            `data:${mimeType};base64,${imageBase64}`,
            { resource_type: 'image' }
        );
        const publicId = originalUpload.public_id;

        // Step 3: Use Gemini to detect ALL edit operations from prompt
        const lowerPrompt = prompt.toLowerCase();
        const colorMap: Record<string, string> = {
            red: 'FF0000', pink: 'FF69B4', hotpink: 'FF1493',
            orange: 'FF6B00', yellow: 'FFE600', green: '00AA00',
            blue: '0066FF', purple: '9900FF', violet: '8B00FF',
            cyan: '00CCFF', white: 'FFFFFF', black: '000000',
            brown: '8B4513', grey: '888888', gray: '888888',
            teal: '008080', magenta: 'FF00FF', lime: '00FF00',
            gold: 'FFD700', silver: 'C0C0C0', navy: '000080',
        };

        // Parse edit operations using Gemini — advanced natural language understanding
        let editOps: any = {};
        try {
            const geminiRes: any = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: `You are an expert image editing AI. Analyze this editing instruction and extract ALL operations needed.

Instruction: "${prompt}"

Think step by step:
- "dramatic" or "cinematic" = high contrast + vignette + slightly darker + sharpen
- "vintage" or "retro" = sepia + slight blur + lower saturation
- "vivid" or "vibrant" or "pop" = increase saturation + increase contrast + increase brightness slightly
- "dark" or "moody" = decrease brightness + increase contrast + vignette
- "bright" or "light" or "airy" = increase brightness + decrease contrast slightly
- "warm" = color shift toward orange/yellow tones (increase brightness, map blue->null)
- "cool" or "cold" = color shift toward blue tones
- "glow" or "dreamy" = slight blur + increase brightness + decrease contrast
- "sharp" or "crisp" = sharpen
- "faded" or "matte" = decrease contrast + decrease saturation
- "old photo" = sepia + vignette + decrease saturation
- "neon" = increase saturation + increase contrast + negate partially
- "sketch" or "drawing" = grayscale + sharpen
- "anime" = cartoonify + increase saturation
- "professional" = sharpen + increase contrast + vignette
- "thumbnail ready" = sharpen + increase contrast + increase brightness + increase saturation

Reply ONLY in this exact JSON, no explanation, no markdown:
{
  "color_change": { "from": "color_name_or_null", "to": "color_name_or_null" },
  "brightness": "increase|decrease|null",
  "contrast": "increase|decrease|null",
  "saturation": "increase|decrease|null",
  "blur": true,
  "sharpen": true,
  "grayscale": true,
  "sepia": true,
  "flip": "horizontal|vertical|null",
  "rotate": "90|180|270|null",
  "vignette": true,
  "pixelate": true,
  "negate": true,
  "oil_paint": true,
  "cartoonify": true,
  "brightness_amount": 20,
  "contrast_amount": 30,
  "saturation_amount": 40,
  "blur_amount": 100,
  "sharpen_amount": 80
}

Use amounts between -100 and 100. Negative = decrease, positive = increase.
Color names: red pink hotpink orange yellow green blue purple violet cyan white black brown grey teal magenta lime gold silver navy`,
            });
            const text = geminiRes?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) editOps = JSON.parse(jsonMatch[0]);
            console.log('Edit operations detected:', editOps);
        } catch (e) {
            console.log('Gemini edit detection failed:', e);
        }

        // Step 4: Build Cloudinary transformations — uses Gemini amounts + keyword fallback
        const transformations: any[] = [];

        // Color replacement
        if (editOps.color_change?.from && editOps.color_change?.to) {
            const fromHex = colorMap[editOps.color_change.from.toLowerCase()] || 'FF6B00';
            const toHex = colorMap[editOps.color_change.to.toLowerCase()] || 'FF69B4';
            transformations.push({ effect: `replace_color:${toHex}:30:${fromHex}` });
        }

        // Brightness — use Gemini amount if available, fallback to keywords
        const brightnessAmt = editOps.brightness_amount ?? (editOps.brightness === 'increase' ? 50 : editOps.brightness === 'decrease' ? -50 : null);
        if (brightnessAmt !== null) {
            transformations.push({ effect: `brightness:${brightnessAmt}` });
        } else if (lowerPrompt.includes('brighter') || lowerPrompt.includes('brighten')) {
            transformations.push({ effect: 'brightness:50' });
        } else if (lowerPrompt.includes('darker') || lowerPrompt.includes('darken')) {
            transformations.push({ effect: 'brightness:-50' });
        }

        // Contrast
        const contrastAmt = editOps.contrast_amount ?? (editOps.contrast === 'increase' ? 50 : editOps.contrast === 'decrease' ? -50 : null);
        if (contrastAmt !== null) {
            transformations.push({ effect: `contrast:${contrastAmt}` });
        } else if (lowerPrompt.includes('contrast')) {
            transformations.push({ effect: 'contrast:50' });
        }

        // Saturation
        const saturationAmt = editOps.saturation_amount ?? (editOps.saturation === 'increase' ? 80 : editOps.saturation === 'decrease' ? -80 : null);
        if (saturationAmt !== null) {
            transformations.push({ effect: `saturation:${saturationAmt}` });
        } else if (lowerPrompt.includes('vibrant') || lowerPrompt.includes('vivid') || lowerPrompt.includes('colorful')) {
            transformations.push({ effect: 'saturation:80' });
        } else if (lowerPrompt.includes('faded') || lowerPrompt.includes('matte') || lowerPrompt.includes('desaturate')) {
            transformations.push({ effect: 'saturation:-60' });
        }

        // Blur
        const blurAmt = editOps.blur_amount ?? 300;
        if (editOps.blur || lowerPrompt.includes('blur') || lowerPrompt.includes('dreamy') || lowerPrompt.includes('soft focus')) {
            transformations.push({ effect: `blur:${blurAmt}` });
        }

        // Sharpen
        const sharpenAmt = editOps.sharpen_amount ?? 100;
        if (editOps.sharpen || lowerPrompt.includes('sharpen') || lowerPrompt.includes('crisp') || lowerPrompt.includes('sharp')) {
            transformations.push({ effect: `sharpen:${sharpenAmt}` });
        }

        // Grayscale
        if (editOps.grayscale || lowerPrompt.includes('grayscale') || lowerPrompt.includes('black and white') || lowerPrompt.includes('greyscale') || lowerPrompt.includes('monochrome') || lowerPrompt.includes('sketch') || lowerPrompt.includes('drawing')) {
            transformations.push({ effect: 'grayscale' });
        }

        // Sepia
        if (editOps.sepia || lowerPrompt.includes('sepia') || lowerPrompt.includes('vintage') || lowerPrompt.includes('retro') || lowerPrompt.includes('old photo')) {
            transformations.push({ effect: 'sepia' });
        }

        // Vignette
        if (editOps.vignette || lowerPrompt.includes('vignette') || lowerPrompt.includes('dramatic') || lowerPrompt.includes('cinematic') || lowerPrompt.includes('moody')) {
            transformations.push({ effect: 'vignette:50' });
        }

        // Flip
        if (editOps.flip === 'horizontal' || lowerPrompt.includes('flip horizontal') || lowerPrompt.includes('flip h') || lowerPrompt.includes('mirror')) {
            transformations.push({ angle: 'hflip' });
        } else if (editOps.flip === 'vertical' || lowerPrompt.includes('flip vertical')) {
            transformations.push({ angle: 'vflip' });
        }

        // Rotate
        if (editOps.rotate && editOps.rotate !== 'null') transformations.push({ angle: parseInt(editOps.rotate) });

        // Pixelate
        if (editOps.pixelate || lowerPrompt.includes('pixelate') || lowerPrompt.includes('pixel art')) {
            transformations.push({ effect: 'pixelate:10' });
        }

        // Negate / invert
        if (editOps.negate || lowerPrompt.includes('invert') || lowerPrompt.includes('negate') || lowerPrompt.includes('negative')) {
            transformations.push({ effect: 'negate' });
        }

        // Oil paint
        if (editOps.oil_paint || lowerPrompt.includes('oil paint') || lowerPrompt.includes('oil painting') || lowerPrompt.includes('painted')) {
            transformations.push({ effect: 'oil_paint:60' });
        }

        // Cartoonify
        if (editOps.cartoonify || lowerPrompt.includes('cartoon') || lowerPrompt.includes('cartoonify') || lowerPrompt.includes('anime') || lowerPrompt.includes('comic')) {
            transformations.push({ effect: 'cartoonify:60:60' });
            transformations.push({ effect: 'saturation:50' });
        }

        // Auto enhance for "enhance", "improve", "better", "professional", "thumbnail ready"
        if (lowerPrompt.includes('enhance') || lowerPrompt.includes('improve quality') || lowerPrompt.includes('professional') || lowerPrompt.includes('thumbnail ready') || lowerPrompt.includes('make it better')) {
            transformations.push({ effect: 'auto_brightness' });
            transformations.push({ effect: 'sharpen:60' });
            transformations.push({ effect: 'contrast:20' });
            transformations.push({ effect: 'saturation:20' });
        }

        // Remove background using Cloudinary only (free)
        const isRemoveBg = lowerPrompt.includes('remove background') || lowerPrompt.includes('remove bg') || lowerPrompt.includes('background remove');
        if (isRemoveBg) {
            const bgUpload = await cloudinary.uploader.upload(
                `data:${mimeType};base64,${imageBase64}`,
                { resource_type: 'image' }
            );
            const bgRemovedUrl = cloudinary.url(bgUpload.public_id, {
                transformation: [{ effect: 'background_removal' }],
                format: 'png',
                secure: true,
            });
            await new Promise(resolve => setTimeout(resolve, 4000));
            const bgRes = await fetch(bgRemovedUrl);
            if (!bgRes.ok) throw new Error('Background removal failed');
            const bgBuffer = Buffer.from(await bgRes.arrayBuffer());
            const finalUpload = await cloudinary.uploader.upload(
                `data:image/png;base64,${bgBuffer.toString('base64')}`,
                { resource_type: 'image', format: 'png' }
            );
            user.credits -= CREDIT_COST;
            await user.save();
            const thumbnail = await Thumbnail.create({
                userId, title: prompt.slice(0, 80), user_prompt: prompt,
                style: 'Photorealistic', aspect_ratio: aspect_ratio || '16:9',
                isGenerating: false, image_url: finalUpload.secure_url,
            });
            return res.json({ message: 'Background Removed!', thumbnail, credits: user.credits });
        }

        // Replace background with solid color using Gemini Vision + color overlay
        const bgColorMatch = lowerPrompt.match(/(?:change|replace|set|make)\s+(?:the\s+)?background\s+(?:to|into|with)\s+(\w+)/i)
            || lowerPrompt.match(/background\s+(?:to|into|color|colour)\s+(\w+)/i);
        if (bgColorMatch) {
            const colorName = bgColorMatch[1]?.toLowerCase() || 'white';
            const colorHexMap: Record<string, string> = {
                red: 'FF0000', pink: 'FF69B4', orange: 'FF6B00', yellow: 'FFE600',
                green: '00AA00', blue: '0066FF', purple: '9900FF', cyan: '00CCFF',
                white: 'FFFFFF', black: '000000', grey: '888888', gray: '888888',
                teal: '008080', navy: '000080', brown: '8B4513', gold: 'FFD700',
                magenta: 'FF00FF', lime: '00FF00', coral: 'FF6B6B', indigo: '4B0082',
            };
            const hexColor = colorHexMap[colorName] || 'FFFFFF';

            // Upload original image
            const bgUpload = await cloudinary.uploader.upload(
                `data:${mimeType};base64,${imageBase64}`,
                { resource_type: 'image' }
            );

            // Use Cloudinary gen_replace to change background color intelligently
            const transformedUrl = cloudinary.url(bgUpload.public_id, {
                transformation: [
                    {
                        effect: `gen_recolor:prompt_(background);to-color_${hexColor}`,
                    },
                ],
                secure: true,
            });

            await new Promise(resolve => setTimeout(resolve, 3000));
            const res2 = await fetch(transformedUrl);
            let finalBuffer: Buffer;

            if (res2.ok) {
                finalBuffer = Buffer.from(await res2.arrayBuffer());
            } else {
                // Fallback: use replace_color effect on dominant background color
                const fallbackUrl = cloudinary.url(bgUpload.public_id, {
                    transformation: [
                        { effect: `replace_color:${hexColor}:40:000000` },
                        { effect: `replace_color:${hexColor}:40:FFFFFF` },
                    ],
                    secure: true,
                });
                const fallbackRes = await fetch(fallbackUrl);
                finalBuffer = Buffer.from(await fallbackRes.arrayBuffer());
            }

            const uploadResult = await cloudinary.uploader.upload(
                `data:image/jpeg;base64,${finalBuffer.toString('base64')}`,
                { resource_type: 'image' }
            );

            user.credits -= CREDIT_COST;
            await user.save();
            const thumbnail = await Thumbnail.create({
                userId, title: prompt.slice(0, 80), user_prompt: prompt,
                style: 'Photorealistic', aspect_ratio: aspect_ratio || '16:9',
                isGenerating: false, image_url: uploadResult.secure_url,
            });
            return res.json({ message: `Background changed to ${colorName}!`, thumbnail, credits: user.credits });
        }

        // ── SMART TEXT OVERLAY (free, instant) + unsupported message ─────────────
        const isGenerativeEdit = /\b(add|put|insert|place|include|draw|replace|give|show|make him|make her|turn into|transform)\b/i.test(prompt)
            && !/\b(brighter|darker|contrast|sharpen|blur|cartoon|grayscale|sepia|vignette|flip|rotate|invert|pixelate|background color)\b/i.test(prompt);

        if (isGenerativeEdit) {
            // Check if it's a text overlay request
            const textMatch = prompt.match(/(?:add|put|write|show|place)\s+(?:text|words?|title|label)?\s*(?:that\s+says?|saying|reads?|:)?\s*[""']?([A-Za-z0-9\s!?.,-]+)[""']?/i);

            if (textMatch) {
                try {
                    const textToAdd = textMatch[1].trim().toUpperCase().slice(0, 40);
                    console.log('Adding text overlay:', textToAdd);

                    const srcUpload = await cloudinary.uploader.upload(
                        `data:${mimeType};base64,${imageBase64}`,
                        { resource_type: 'image' }
                    );

                    const textUrl = cloudinary.url(srcUpload.public_id, {
                        transformation: [
                            {
                                overlay: {
                                    font_family: 'Arial',
                                    font_size: 90,
                                    font_weight: 'bold',
                                    text: textToAdd,
                                },
                                color: 'white',
                                gravity: 'south',
                                y: 50,
                                effect: 'shadow:40',
                            },
                        ],
                        secure: true,
                    });

                    const textRes = await fetch(textUrl);
                    if (textRes.ok) {
                        const textBuffer = Buffer.from(await textRes.arrayBuffer());
                        const textUpload = await cloudinary.uploader.upload(
                            `data:image/jpeg;base64,${textBuffer.toString('base64')}`,
                            { resource_type: 'image' }
                        );
                        user.credits -= CREDIT_COST;
                        await user.save();
                        const thumbnail = await Thumbnail.create({
                            userId, title: prompt.slice(0, 80), user_prompt: prompt,
                            style: 'Photorealistic', aspect_ratio: aspect_ratio || '16:9',
                            isGenerating: false, image_url: textUpload.secure_url,
                        });
                        return res.json({ message: `Text "${textToAdd}" added!`, thumbnail, credits: user.credits });
                    }
                } catch (textError: any) {
                    console.log('Text overlay failed:', textError.message);
                }
            } else {
                // Not a text request — adding objects/people not supported for free
                return res.status(400).json({
                    message: 'Adding objects, people or elements to images requires a paid AI service. You can use filters (Brighter, Contrast, Cartoon etc.) or add text overlays for free.'
                });
            }
        }
        // ─────────────────────────────────────────────────────────────────────────

        // If no transformations detected, apply auto enhance
        if (transformations.length === 0) {
            transformations.push({ effect: 'auto_brightness' });
            transformations.push({ effect: 'sharpen:50' });
        }

        // Step 5: Apply transformations via Cloudinary URL
        const transformedUrl = cloudinary.url(publicId, {
            transformation: transformations,
            secure: true,
        });

        // Step 6: Fetch transformed image and save permanently
        const transformedRes = await fetch(transformedUrl);
        if (!transformedRes.ok) throw new Error('Failed to apply transformations');
        const transformedBuffer = Buffer.from(await transformedRes.arrayBuffer());
        const finalUpload = await cloudinary.uploader.upload(
            `data:image/png;base64,${transformedBuffer.toString('base64')}`,
            { resource_type: 'image' }
        );

        // Step 7: Deduct credits & save
        user.credits -= CREDIT_COST;
        await user.save();

        const thumbnail = await Thumbnail.create({
            userId,
            title: prompt.slice(0, 80),
            user_prompt: prompt,
            style: 'Photorealistic',
            aspect_ratio: aspect_ratio || '16:9',
            isGenerating: false,
            image_url: finalUpload.secure_url,
        });

        res.json({ message: 'Thumbnail Recreated!', thumbnail, credits: user.credits });

    } catch (error: any) {
        console.log('Recreate error:', error);
        res.status(500).json({ message: error.message });
    }
};