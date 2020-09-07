from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.models import User
from .models import Profile
from photo_sharing.models import Post
from django.views.generic import UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.db.models import Q
from .forms import UserRegistrationForm



def profile(request, username):
    user = User.objects.get(username=username)
    posts = Post.objects.filter(user=user).all().order_by('-date_created')
    return render(request, 'users/profile.html', {
        'person': user,
        'posts': posts
    })


def update_profile(request):
    user_profile = Profile.objects.get(user=request.user)
    if request.method == "POST":
        image = request.FILES.get('image')
        bio = request.POST.get('bio')
        if image:
            image_type = image.__dict__["content_type"]
            if image_type != "image/jpeg" and image_type != "image/png":
                # Add in messages.error message here
                return redirect(f'/user/update-profile/')
            # Save image to /media/ folder somehow
            user_profile.image = image
        if not bio:
            return redirect(f'/user/update-profile/')
        for letter in "<>":
            if letter in bio:
                # Add in error message here
                return redirect(f'/user/update-profile/')
        user_profile.bio = bio
        user_profile.save()
        return redirect(f'/user/profile/{request.user.username}/')
    else:
        return render(request, "users/edit_profile.html", {
            "bio": user_profile.__dict__['bio']
        })


def user_list(request):
    query = request.GET.get('q')
    results = User.objects.filter(
        Q(username__icontains=query)).exclude(id=request.user.id).all()
    return render(request, 'users/user_list.html', {
        'results': results,
        'following_list': list(Profile.objects.get(user=request.user).following.all())
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


def register(request):
    if request.method == "POST":
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserRegistrationForm
    return render(request, 'users/register.html', {
        'form': form
    })
