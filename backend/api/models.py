from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=512)
    author = models.CharField(max_length=256, null=True, blank=True)
    rating = models.CharField(max_length=64, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    url = models.URLField(max_length=1024, null=True, blank=True)
    cover_image_url = models.URLField(max_length=1024, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
