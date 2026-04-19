"""
RAG pipeline — ChromaDB + sentence-transformers for legal document retrieval.
Built by Rudrani Ghosh · lawreformer.com
"""

import os
import chromadb
from chromadb.utils import embedding_functions

CHROMA_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
COLLECTION_NAME = "indian_legal_docs"

# Use sentence-transformers for embeddings (free, local)
_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

_client = chromadb.PersistentClient(path=CHROMA_DIR)


def get_collection():
    return _client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=_ef,
        metadata={"hnsw:space": "cosine"},
    )


def retrieve_context(query: str, top_k: int = 3) -> list[dict]:
    """Retrieve the top-k most relevant legal text chunks for a query."""
    collection = get_collection()

    if collection.count() == 0:
        return [
            {
                "text": (
                    "No legal documents have been ingested yet. "
                    "Please run ingest.py to load the knowledge base."
                ),
                "source": "system",
            }
        ]

    results = collection.query(query_texts=[query], n_results=top_k)

    chunks = []
    for i, doc in enumerate(results["documents"][0]):
        meta = results["metadatas"][0][i] if results["metadatas"] else {}
        chunks.append(
            {
                "text": doc,
                "source": meta.get("source", "Unknown"),
                "distance": results["distances"][0][i] if results["distances"] else 0,
            }
        )
    return chunks
