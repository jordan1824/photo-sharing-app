from django.shortcuts import render, redirect
from django.views.generic import ListView, CreateView
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
    newest_posts = Post.objects.filter(user_id__in=following_list).all().order_by('-date_created')[:10]
    return render(request, 'photo_sharing/post_list.html', {
        "post_likes": list(PostLike.objects.filter(user=request.user).values_list('post_id', flat=True).all()),
        "newest_posts": newest_posts
    })

@login_required
def post_like(request, pk):
    user = request.user
    post = Post.objects.get(id=pk)
    if PostLike.objects.filter(user=user, post=post).all():
        PostLike.objects.get(user=user, post=post).delete()
        return HttpResponse("Removed Like")
    else:
        PostLike.objects.create(user=user, post=post)
        return HttpResponse("Added Like")

@login_required
def likes_list(request, pk):
    results = PostLike.objects.filter(post_id=pk).all()
    return render(request, 'photo_sharing/likes_list.html', {
        'results': results
    })

@login_required
def global_posts(request):
    return render(request, 'photo_sharing/global.html', {
        "post_likes": list(PostLike.objects.filter(user=request.user).values_list('post_id', flat=True).all()),
        "all_posts": Post.objects.all().order_by('-date_created')[:9]
    })

@login_required
def dynamic_load(request):
    
    start = int(request.GET["start"])
    end = int(request.GET["end"])

    # Only gets posts of following & current users posts
    following_list = list(Profile.objects.filter(user=request.user).values("following").all())
    following_list = list(map(lambda item: item["following"], following_list))
    following_list.append(request.user.id)

    results = list(Post.objects.filter(user_id__in=following_list).all().values('id', 'user', 'image', 'description', 'date_created').order_by("-date_created"))
    
    posts = []
    
    current_user_post_likes = list(PostLike.objects.filter(user=request.user).all().values("post"))
    current_user_post_likes = [item["post"] for item in current_user_post_likes]

    for item in results[start:end]:
        post = item
        post["authorProfileImage"] = list(Profile.objects.filter(user_id=item['user']).all().values("image"))[0]["image"]
        post["author"] = list(User.objects.filter(id=item['user']).all().values("username"))[0]["username"]
        post["isLiked"] = True if item['id'] in current_user_post_likes else False
        post["postLikesCount"] = PostLike.objects.filter(post_id=item['id']).count()
        post["date_created"] = post["date_created"].strftime("%B %d, %Y")
        posts.append(post)

    if posts:
        return JsonResponse(posts, safe=False)
    else:
        return JsonResponse({"empty": True}, safe=False)

@login_required
def get_single_post(request, id):
    post = list(Post.objects.filter(id=id).all().values('id', 'user', 'image', 'description', 'date_created'))

    if post:
        post = post[0]
        current_user_post_likes = list(PostLike.objects.filter(user=request.user).all().values("post"))
        current_user_post_likes = [item["post"] for item in current_user_post_likes]
        post["authorProfileImage"] = list(Profile.objects.filter(user_id=post['user']).all().values("image"))[0]["image"]
        post["author"] = list(User.objects.filter(id=post['user']).all().values("username"))[0]["username"]
        post["isLiked"] = True if post['id'] in current_user_post_likes else False
        post["postLikesCount"] = PostLike.objects.filter(post_id=post['id']).count()
        post["date_created"] = post["date_created"].strftime("%B %d, %Y")
        return JsonResponse(post, safe=False)
    else:
        raise Http404("Post could not be found.")

@login_required
def dynamic_image_load(request):
    start = int(request.GET["start"])
    end = int(request.GET["end"])

    posts = list(Post.objects.all().values('id', 'image').order_by("-date_created"))

    posts = posts[start:end]

    if posts:
        return JsonResponse(posts, safe=False)
    else:
        return JsonResponse({"empty": True}, safe=False)

@login_required
def create_post(request):
    if request.method == "POST":
        image = request.FILES.get('image')
        description = request.POST.get('description')
        image_type = image.__dict__["content_type"]
        if not image or not description:
            # Add in messages.error message here
            return redirect('/new-post/')
        if image_type != "image/jpeg" and image_type != "image/png":
            # Add in messages.error message here
            return redirect('/new-post/')
        for letter in "<>":
            if letter in description:
                # Add in error message here
                return redirect('/new-post/')
        Post.objects.create(user=request.user, image=image, description=description)
        return redirect(f'/user/profile/{request.user.username}/')
    return render(request, "photo_sharing/create_post.html")

@login_required
def update_post(request, id):
    if request.method == "POST":
        post = Post.objects.get(id=id)
        if not(post):
            raise Http404
        data = json.loads(request.body)
        description = data['description']
        for letter in "<>":
            if letter in description:
                raise Http404()
        if post.user == request.user:
            post.description = description
            post.save()
            return HttpResponse("post updated")
    raise Http404()

@login_required
def delete_post(request, id):
    if request.method == "POST":
        post = Post.objects.get(id=id)
        if not(post):
            raise Http404()
        if post.user == request.user:
            post.delete()
            return HttpResponse("post deleted")
    raise Http404()

@login_required
def get_users(request):
    query = request.GET.get("search")
    users = list(User.objects.filter(username__contains=query).all().values('username', 'id'))
    if len(users) > 5:
        users = users[:4]
    for user in users:
        user["profileImage"] = list(Profile.objects.filter(user_id=user['id']).all().values('image'))[0]['image']
    return JsonResponse(users, safe=False)