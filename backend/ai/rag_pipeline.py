from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import os
import random
from google import genai

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QDRANT_PATH = os.path.join(BASE_DIR, "qdrant_storage")

qdrant = QdrantClient(path=QDRANT_PATH)
COLLECTION_NAME = "books_collection"

# gemini-embedding-001 produces 3072-dimensional vectors
EMBEDDING_DIM = 3072

if not qdrant.collection_exists(collection_name=COLLECTION_NAME):
    qdrant.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE),
    )

def get_embedding(text):
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyDwqdPFku-SVynddgGzWxe5EziZkV3nPmY")
    if not GEMINI_API_KEY:
        return [random.random() for _ in range(EMBEDDING_DIM)]

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        result = client.models.embed_content(
            model="models/gemini-embedding-001",
            contents=text,
        )
        return result.embeddings[0].values
    except Exception as e:
        print(f"Warning: Embedding API failed ({e}). Returning random mock vector.")
        return [random.random() for _ in range(EMBEDDING_DIM)]

def add_book_to_index(book_id, title, author, description):
    text_to_embed = f"Title: {title}\nAuthor: {author}\nDescription: {description}"
    vector = get_embedding(text_to_embed)

    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=book_id,
                vector=vector,
                payload={
                    "book_id": book_id,
                    "title": title,
                    "author": author,
                    "description": description
                }
            )
        ]
    )

def search_books(query, top_k=3):
    query_vector = get_embedding(query)
    search_result = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=top_k
    )
    return [hit.payload for hit in search_result.points]

def reindex_all_books():
    """Re-index all books from the database into Qdrant. Safe to call at startup."""
    try:
        from api.models import Book
        books = Book.objects.all()
        count = books.count()
        if count == 0:
            print("RAG: No books in DB to index.")
            return
        print(f"RAG: Re-indexing {count} books into Qdrant...")
        for book in books:
            add_book_to_index(book.id, book.title, book.author or "", book.description or "")
        print(f"RAG: Done indexing {count} books.")
    except Exception as e:
        print(f"RAG: Re-indexing failed: {e}")
