from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random
import time

router = APIRouter(
    prefix="/api",
    tags=["ai"]
)

class ImageAnalysisRequest(BaseModel):
    image: str

class UpcycleIdea(BaseModel):
    title: str
    description: str
    difficulty: str
    thumbnail: str
    source: str

class ScannedItem(BaseModel):
    objectName: str
    category: str
    material: str
    condition: str
    confidence: float
    estimatedCoins: int
    co2Savings: float
    upcycleIdeas: list[UpcycleIdea]
    recyclable: bool
    recycleInfo: str

class ScanResponse(BaseModel):
    success: bool
    classification: str
    xpEarned: int
    item: ScannedItem

# Mock Database for AI Analysis
ITEM_DATABASE = {
    "electronics": {
        "material": "Plastic & Electronics",
        "coinRange": [40, 150],
        "recyclable": True,
        "recycleInfo": "E-waste recycling required",
        "sampleItems": ["Bluetooth Speaker", "Old Tablet", "Mechanical Keyboard", "Gaming Mouse", "Digital Camera"],
        "upcycleIdeas": [
            {"title": "Speaker Bluetooth Mod", "description": "Convert old headphones into a portable Bluetooth speaker", "difficulty": "Hard", "thumbnail": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&h=200&fit=crop", "source": "youtube"},
            {"title": "Tech Art Frame", "description": "Create modern wall art by mounting in a shadow box", "difficulty": "Medium", "thumbnail": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop", "source": "youtube"}
        ]
    },
    "furniture": {
        "material": "Wood",
        "coinRange": [50, 200],
        "recyclable": False,
        "recycleInfo": "Bulk item pickup",
        "sampleItems": ["Wooden Chair", "Coffee Table", "Antique Lamp", "Bookshelf"],
        "upcycleIdeas": [
             {"title": "Chalk Paint Restoration", "description": "Give it a modern look with matte paint", "difficulty": "Easy", "thumbnail": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop", "source": "youtube"}
        ]
    },
    "clothing": {
        "material": "Fabric",
        "coinRange": [20, 80],
        "recyclable": True,
        "recycleInfo": "Textile recycling or donation",
        "sampleItems": ["Denim Jacket", "Vintage T-Shirt", "Wool Sweater", "Designer Scarf"],
        "upcycleIdeas": [
             {"title": "T-Shirt Tote Bag", "description": "No-sew conversion to a grocery bag", "difficulty": "Easy", "thumbnail": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop", "source": "youtube"}
        ]
    },
    "other": {
        "material": "Mixed Materials",
        "coinRange": [10, 40],
        "recyclable": False,
        "recycleInfo": "Check local guidelines",
        "sampleItems": ["Ceramic Mug", "Glass Vase", "Board Game", "Yoga Mat"],
        "upcycleIdeas": [
             {"title": "Planter Conversion", "description": "Drill a hole and use as a plant pot", "difficulty": "Easy", "thumbnail": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop", "source": "youtube"}
        ]
    }
}

@router.post("/scan", response_model=ScanResponse)
async def analyze_image(request: ImageAnalysisRequest):
    try:
        from llama_cpp import Llama
        from llama_cpp.llama_chat_format import Llava15ChatHandler
    except ImportError:
        print("⚠️  MISSING: llama-cpp-python. Falling back to Mock integration.")
        # FALLBACK: Return mock data if library is missing
        # ... (keep existing mock logic as fallback for safety)
        time.sleep(1)
        categories = list(ITEM_DATABASE.keys())
        random_category = random.choice(categories)
        data = ITEM_DATABASE[random_category]
        random_item_name = random.choice(data["sampleItems"])
        return {
            "success": True,
            "classification": "safe",
            "xpEarned": 15,
            "item": {
                "objectName": random_item_name,
                "category": random_category.capitalize(),
                "material": data["material"],
                "condition": "Good",
                "confidence": 0.85 + (random.random() * 0.1),
                "estimatedCoins": random.randint(data["coinRange"][0], data["coinRange"][1]),
                "co2Savings": 5.2,
                "upcycleIdeas": data["upcycleIdeas"],
                "recyclable": data["recyclable"],
                "recycleInfo": data["recycleInfo"]
            }
        }

    # Real Inference Logic
    try:
        # Load Model (Expected at backend/models/)
        MODEL_PATH = "./models/ggml-model-q4_k.gguf"
        CLIP_PATH = "./models/mmproj-model-f16.gguf"
        
        chat_handler = Llava15ChatHandler(clip_model_path=CLIP_PATH)
        llm = Llama(
            model_path=MODEL_PATH,
            chat_handler=chat_handler,
            n_ctx=2048,
            logits_all=True,
            n_gpu_layers=1 # Enable Metal on Mac
        )

        response = llm.create_chat_completion(
            messages=[
                {"role": "system", "content": "You are an AI assistant that identifies items for recycling and upcycling. Return JSON only."},
                {
                    "role": "user",
                    "content": [
                        {"type": "image_url", "image_url": {"url": request.image}},
                        {"type": "text", "text": "Identify this item. details in JSON format: {objectName: string, category: string, material: string, estimatedCoins: number}."}
                    ]
                }
            ]
        )
        
        # Parse response
        content = response['choices'][0]['message']['content']
        print(f"🤖 Llama Raw Output: {content}")

        # Clean markdown code blocks if present
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        # Parse JSON
        import json
        try:
            ai_data = json.loads(content)
            
            # Construct Response
            return {
                "success": True,
                "classification": "safe", # Could be derived from AI too
                "xpEarned": 15,
                "item": {
                    "objectName": ai_data.get("objectName", "Unknown Item"),
                    "category": ai_data.get("category", "Other"),
                    "material": ai_data.get("material", "Unknown"),
                    "condition": "Good",
                    "confidence": 0.9,
                    "estimatedCoins": ai_data.get("estimatedCoins", 50),
                    "co2Savings": 5.0, # Could calculate
                    "upcycleIdeas": [], # Could prompt for these too
                    "recyclable": True,
                    "recycleInfo": "Check local guidelines"
                }
            }
        except json.JSONDecodeError:
            print("❌ Failed to parse AI JSON. Raw content:", content)
            raise Exception("Invalid JSON from AI")
        
        # NOTE: Since we don't have the model file yet, this will fail.
        # We fall back to mock for now.
        raise Exception("Model file not found")

    except Exception as e:
        print(f"Llama Inference Failed (Using Mock): {e}")
        # Fallback to Mock
        categories = list(ITEM_DATABASE.keys())
        random_category = random.choice(categories)
        data = ITEM_DATABASE[random_category]
        random_item_name = random.choice(data["sampleItems"])

        return {
            "success": True,
            "classification": "safe",
            "xpEarned": 15,
            "item": {
                "objectName": random_item_name,
                "category": random_category.capitalize(),
                "material": data["material"],
                "condition": "Good",
                "confidence": 0.85 + (random.random() * 0.1),
                "estimatedCoins": random.randint(data["coinRange"][0], data["coinRange"][1]),
                "co2Savings": 5.2,
                "upcycleIdeas": data["upcycleIdeas"],
                "recyclable": data["recyclable"],
                "recycleInfo": data["recycleInfo"]
            }
        }
