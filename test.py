from rag_system import GalacticEdenRAG

def main():
    print("Initializing Galactic Eden RAG system...")
    rag = GalacticEdenRAG()
    
    print("\nIngesting and processing project data...")
    rag.ingest_data()
    
    # Test queries specific to your presale site
    test_questions = [
        "How does the wallet connection functionality work?",
        "What are the presale stages?",
        "Explain the XYN token distribution",
        "How is the progress bar calculated in the presale interface?"
    ]
    
    print("\nTesting queries...")
    for question in test_questions:
        print(f"\nQ: {question}")
        try:
            answer = rag.query(question)
            print(f"A: {answer}")
        except Exception as e:
            print(f"Error: {e}")
        print("-" * 80)

if __name__ == "__main__":
    main()