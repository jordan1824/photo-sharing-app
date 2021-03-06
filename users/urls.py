from django.urls import path

from . import views

urlpatterns = [
    path('profile/<str:username>/', views.profile, name='profile'),
    path('update-profile/', views.update_profile, name='edit-profile'),
    path('list/', views.user_list, name='user-list'),
    path('follow/<int:pk>/', views.follow, name='follow'),
    path('unfollow/<int:pk>/', views.unfollow, name='unfollow'),
    path('followers/<str:username>/', views.followers, name='followers'),
    path('following/<str:username>/', views.following, name='following'),
    path('register/', views.register, name='register')
]
