"""
URL configuration for baykarpostgre project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from BaykarApp.views import (EmployeeLoginView,TeamListCreateView,
    TeamDetailView,
    EmployeeListCreateView,
    EmployeeDetailView,
    EmployeeTeamView,
    ProductionListCreateView,
    AssemblyListCreateView,
    InventoryAlertsListView,
    TeamPartsView,
    RecyclePartView,
    ProducedAircraftsView,
    AircraftProductionView,
    ReduceStockView,
    AssembleAircraftView,
    ProducedAircraftsView,
    MissingPartsView,
    TeamMembersView,
    get_team_members_by_employee_id,
    employee_parts_view
)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', EmployeeLoginView.as_view(), name='employee-login'),
    path('api/teams/', TeamListCreateView.as_view(), name='team-list-create'),
    path('api/teams/<int:pk>/', TeamDetailView.as_view(), name='team-detail'),
    path("employee-parts/", employee_parts_view, name="employee-parts"),
    path('api/employees/', EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('api/employees/<int:pk>/', EmployeeDetailView.as_view(), name='employee-detail'),
    path('api/production/', ProductionListCreateView.as_view(), name='production-list-create'),
    path('api/assembly/', AssemblyListCreateView.as_view(), name='assembly-list-create'),
    path("employee-parts/<int:employee_id>/", employee_parts_view, name="employee-parts"),
    path('api/inventory-alerts/', InventoryAlertsListView.as_view(), name='inventory-alerts-list'),
    path('api/teams/<int:team_id>/parts/', TeamPartsView.as_view(), name='team-parts'),
    path('api/parts/recycle/', RecyclePartView.as_view(), name='recycle-part'),
    path('api/produced-aircrafts/', ProducedAircraftsView.as_view(), name='produced-aircrafts'),
    path('api/aircrafts/<int:aircraft_id>/production/', AircraftProductionView.as_view(), name='aircraft-production'),
    path('api/parts/reduce-stock/', ReduceStockView.as_view(), name='reduce-stock'),
    path('api/aircrafts/<int:aircraft_id>/assemble/', AssembleAircraftView.as_view(), name='assemble-aircraft'),
    path('api/produced-aircrafts/', ProducedAircraftsView.as_view(), name='produced-aircrafts'),
    path('api/aircrafts/<int:aircraft_id>/missing-parts/', MissingPartsView.as_view(), name='missing-parts'),
    path('api/team-members/<int:employee_id>/', get_team_members_by_employee_id, name='team-members'),
    path('api/team-members/<int:employee_id>/', TeamMembersView.as_view(), name='team-members'),


]
