# Save this exactly as shown in chat.py
from galactic_eden_ai import GalacticEdenAI

def main():
    print("Initializing Galactic Eden AI...")
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