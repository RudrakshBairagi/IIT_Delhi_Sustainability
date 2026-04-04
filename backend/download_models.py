from huggingface_hub import hf_hub_download
import os
import shutil

model_path = "./models"
if os.path.exists(model_path):
    shutil.rmtree(model_path)
os.makedirs(model_path, exist_ok=True)

print("🚀 Downloading Llama/Llava Model (4GB) from mys/ggml_llava-v1.5-7b...")
hf_hub_download(
    repo_id="mys/ggml_llava-v1.5-7b",
    filename="ggml-model-q4_k.gguf",
    local_dir=model_path,
    local_dir_use_symlinks=False
)

print("🚀 Downloading Projector (mmproj)...")
hf_hub_download(
    repo_id="mys/ggml_llava-v1.5-7b",
    filename="mmproj-model-f16.gguf",
    local_dir=model_path,
    local_dir_use_symlinks=False
)

print("✅ Download Complete!")
