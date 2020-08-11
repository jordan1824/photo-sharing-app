from django.shortcuts import render, get_object_or_404, redirect
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


def follow(request, pk):
    if request.user == User.objects.get(id=pk):
        return redirect('home')
    user_profile = User.objects.get(id=request.user.id).profile
    user_profile.following.add(User.objects.get(id=pk))
    return redirect('home')


def unfollow(request, pk):
    user = User.objects.get(id=pk)
    current_user_profile = User.objects.get(id=request.user.id).profile
    current_user_profile.following.remove(user)
    return redirect('home')


def followers(request, username):
    user = User.objects.get(username=username)
    return render(request, 'users/followers.html', {
        'current_user': user,
        'parameter': username,
        'following_list': list(Profile.objects.get(user=request.user).following.all())
    })


def following(request, username):
    user = User.objects.get(username=username)
    return render(request, 'users/following.html', {
        'current_user': user,
        'parameter': username,
        'following_list': list(Profile.objects.get(user=request.user).following.all())
    })
