from django.urls import path

from . import views
from .views import PostListView

urlpatterns = [
    path('', PostListView.as_view(), name='home'),
    path('post-like/<int:pk>/', views.post_like, name='post-like'),
    path('post-likes/<int:pk>/', views.likes_list, name='likes-list')
]
