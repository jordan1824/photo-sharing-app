from django.urls import path

from . import views
from .views import ProfileUpdateView

urlpatterns = [
    path('profile/<str:username>/', views.profile, name='profile'),
    path('profile/<int:pk>/update/',
         ProfileUpdateView.as_view(), name='edit-profile'),
    path('list/', views.user_list, name='user-list')
]
