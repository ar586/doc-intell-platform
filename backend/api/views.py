from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from ai.rag_pipeline import add_book_to_index, search_books
from ai.llm import generate_answer, generate_insights

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('-created_at')
    serializer_class = BookSerializer

@api_view(['GET'])
def recommend_books(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=404)
        
    query = f"{book.title} {book.description}"
    results = search_books(query, top_k=4)
    recommendations = [r for r in results if r['book_id'] != book.id][:3]
    return Response({"recommendations": recommendations})

@api_view(['POST'])
def upload_books(request):
    data = request.data
    serializer = BookSerializer(data=data)
    if serializer.is_valid():
        book = serializer.save()
        insights = generate_insights(book.description)
        add_book_to_index(book.id, book.title, book.author, book.description)
        return Response({"book": serializer.data, "insights": insights}, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def ask_question(request):
    question = request.data.get('question', '')
    if not question:
        return Response({"error": "Question is required"}, status=400)
    
    results = search_books(question, top_k=3)
    
    context_texts = []
    for r in results:
        context_texts.append(f"Title: {r['title']}\nAuthor: {r['author']}\nDescription: {r['description']}")
    
    context = "\n---\n".join(context_texts)
    answer = generate_answer(question, context)
    
    return Response({
        "answer": answer,
        "sources": results
    })

@api_view(['POST'])
def trigger_scrape(request):
    """Trigger the book scraper and index the results into the DB and RAG pipeline."""
    try:
        import sys
        import os
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scraper'))
        from scraper import scrape_books

        books_data = scrape_books()
        added = []
        skipped = []

        for b in books_data:
            # Skip if already in DB (match by title)
            if Book.objects.filter(title=b['title']).exists():
                skipped.append(b['title'])
                continue
            serializer = BookSerializer(data=b)
            if serializer.is_valid():
                book = serializer.save()
                add_book_to_index(book.id, book.title, book.author or "", book.description or "")
                added.append(book.title)

        return Response({
            "status": "done",
            "added": len(added),
            "skipped": len(skipped),
            "books": added
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)
