from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'books', views.BookViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('books/<int:pk>/recommend/', views.recommend_books),
    path('upload/', views.upload_books),
    path('ask/', views.ask_question),
    path('scrape/', views.trigger_scrape),
]
