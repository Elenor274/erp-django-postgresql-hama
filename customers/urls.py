from django.urls import path
from . import views

app_name = 'customers'

urlpatterns = [
    path('', views.customer_list, name='customer_list'),
    path('new/', views.customer_create, name='customer_create'),
    path('<int:pk>/edit/', views.customer_edit, name='customer_edit'),

    # GET → نمایش صفحه تأیید حذف
    path('<int:pk>/delete/', views.customer_delete_confirm, name='customer_delete_confirm'),

    # POST → انجام حذف
    path('<int:pk>/delete/confirm/', views.customer_delete, name='customer_delete'),
]
