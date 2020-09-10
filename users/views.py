from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.models import User
from .models import Profile
from photo_sharing.models import Post
from django.views.generic import UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.db.models import Q
from .forms import UserRegistrationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView, LogoutView
from django.http import HttpResponse


@login_required
def profile(request, username):
    user = User.objects.get(username=username)
    posts = Post.objects.filter(user=user).all().order_by('-date_created')
    return render(request, 'users/profile.html', {
        'person': user,
        'posts': posts,
        'profile': True
    })

@login_required
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

@login_required
def user_list(request):
    query = request.GET.get('q')
    results = User.objects.filter(
        Q(username__icontains=query)).exclude(id=request.user.id).all()
    return render(request, 'users/user_list.html', {
        'results': results,
        'following_list': list(Profile.objects.get(user=request.user).following.all())
    })

@login_required
def follow(request, pk):
    follow_user = User.objects.filter(id=pk).first()
    if not follow_user:
        return HttpResponse("Error")
    if request.user == follow_user:
        return HttpResponse("Error")
    followed_users = list(Profile.objects.get(user=request.user).following.all())
    if follow_user in followed_users:
        return HttpResponse("Error")
    user_profile = User.objects.get(id=request.user.id).profile
    user_profile.following.add(follow_user)
    return HttpResponse("Success")

@login_required
def unfollow(request, pk):
    unfollow_user = User.objects.filter(id=pk).first()
    if not unfollow_user:
        return HttpResponse("Error")
    if request.user == unfollow_user:
        return HttpResponse("Error")
    followed_users = list(Profile.objects.get(user=request.user).following.all())
    if unfollow_user not in followed_users:
        return HttpResponse("Error")
    current_user_profile = User.objects.get(id=request.user.id).profile
    current_user_profile.following.remove(unfollow_user)
    return HttpResponse("Success")

@login_required
def followers(request, username):
    user = User.objects.get(username=username)
    return render(request, 'users/followers.html', {
        'current_user': user,
        'parameter': username,
    })

@login_required
def following(request, username):
    user = User.objects.get(username=username)
    return render(request, 'users/following.html', {
        'current_user': user,
        'parameter': username,
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
        'form': form,
        'register': True
    })

class CustomLoginView(LoginView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["login"] = True
        return context


class CustomLogoutView(LogoutView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["logout"] = True
        return context
