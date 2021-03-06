from django.urls import path

from . import views

urlpatterns = [
    path('', views.home_feed, name='home'),
    path('post-like/<int:pk>/', views.post_like, name='post-like'),
    path('post-likes/<int:pk>/', views.likes_list, name='likes-list'),
    path('global-posts/', views.global_posts, name='global-posts'),
    path('dynamic-load/', views.dynamic_load, name='dynamic-load'),
    path('dynamic-image-load/', views.dynamic_image_load, name='dynamic-image-load'),
    path('get-post-details/<int:id>/', views.get_single_post, name='get-post-details'),
    path('new-post/', views.create_post, name='create-post'),
    path('update-post/<int:id>/', views.update_post, name='update-post'),
    path('delete-post/<int:id>/', views.delete_post, name='delete-post'),
    path('search/users/', views.get_users, name='get-users'),
    path('post-likes-list/', views.post_likes_list, name='post-likes-list')
]
