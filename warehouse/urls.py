from django.urls import path
from .views.warehouse_list import warehouse_list
from .views.warehouse_create import warehouse_create
from .views.warehouse_detail import warehouse_detail
from .views.stock_list import stock_list
from .views.stock_in import stock_in
from .views.stock_out import stock_out
from .views.stock_transactions import stock_transactions

app_name = "warehouse"

urlpatterns = [
    # لیست انبارها
    path("", warehouse_list, name="warehouse_list"),

    # تعریف انبار جدید
    path("create/", warehouse_create, name="warehouse_create"),

    # جزئیات انبار
    path("<int:pk>/", warehouse_detail, name="warehouse_detail"),


    # موجودی‌های انبار
    path("<int:pk>/stock/", stock_list, name="stock_list"),

    # ورودی انبار
    path("<int:pk>/stock/in/", stock_in, name="stock_in"),

    # خروجی انبار
    path("<int:pk>/stock/out/", stock_out, name="stock_out"),

    # تراکنش‌های انبار
    path("<int:pk>/transactions/", stock_transactions, name="stock_transactions"),
]
