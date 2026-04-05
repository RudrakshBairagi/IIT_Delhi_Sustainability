import { Buffer } from 'node:buffer';
import { NextResponse } from 'next/server';

const MODEL_ID = process.env.CLOUDFLARE_MODEL_ID || '@cf/meta/llama-3.2-11b-vision-instruct';

export const runtime = 'nodejs';
export const maxDuration = 60;

type ParsedItem = {
    objectName: string;
    category: string;
    material: string;
    condition: string;
    estimatedCoins: number;
    recyclable: boolean;
    upcycleIdeas: Array<{ title: string; description: string; difficulty: string }>;
};

const DEFAULT_ITEM: ParsedItem = {
    objectName: 'Unknown Item',
    category: 'Other',
    material: 'Mixed',
    condition: 'Good',
    estimatedCoins: 50,
    recyclable: true,
    upcycleIdeas: []
};

function getCloudflareConfig() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
        throw new Error(
            'AI scanner is not configured on the server. Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to your Vercel project settings, then redeploy.'
        );
    }

    return { accountId, apiToken };
}

function normalizeCategory(category: string) {
    const normalized = category.trim().toLowerCase();
    const allowedCategories = new Set([
        'electronics',
        'books',
        'furniture',
        'clothing',
        'kitchen',
        'sports',
        'other'
    ]);

    if (!allowedCategories.has(normalized)) {
        return 'Other';
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function parseCloudflareItem(aiResult: any): ParsedItem {
    const rawText =
        aiResult?.result?.response ??
        aiResult?.result?.description ??
        aiResult?.result;

    let parsedItem: ParsedItem = { ...DEFAULT_ITEM };

    if (rawText && typeof rawText === 'object') {
        parsedItem = { ...parsedItem, ...rawText };
    } else if (typeof rawText === 'string') {
        let cleanText = rawText.trim();

        if (cleanText.includes('```json')) {
            cleanText = cleanText.split('```json')[1]?.split('```')[0]?.trim() || cleanText;
        } else if (cleanText.includes('```')) {
            cleanText = cleanText.split('```')[1]?.split('```')[0]?.trim() || cleanText;
        }

        try {
            parsedItem = { ...parsedItem, ...JSON.parse(cleanText) };
        } catch (error) {
            console.warn('JSON Parse Failed, using fallback extraction', error);
            parsedItem.objectName =
                cleanText.substring(0, 50).split('\n')[0].replace(/[{"},]/g, '').trim() ||
                DEFAULT_ITEM.objectName;
        }
    }

    return {
        ...parsedItem,
        category: normalizeCategory(parsedItem.category || DEFAULT_ITEM.category),
        estimatedCoins:
            typeof parsedItem.estimatedCoins === 'number' && Number.isFinite(parsedItem.estimatedCoins)
                ? parsedItem.estimatedCoins
                : DEFAULT_ITEM.estimatedCoins
    };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { image } = body;
        const { accountId, apiToken } = getCloudflareConfig();

        if (typeof image !== 'string' || !image) {
            return NextResponse.json(
                { success: false, error: 'No image data provided' },
                { status: 400 }
            );
        }

        const imageMatch = image.match(/^data:image\/[\w.+-]+;base64,(.+)$/);
        if (!imageMatch?.[1]) {
            return NextResponse.json(
                { success: false, error: 'Invalid image format. Expected a base64 data URL.' },
                { status: 400 }
            );
        }

        console.log('Calling Cloudflare AI...');

        const imageBuffer = Buffer.from(imageMatch[1], 'base64');
        if (!imageBuffer.length) {
            return NextResponse.json(
                { success: false, error: 'Image could not be decoded.' },
                { status: 400 }
            );
        }

        const bytes = new Uint8Array(imageBuffer);

        const cfResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL_ID}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
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

        if (!cfResponse.ok) {
            const errorText = await cfResponse.text();
            console.error('Cloudflare API Error:', errorText);

            const errorMessage =
                cfResponse.status === 401 || cfResponse.status === 403
                    ? 'Cloudflare rejected the scanner credentials. Verify the Vercel env vars and make sure the token has Workers AI permissions.'
                    : cfResponse.status === 429
                        ? 'Cloudflare rate-limited the scanner request. Please try again in a moment.'
                        : `Cloudflare AI request failed with status ${cfResponse.status}.`;

            throw new Error(errorMessage);
        }

        const aiResult = await cfResponse.json();
        const parsedItem = parseCloudflareItem(aiResult);

        return NextResponse.json({
            success: true,
            classification: 'safe',
            xpEarned: 15,
            item: {
                ...parsedItem,
                confidence: 0.95,
                recycleInfo: 'Check local campus recycling guidelines',
                co2Savings: Math.round(parsedItem.estimatedCoins * 0.1)
            }
        });

    } catch (error: any) {
        console.error('Scan API Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
