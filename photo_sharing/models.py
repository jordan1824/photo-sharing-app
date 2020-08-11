from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post-images')
    description = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} Post'


class PostLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user} - Post #{self.post.id}'
