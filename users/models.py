from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from PIL import Image


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(default='default.jpg', upload_to='profile-image')
    bio = models.CharField(max_length=150)
    following = models.ManyToManyField(User, related_name='followers')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        image = Image.open(self.image.path)
        imageDimensions = (200, 200)
        image.thumbnail(imageDimensions)
        image.save(self.image.path)

    def __str__(self):
        return f'{self.user.username} Profile'

    def get_absolute_url(self):
        return reverse('profile', kwargs={'username': self.user.username})
