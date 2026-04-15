from django.apps import AppConfig


class ApiConfig(AppConfig):
    name = "api"

    def ready(self):
        import os
        import sys
        
        # Prevent the Django auto-reloader parent process from opening Qdrant 
        # and locking out the main worker process.
        if 'runserver' in sys.argv and os.environ.get('RUN_MAIN') != 'true':
            return
            
        # Re-index all books from the DB into Qdrant on startup
        try:
            from ai.rag_pipeline import reindex_all_books
            reindex_all_books()
        except Exception as e:
            print(f"RAG startup indexing failed: {e}")
