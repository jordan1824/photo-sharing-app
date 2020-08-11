from django.shortcuts import render, redirect
from django.views.generic import ListView
from .models import Post, PostLike


class PostListView(ListView):
    model = Post

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['post_likes'] = list(PostLike.objects.filter(user=self.request.user).values_list(
            'post_id', flat=True).all())
        return context


def post_like(request, pk):
    user = request.user
    post = Post.objects.get(id=pk)
    if PostLike.objects.filter(user=user, post=post).all():
        PostLike.objects.get(user=user, post=post).delete()
    else:
        PostLike.objects.create(user=user, post=post)
    return redirect('home')


def likes_list(request, pk):
    results = PostLike.objects.filter(post_id=pk).all()
    return render(request, 'photo_sharing/likes_list.html', {
        'results': results
    })
