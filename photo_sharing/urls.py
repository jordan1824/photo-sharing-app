from django.urls import path

from . import views

urlpatterns = [
    path('', views.home_feed, name='home'),
    path('post-like/<int:pk>/', views.post_like, name='post-like'),
    path('post-likes/<int:pk>/', views.likes_list, name='likes-list'),
    path('global-posts/', views.global_posts, name='global-posts'),
    path('dynamic-load/', views.dynamic_load, name='dynamic-load')
]
