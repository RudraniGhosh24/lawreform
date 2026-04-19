"""
ingest.py — Load, chunk, and embed Indian legal documents into ChromaDB.
Run once before starting the server: python ingest.py

Built by Rudrani Ghosh · lawreformer.com
"""

import os
import glob
from langchain_text_splitters import RecursiveCharacterTextSplitter
from rag import get_collection

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CHUNK_SIZE = 800
CHUNK_OVERLAP = 150


def load_documents() -> list[dict]:
    """Load all .txt files from the data/ directory."""
    docs = []
    for filepath in sorted(glob.glob(os.path.join(DATA_DIR, "*.txt"))):
        filename = os.path.basename(filepath)
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read().strip()
        if text:
            docs.append({"text": text, "source": filename.replace(".txt", "")})
            print(f"  Loaded: {filename} ({len(text)} chars)")
    return docs


def chunk_documents(docs: list[dict]) -> list[dict]:
    """Split documents into overlapping chunks for embedding."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = []
    for doc in docs:
        splits = splitter.split_text(doc["text"])
        for i, chunk_text in enumerate(splits):
            chunks.append(
                {
                    "id": f"{doc['source']}_chunk_{i}",
                    "text": chunk_text,
                    "source": doc["source"],
                }
            )
    return chunks


def ingest():
    """Main ingestion pipeline."""
    print("=" * 60)
    print("Lawreformer AI — Knowledge Base Ingestion")
    print("=" * 60)

    print("\n1. Loading legal documents...")
    docs = load_documents()
    if not docs:
        print("  ⚠️  No .txt files found in data/ directory.")
        print("  Place legal text files in backend/data/ and re-run.")
        return

    print(f"\n2. Chunking {len(docs)} documents...")
    chunks = chunk_documents(docs)
    print(f"  Created {len(chunks)} chunks (size={CHUNK_SIZE}, overlap={CHUNK_OVERLAP})")

    print("\n3. Embedding and storing in ChromaDB...")
    collection = get_collection()

    # Clear existing data for clean re-ingestion
    existing = collection.count()
    if existing > 0:
        print(f"  Clearing {existing} existing entries...")
        collection.delete(where={"source": {"$ne": ""}})

    # Batch insert (ChromaDB limit is ~5000 per batch)
    batch_size = 500
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        collection.add(
            ids=[c["id"] for c in batch],
            documents=[c["text"] for c in batch],
            metadatas=[{"source": c["source"]} for c in batch],
        )
        print(f"  Inserted batch {i // batch_size + 1} ({len(batch)} chunks)")

    print(f"\n✅ Done! {collection.count()} chunks in ChromaDB.")
    print("   Start the server with: uvicorn main:app --reload")


if __name__ == "__main__":
    ingest()
