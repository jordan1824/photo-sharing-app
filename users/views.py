from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from .models import Profile
from photo_sharing.models import Post
from django.views.generic import UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.db.models import Q


def profile(request, username):
    user = User.objects.get(username=username)
    posts = Post.objects.filter(user=user).all().order_by('-date_created')
    return render(request, 'users/profile.html', {
        'person': user,
        'posts': posts
    })


class ProfileUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Profile
    fields = ['image', 'bio']
    template_name = 'users/edit_profile.html'

    def test_func(self):
        current_user_profile = self.request.user.profile
        profile_being_accessed = get_object_or_404(
            Profile, id=self.kwargs.get('pk'))
        if current_user_profile == profile_being_accessed:
            return True
        return False


def user_list(request):
    query = request.GET.get('q')
    results = User.objects.filter(
        Q(username__icontains=query)).exclude(id=request.user.id).all()
    return render(request, 'users/user_list.html', {
        'results': results
    })
