from django.urls import path

from . import views

urlpatterns = [
    path('request', views.testJsonResponse, name="jsonTest"),
    path('API/Graduates', views.graduateGovAPI, name="graduateAPI"),
    path('API/Vacancies', views.jobVacancyAPI, name="jobVacancyAPI"),
    path('database/Users', views.User_DB, name="userDatabase"),
    path('auth', views.authDB, name="auth"),
    path('database/Skills', views.Skill_DB, name="skillDatabase"),
    path('database/JobCache', views.LinkedIn_Jobs_Cache, name="linkedinJobCache"),
    path('database/Courses', views.Course_DB, name="courseDatabase"),
    path('database/Courses/update', views.update_Course_Skills, name="updateCourses"),
    path('database/Courses/get', views.get_course_by_url, name="getCourseByUrl"),
    path('current_user', views.current_user, name="GetCurrentUser"),
    path('API/Recommend/Jobs', views.recommendIndustries, name="getRecommendedIndustries"),
    path('API/Recommend/Courses', views.recommendCourses, name="getRecommendedCourses"),
    path('API/genOTP', views.OTPCall, name="OTPCall"),
    path('', views.index, name='index'),
]