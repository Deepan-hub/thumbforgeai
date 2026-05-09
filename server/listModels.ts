// Run this once to see what models are available for your API key
// Command: npx tsx listModels.ts

import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;

const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
);
const data: any = await res.json();

if (data.error) {
    console.error('Error:', data.error.message);
} else {
    const imageModels = data.models?.filter((m: any) =>
        m.supportedGenerationMethods?.includes('generateContent') &&
        (m.name.includes('image') || m.name.includes('imagen') || m.name.includes('flash'))
    );
    console.log('\n=== Image / Flash Models Available ===\n');
    imageModels?.forEach((m: any) => {
        console.log('Name:', m.name);
        console.log('Display:', m.displayName);
        console.log('Methods:', m.supportedGenerationMethods);
        console.log('---');
    });
}
