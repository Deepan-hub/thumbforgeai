import { Request, Response } from 'express';
import Thumbnail from '../models/Thumbnail.js';
import User from '../models/User.js';

// Credit amounts per plan
const PLAN_CREDITS: Record<string, number> = {
    basic: 200,
    pro: 500,
    enterprise: 1500,
};

export const getUsersThumbnails = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const thumbnails = await Thumbnail.find({ userId }).sort({ createdAt: -1 });
        res.json({ thumbnails });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getThumbnailbyId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const { id } = req.params;
        const thumbnail = await Thumbnail.findOne({ userId, _id: id });
        res.json({ thumbnail });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getUserCredits = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const user = await User.findById(userId).select('credits');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ credits: user.credits });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const addCredits = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const { plan } = req.body;

        const creditsToAdd = PLAN_CREDITS[plan?.toLowerCase()];
        if (!creditsToAdd) return res.status(400).json({ message: 'Invalid plan' });

        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { credits: creditsToAdd } },
            { new: true }
        ).select('credits');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: `${creditsToAdd} credits added successfully!`, credits: user.credits });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getTitleSuggestions = async (req: Request, res: Response) => {
    try {
        const { topic } = req.body;
        if (!topic) return res.status(400).json({ message: 'Topic is required' });

        const ai = (await import('../configs/ai.js')).default;
        const result: any = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `You are a YouTube thumbnail title expert. Generate 6 highly clickable, curiosity-driven YouTube thumbnail titles for this topic: "${topic}".

Rules:
- Each title must be short (max 8 words) and punchy
- Use power words, numbers, or emotions
- Make them click-worthy and SEO friendly
- Vary the style (question, list, bold claim, how-to)

Return ONLY a JSON array of 6 strings, no explanation:
["title1", "title2", "title3", "title4", "title5", "title6"]`,
        });

        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '[]';
        const match = text.match(/\[[\s\S]*\]/);
        const suggestions = match ? JSON.parse(match[0]) : [];
        res.json({ suggestions });
    } catch (error: any) {
        console.log('Title suggestions error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getCTRScore = async (req: Request, res: Response) => {
    try {
        const { title, image_url } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });

        const ai = (await import('../configs/ai.js')).default;
        const result: any = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `You are a YouTube thumbnail CTR expert. Rate this thumbnail for click-through potential.

Title: "${title}"
${image_url ? `Image URL: ${image_url}` : ''}

Analyze based on:
- Title clarity and curiosity factor
- Emotional impact
- Target audience appeal
- Thumbnail composition (if image provided)

Return ONLY this JSON (no explanation):
{
  "score": <number 1-10>,
  "feedback": "<one sentence overall feedback>",
  "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`,
        });

        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';
        const match = text.match(/\{[\s\S]*\}/);
        const data = match ? JSON.parse(match[0]) : { score: 5, feedback: 'Could not analyze', tips: [] };
        res.json(data);
    } catch (error: any) {
        console.log('CTR score error:', error);
        res.status(500).json({ message: error.message });
    }
};
