from .models import Profile

def isFollowing(request):
    if (request.user.username):
        following_list = list(Profile.objects.get(user=request.user).following.all())
    else:
        following_list = 0
    return {
        'following_list': following_list
    }