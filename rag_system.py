import os
from pathlib import Path
from anthropic import Anthropic
import chromadb
from dotenv import load_dotenv
from typing import List, Dict

class GalacticEdenDev:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Initialize Anthropic client
        self.client = Anthropic(
            api_key=os.getenv('ANTHROPIC_API_KEY')
        )
        
        # Initialize vector database
        self.chroma_client = chromadb.PersistentClient(
            path="data/vector_store"
        )
        
        # Create or get collection
        try:
            self.collection = self.chroma_client.create_collection(
                name="galactic-eden"
            )
        except:
            self.collection = self.chroma_client.get_collection(
                name="galactic-eden"
            )

    def ingest_codebase(self):
        """Load and index all project files"""
        code_dir = Path("data/code")
        docs_dir = Path("data/docs")
        
        # Collect all files
        code_files = list(code_dir.rglob("*.*"))
        doc_files = list(docs_dir.rglob("*.*"))
        
        documents = []
        metadatas = []
        ids = []
        
        # Process code files
        for file_path in code_files + doc_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                doc_id = str(file_path)
                documents.append(content)
                metadatas.append({"source": str(file_path)})
                ids.append(doc_id)
                    
            except Exception as e:
                print(f"Error processing {file_path}: {e}")
                
        # Store in vector database
        if documents:
            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            print(f"Indexed {len(documents)} files")

    def chat(self, user_input: str) -> str:
        """Chat with Claude about development"""
        context = self.get_relevant_context(user_input)
        
        messages = [
            {
                "role": "system",
                "content": """You are a specialized development assistant for the Galactic Eden presale site. 
                You have deep knowledge of the entire codebase and project requirements.
                When suggesting code changes, show exact file locations and complete code snippets."""
            },
            {
                "role": "user", 
                "content": f"Context from codebase:\n{context}\n\nUser Question: {user_input}"
            }
        ]
        
        response = self.client.messages.create(
            model="claude-3-sonnet-20240229",
            messages=messages,
            max_tokens=4096
        )
        
        return response.content

    def get_relevant_context(self, query: str) -> str:
        """Get relevant code and docs"""
        results = self.collection.query(
            query_texts=[query],
            n_results=5
        )
        
        # Format results with source information
        formatted_results = []
        for doc, metadata in zip(results["documents"][0], results["metadatas"][0]):
            formatted_results.append(f"File: {metadata['source']}\n{doc}\n")
            
        return "\n".join(formatted_results)