# backend/api/url.py

from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'chat_sessions', views.ChatSessionViewSet, basename='chat_sessions')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('send_text_before_login/', views.send_text_before_login, name='send_text_before_login'),
    path('send_text_after_login/', views.send_text_after_login, name='send_text_after_login'),
    path('university_finder_message/', views.university_finder_message, name='university_finder_message'),
    path('Save_University_Fact_Sheet/', views.Save_University_Fact_Sheet, name='Save_University_Fact_Sheet'),
    path('SaveUniversityFacSheet/', views.SaveUniversityFacSheet, name='SaveUniversityFacSheet'),
    path('questionnaire/', views.QuestionnaireView.as_view(), name='questionnaire'),
    path('generate/', views.generate_response, name='generate_response'),
]
