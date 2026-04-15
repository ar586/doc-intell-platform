from django.apps import AppConfig


class ApiConfig(AppConfig):
    name = "api"

    def ready(self):
        # Re-index all books from the DB into Qdrant on startup
        # Using import inside ready() to avoid early Django setup issues
        try:
            from ai.rag_pipeline import reindex_all_books
            reindex_all_books()
        except Exception as e:
            print(f"RAG startup indexing failed: {e}")
