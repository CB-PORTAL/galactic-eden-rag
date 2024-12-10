from rag_system import GalacticEdenDev

def main():
    # Initialize the development assistant
    print("Initializing Galactic Eden Development Assistant...")
    dev = GalacticEdenDev()
    
    # Ingest codebase
    print("Indexing codebase...")
    dev.ingest_codebase()
    
    print("\nGalactic Eden Development Assistant Ready!")
    print("Type 'quit' to exit")
    
    # Chat loop
    while True:
        user_input = input("\nWhat would you like to know about the presale site? ")
        
        if user_input.lower() == 'quit':
            break
            
        try:
            response = dev.chat(user_input)
            print("\nClaude:", response)
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()