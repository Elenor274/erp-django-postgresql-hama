from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_code', 'customer', 'status', 'created_at', 'total_amount_display')
    list_filter = ('status', 'created_at')
    search_fields = ('order_code', 'customer__name')

    inlines = [OrderItemInline]

    def total_amount_display(self, obj):
        return obj.total_amount
    total_amount_display.short_description = "مبلغ کل"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'weight', 'length', 'width')
