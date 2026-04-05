// Cloudflare Worker for ReLoop AI Scanner
// Proxies image analysis requests to Cloudflare Workers AI
// Model: Llama 3.2 11B Vision Instruct

const ACCOUNT_ID = 'e122a6e8bae7e0a4eb0bd95745bf83a2';
const API_TOKEN = 'l2TXhmOvo6gtmy--gKRwhwu0-S3I-J6S886_tAud';

export default {
    async fetch(request, env) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        try {
            const { image } = await request.json();

            if (!image) {
                return new Response(JSON.stringify({ error: 'No image provided' }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }

            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Call Cloudflare AI with Llama 3.2 Vision model
            const aiResponse = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3.2-11b-vision-instruct`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${API_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: `You are analyzing an item for a campus marketplace app. Identify this item and respond ONLY with valid JSON (no markdown, no backticks, no other text):
{
  "objectName": "specific item name",
  "category": "one of: electronics, books, furniture, clothing, kitchen, sports, other",
  "material": "primary materials",
  "condition": "Like New, Good, Fair, or Poor",
  "estimatedCoins": number between 10-200,
  "recyclable": true or false,
  "upcycleIdeas": [
    { "title": "idea title", "description": "brief instruction (1 sentence)", "difficulty": "Easy/Medium" }
  ]
}`,
                        image: Array.from(bytes),
                    }),
                }
            );

            if (!aiResponse.ok) {
                const errorText = await aiResponse.text();
                return new Response(JSON.stringify({
                    success: false,
                    error: `Cloudflare AI Error (${aiResponse.status}): ${errorText}`
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            const aiResult = await aiResponse.json();
            console.log('AI Result:', JSON.stringify(aiResult));

            // Parse response
            let parsedItem = {
                objectName: 'Unknown Item',
                category: 'other',
                material: 'Mixed Materials',
                condition: 'Good',
                estimatedCoins: 50,
                recyclable: true
            };

            const rawText = aiResult.result?.response || aiResult.result?.description;

            if (rawText) {
                if (typeof rawText === 'object') {
                    // It's already parsed JSON
                    parsedItem = { ...parsedItem, ...rawText };
                } else {
                    try {
                        // Try to extract JSON from the response text
                        const textStr = String(rawText);
                        const jsonMatch = textStr.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            const parsed = JSON.parse(jsonMatch[0]);
                            parsedItem = { ...parsedItem, ...parsed };
                        } else {
                            parsedItem.objectName = textStr.substring(0, 100).trim() || 'Scanned Item';
                        }
                    } catch (e) {
                        console.log('Could not parse JSON, using text');
                        parsedItem.objectName = String(rawText).substring(0, 100).trim();
                    }
                }
            }

            return new Response(JSON.stringify({
                success: true,
                item: parsedItem
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });

        } catch (error) {
            console.error('Worker error:', error);
            // Return 200 so client parses JSON error
            return new Response(JSON.stringify({
                success: false,
                error: error.message
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
    },
};
