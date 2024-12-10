from galactic_eden_ai import GalacticEdenAI
from pathlib import Path

def main():
    print("Initializing Galactic Eden AI...")
    
    # Add this debug section
    print("\nVerifying documentation...")
    docs_path = Path("data/docs")
    if not docs_path.exists():
        print("Creating docs directory...")
        docs_path.mkdir(parents=True, exist_ok=True)
    
    doc_files = list(docs_path.glob("*.md"))
    print(f"Found {len(doc_files)} documentation files: {[f.name for f in doc_files]}")
    
    ai = GalacticEdenAI()
    
    print("\nGalactic Eden AI is ready!")
    print("Type 'quit' to exit")
    
    while True:
        try:
            user_input = input("\nHow can I help with Galactic Eden? ")
            
            if user_input.lower() == 'quit':
                break
                
            response = ai.chat(user_input)
            print("\nGalactic Eden AI:", response)
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()