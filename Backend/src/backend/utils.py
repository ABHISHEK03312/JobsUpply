from .serializers import UserSerializer

def my_jwt_response_handler(token, user=None, request=None):
    print("JWT response handler called")
    return {
        'token': token,
        'user': UserSerializer(user, context={'request': request}).data
    }