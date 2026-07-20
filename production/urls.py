from django.urls import path
from . import views

app_name = 'production'

urlpatterns = [
    # برنامه‌ریزی تولید
    path('planning/', views.planning_list, name='planning_list'),
    path('planning/create/', views.planning_create, name='planning_create'),
    path('planning/<int:pk>/', views.planning_detail, name='planning_detail'),
    path('planning/<int:pk>/edit/', views.planning_edit, name='planning_edit'),
    path('planning/<int:pk>/delete/', views.planning_delete, name='planning_delete'),
    path('planning/<int:pk>/deduct/', views.planning_deduct, name='planning_deduct'),

    # ماشین‌آلات
    path('machines/', views.machine_list, name='machine_list'),
    path('machines/create/', views.machine_create, name='machine_create'),
    path('machines/<int:pk>/edit/', views.machine_edit, name='machine_edit'),
    path('machines/<int:pk>/delete/', views.machine_delete, name='machine_delete'),

    # اپراتورها
    path('operators/', views.operator_list, name='operator_list'),
    path('operators/create/', views.operator_create, name='operator_create'),
    path('operators/<int:pk>/edit/', views.operator_edit, name='operator_edit'),
    path('operators/<int:pk>/delete/', views.operator_delete, name='operator_delete'),

    # مراحل کاری
    path('stages/', views.stage_list, name='stage_list'),
    path('stages/create/', views.stage_create, name='stage_create'),
    path('stages/<int:pk>/edit/', views.stage_edit, name='stage_edit'),
    path('stages/<int:pk>/delete/', views.stage_delete, name='stage_delete'),

    # نگهداری و تعمیرات (نت)
    path('maintenance/', views.maintenance_list, name='maintenance_list'),
    path('maintenance/create/', views.maintenance_create, name='maintenance_create'),
    path('maintenance/<int:pk>/', views.maintenance_detail, name='maintenance_detail'),
    path('maintenance/<int:pk>/edit/', views.maintenance_edit, name='maintenance_edit'),
    path('maintenance/<int:pk>/delete/', views.maintenance_delete, name='maintenance_delete'),
]
