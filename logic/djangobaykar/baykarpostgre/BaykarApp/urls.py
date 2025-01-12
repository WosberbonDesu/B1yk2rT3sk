from django.urls import path
from BaykarApp.views import EmployeeLoginView

urlpatterns = [
    path('api/login/', EmployeeLoginView.as_view(), name='employee-login'),
]
