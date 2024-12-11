from llama_cpp import Llama
import chromadb
import os
from dotenv import load_dotenv
from pathlib import Path
from typing import List, Dict
import fnmatch
import hashlib

class AvaAI:
    def __init__(self):
        load_dotenv()
        self._setup_model()
        self._setup_vector_store()
        self.ingest_docs()
        self.conversation_history = []
        self.max_history = 5

    def _setup_model(self):
        model_path = "models/openhermes-2.5-mistral-7b.Q4_K_M.gguf"
        if not os.path.exists(model_path):
            raise ValueError(f"Model not found at: {model_path}")
        self.llm = Llama(
            model_path=model_path,
            n_ctx=2048,
            n_threads=8,
            n_batch=512
        )

    def _setup_vector_store(self):
        self.client = chromadb.PersistentClient(path="data/vector_store")
        try:
            self.client.delete_collection("galactic_eden_docs")
        except:
            pass
        self.collection = self.client.create_collection("galactic_eden_docs")

    def _generate_unique_id(self, content: str, file_path: str, chunk_num: int) -> str:
        unique_string = f"{file_path}_{chunk_num}_{len(content)}"
        return hashlib.md5(unique_string.encode()).hexdigest()

    def ingest_docs(self):
        base_path = Path("data")
        print("\nIndexing project files...")
        all_documents = []
        all_metadatas = []
        all_ids = []

        for directory in ['docs', 'code']:
            dir_path = base_path / directory
            if dir_path.exists():
                self._process_directory(dir_path, all_documents, all_metadatas, all_ids, directory)

        if all_documents:
            batch_size = 100
            for i in range(0, len(all_documents), batch_size):
                end_idx = min(i + batch_size, len(all_documents))
                self.collection.add(
                    documents=all_documents[i:end_idx],
                    metadatas=all_metadatas[i:end_idx],
                    ids=all_ids[i:end_idx]
                )
            print(f"Successfully indexed {len(all_documents)} document chunks")

    def _process_directory(self, path: Path, documents: list, metadatas: list, ids: list, content_type: str):
        code_patterns = ['*.py', '*.js', '*.tsx', '*.jsx', '*.ts', '*.html', '*.css', '*.sol']
        doc_patterns = ['*.md', '*.txt']

        patterns = code_patterns if content_type == 'code' else doc_patterns

        for pattern in patterns:
            for file_path in path.rglob(pattern):
                try:
                    relative_path = file_path.relative_to(path)
                    if any(part.startswith('.') or part == 'node_modules' for part in relative_path.parts):
                        continue
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    if content_type == 'code':
                        chunks = self._chunk_code(content, file_path.suffix)
                    else:
                        chunks = self._smart_chunk_text(content)

                    for i, chunk in enumerate(chunks):
                        doc_id = self._generate_unique_id(chunk, str(relative_path), i)
                        documents.append(chunk)
                        metadatas.append({
                            "source": str(relative_path),
                            "chunk": i,
                            "title": file_path.stem,
                            "file_type": file_path.suffix,
                            "content_type": content_type,
                            "directory": str(relative_path.parent),
                            "security_level": self._determine_security_level(relative_path)
                        })
                        ids.append(doc_id)
                    print(f"Processed: {relative_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

    def _chunk_code(self, content: str, file_type: str) -> List[str]:
        if file_type in ['.py', '.js', '.ts']:
            chunks = []
            current_chunk = []
            lines = content.split('\n')
            for line in lines:
                if any(keyword in line for keyword in ['def ', 'class ', 'function ', 'const ', 'let ', 'var ']):
                    if current_chunk:
                        chunks.append('\n'.join(current_chunk))
                        current_chunk = []
                current_chunk.append(line)
            if current_chunk:
                chunks.append('\n'.join(current_chunk))
            return chunks if chunks else [content]
        else:
            return self._smart_chunk_text(content)

    def _smart_chunk_text(self, content: str, max_chunk_size: int = 1000) -> List[str]:
        lines = content.split('\n')
        chunks = []
        current_chunk = []
        current_size = 0
        for line in lines:
            line_len = len(line) + 1
            if current_size + line_len > max_chunk_size and current_chunk:
                chunks.append('\n'.join(current_chunk))
                current_chunk = []
                current_size = 0
            current_chunk.append(line)
            current_size += line_len
        if current_chunk:
            chunks.append('\n'.join(current_chunk))
        return chunks

    def _determine_security_level(self, path: Path) -> str:
        sensitive_patterns = ['**/contracts/**', '**/security/**', '**/*.env*']
        protected_patterns = ['**/config/**', '**/lib/**', '**/core/**']
        path_str = str(path)

        if any(fnmatch.fnmatch(path_str, pattern) for pattern in sensitive_patterns):
            return 'sensitive'
        if any(fnmatch.fnmatch(path_str, pattern) for pattern in protected_patterns):
            return 'protected'
        return 'public'

    def get_relevant_context(self, query: str, n_results: int = 5, filters: Dict = None) -> str:
        # If filters is None or empty, don't use where
        if filters and any(filters.values()):
            where_filters = {k: {"$eq": v} for k, v in filters.items() if v}
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results,
                where=where_filters
            )
        else:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results
            )

        docs = results.get('documents', [[]])[0]
        return "\n\n".join(docs)

    def chat(self, user_input: str) -> str:
        try:
            # Simple detection of query type
            is_code_query = any(keyword in user_input.lower() for keyword in ['code', 'codebase', 'show me', 'smart contract'])
            is_token_query = any(keyword in user_input.lower() for keyword in ['token', 'xyn', 'supply', 'tokenomics'])
            is_team_query = any(keyword in user_input.lower() for keyword in ['ceo', 'team', 'founder'])

            if is_code_query:
                filters = {"content_type": "code"}
            elif is_token_query:
                filters = {"title": "tokenomics"}
            elif is_team_query:
                filters = {"title": "story"}
            else:
                filters = None

            context = self.get_relevant_context(user_input, n_results=5, filters=filters)

            prompt = f"""You are Ava, the advanced AI assistant for Galactic Eden. You have full knowledge of the project's code, documentation, and story.

Conversation History:
{self._format_history()}

Current Question: {user_input}

Relevant Context:
{context}

Instructions:
- Be conversational and helpful
- Use information from the context if available
- If no direct info found, reason based on what you know
- Be friendly and give direct answers

Answer:"""

            response = self.llm(prompt=prompt, max_tokens=1024, temperature=0.7, top_p=0.9)
            answer = response["choices"][0]["text"].strip()

            self.conversation_history.extend([user_input, answer])
            if len(self.conversation_history) > self.max_history * 2:
                self.conversation_history = self.conversation_history[-self.max_history * 2:]

            return answer
        except Exception as e:
            print(f"Chat error: {str(e)}")
            return "I apologize, but I encountered an error. Please try asking your question again."

    def _format_history(self) -> str:
        if not self.conversation_history:
            return ""
        formatted = []
        for i in range(0, len(self.conversation_history), 2):
            if i + 1 < len(self.conversation_history):
                formatted.append(f"Human: {self.conversation_history[i]}")
                formatted.append(f"Assistant: {self.conversation_history[i+1]}")
        return "\n".join(formatted[-6:])