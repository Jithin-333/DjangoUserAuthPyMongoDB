from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("register/", views.RegisterView.as_view()),
    path("login/", views.LoginView.as_view()),
    path("user/", views.UserView.as_view()),
    path("user_detail/<str:username>/", views.UserDetailView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path("user/<str:user_id>/", views.AdminUserDetailView.as_view()),  
    path("user/<str:user_id>/delete/", views.AdminUserDeleteView.as_view()),

]
