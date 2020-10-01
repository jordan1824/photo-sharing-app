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
import re
from django.contrib import messages


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


errors = []

def quickCheck(input, max, name):
    if not(input):
        errors.append(f"You must provide a valid {name}.")
    if len(input) > max:
        errors.append(f"Your {name} cannot exceed {max} characters.")
    if name != "password":
        for symbol in "[$&+,:;=?@#|<>.^*()%!_-]":
            if symbol in input:
                errors.append(f"Your {name} cannot contain special characters.")
                break

def register(request):
    if request.method == "POST":
        # Clears errors list from previous post
        errors.clear()
        # Grabs all data submitted
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password_confirm = request.POST['password_confirm']
        # Applies length check, special character check, & makes sure each field has submitted data
        quickCheck(username, 50, "username")
        quickCheck(password, 50, "password")
        # Other important validation checks
        if 0 < len(username) < 4:
            errors.append("Your username must be at least 4 characters long.")
        if 0 < len(password) < 8:
            errors.append("Your password must be at least 8 characters long.")
        if len(email) > 200:
            errors.append("Your email cannot exceed 200 characters.")
        if not(re.match("[A-Za-z0-9]+@[a-zA-Z]+\.[a-zA-Z]+", email)):
            errors.append("You must provide a valid email address.")
        if password != password_confirm:
            errors.append("Your passwords did not match.")
        # Check to see if there are any errors, if so redirects back to page
        if len(errors) > 0:
            for message in errors:
                messages.error(request, message)
            return redirect("/user/register")
        else:
            # Else, check if username & email are taken
            usernameResult = User.objects.filter(username=username).all()
            if usernameResult:
                messages.error(request, "That username is already taken.")
                return redirect("/user/register")
            emailResult = User.objects.filter(email=email).all()
            if emailResult:
                messages.error(request, "That email is already connected to an account.")
                return redirect("/user/register")
            # At this point, all the data is validated, so I create a new user with the data
            user = User.objects.create(username=username, email=email)
            user.set_password(password)
            user.save()
            messages.success(request, f'Your account was successfully registered.')
            return redirect('login')
    else:
        # This is for when a GET request is made to this view
        return render(request, "users/register.html", {
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
