# galactic_eden_ai.py
from llama_cpp import Llama
import chromadb
import os
from dotenv import load_dotenv

class GalacticEdenAI:
    def __init__(self):
        load_dotenv()
        model_path = os.getenv('MODEL_PATH')
        if not model_path:
            raise ValueError("Model path not found in .env file")
        print(f"Loading Llama model from: {model_path}")
        
        # Initialize Llama model with better settings for coding
        self.llm = Llama(
            model_path=model_path,
            n_ctx=4096,
            n_gpu_layers=-1,  # Use GPU if available
            n_threads=8       # Adjust based on your CPU
        )
        
        # Initialize vector database
        self.chroma_client = chromadb.PersistentClient(path="data/vector_store")
        self.collection = self._initialize_collection()
        print("Vector database initialized")
    def _initialize_collection(self):
        try:
            return self.chroma_client.create_collection(name="galactic-eden")
        except:
            return self.chroma_client.get_collection(name="galactic-eden")

    def get_relevant_context(self, query: str) -> str:
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=5
            )
            formatted_results = []
            for doc, metadata in zip(results["documents"][0], results["metadatas"][0]):
                formatted_results.append(f"File: {metadata['source']}\n{doc}\n")
            return "\n".join(formatted_results)
        except Exception as e:
            print(f"Warning: Error getting context: {e}")
            return ""

    def chat(self, user_input: str) -> str:
        context = self.get_relevant_context(user_input)
        
        prompt = f"""You are Galactic Eden AI, an advanced coding assistant with deep knowledge of web3, blockchain, and the Galactic Eden project. You excel at helping with development tasks, especially for presale websites and smart contracts.

Context:
{context}

Question: {user_input}

Answer: Let me help you with that."""

        response = self.llm(
            prompt,
            max_tokens=4096,
            temperature=0.7,
            stop=["Question:", "\n\n"]
        )
        
        return response['choices'][0]['text'].strip()