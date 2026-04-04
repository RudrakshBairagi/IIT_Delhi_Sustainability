from huggingface_hub import list_repo_files

print("🔍 Listing files in TheBloke/llava-v1.5-7b-GGUF...")
files = list_repo_files(repo_id="TheBloke/llava-v1.5-7b-GGUF")
for f in files:
    if f.endswith(".gguf"):
        print(f" - {f}")
