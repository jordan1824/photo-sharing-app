from django.shortcuts import render, redirect
from django.views.generic import ListView
from .models import Post, PostLike
from django.http import HttpResponse, Http404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from users.models import Profile
from django.contrib.auth.models import User
import json
from datetime import datetime


@login_required
def home_feed(request):
    following_list = list(Profile.objects.filter(user=request.user).values("following").all())
    following_list = list(map(lambda item: item["following"], following_list))
    following_list.append(request.user.id)
    all_posts = Post.objects.filter(user_id__in=following_list).all().order_by('-date_created')
    return render(request, "photo_sharing/post_list.html", {
        "post_likes": list(PostLike.objects.filter(user=request.user).values_list('post_id', flat=True).all()),
        "all_posts": all_posts
    })


def post_like(request, pk):
    user = request.user
    post = Post.objects.get(id=pk)
    if PostLike.objects.filter(user=user, post=post).all():
        PostLike.objects.get(user=user, post=post).delete()
        return HttpResponse("Removed Like")
    else:
        PostLike.objects.create(user=user, post=post)
        return HttpResponse("Added Like")


def likes_list(request, pk):
    results = PostLike.objects.filter(post_id=pk).all()
    return render(request, 'photo_sharing/likes_list.html', {
        'results': results
    })


def global_posts(request):
    following_list = list(Profile.objects.filter(user=request.user).values("following").all())
    following_list = list(map(lambda item: item["following"], following_list))
    following_list.append(request.user.id)
    newest_posts = Post.objects.filter(user_id__in=following_list).all().order_by('-date_created')[:10]
    return render(request, 'photo_sharing/global.html', {
        "post_likes": list(PostLike.objects.filter(user=request.user).values_list('post_id', flat=True).all()),
        "newest_posts": newest_posts
    })


def dynamic_load(request):
    # num = request.GET.get("start")
    # Only gets posts of following & current users posts
    following_list = list(Profile.objects.filter(user=request.user).values("following").all())
    following_list = list(map(lambda item: item["following"], following_list))
    following_list.append(request.user.id)

    results = list(Post.objects.filter(user_id__in=following_list).all().values('id', 'user', 'image', 'description', 'date_created').order_by("-date_created"))
    
    posts = []
    
    current_user_post_likes = list(PostLike.objects.filter(user=request.user).all().values("post"))
    current_user_post_likes = [item["post"] for item in current_user_post_likes]

    for item in results:
        post = item
        post["authorProfileImage"] = list(Profile.objects.filter(user_id=item['user']).all().values("image"))[0]["image"]
        post["author"] = list(User.objects.filter(id=item['user']).all().values("username"))[0]["username"]
        post["isLiked"] = True if item['id'] in current_user_post_likes else False
        post["postLikesCount"] = PostLike.objects.filter(post_id=item['id']).count()
        post["date_created"] = post["date_created"].strftime("%B %d, %Y")
        posts.append(post)

    # if num > len(results) - 1:
    #     raise Http404("Post not found.")
    # length = len(results) - 1
    # posts = dict(results[length - num])
    return JsonResponse(posts, safe=False)
