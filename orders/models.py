from django.db import models
from customers.models import Customer
from products.models import Product


class Order(models.Model):
    STATUS_CHOICES = [
        ('registered', 'ثبت شده'),
        ('cutting', 'برش'),
        ('sewing', 'دوخت'),
        ('quality', 'کنترل کیفیت'),
        ('warehouse', 'انبار'),
        ('delivered', 'تحویل داده شد'),
        ('cancelled', 'لغو شده'),
    ]

    order_code = models.CharField(max_length=20, unique=True, verbose_name='کد سفارش')
    sepidar_code = models.CharField(max_length=50, blank=True, null=True, verbose_name='کد سپیدار')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, verbose_name='مشتری')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='registered', verbose_name='وضعیت')
    description = models.TextField(blank=True, verbose_name='توضیحات')

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ثبت')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='آخرین ویرایش')

    class Meta:
        verbose_name = 'سفارش'
        verbose_name_plural = 'سفارشات'
        ordering = ['-created_at']

    @property
    def total_amount(self):
        return sum(item.total_price for item in self.items.all())

    def __str__(self):
        return f"{self.order_code} - {self.customer.name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT, verbose_name="محصول")

    quantity = models.PositiveIntegerField(verbose_name="تعداد")
    weight = models.DecimalField(max_digits=8, decimal_places=2, verbose_name='وزن (KG)')
    length = models.DecimalField(max_digits=8, decimal_places=2, verbose_name='طول (CM)')
    width = models.DecimalField(max_digits=8, decimal_places=2, verbose_name='عرض (CM)')

    @property
    def total_price(self):
        # فقط همین خط اصلاح شده — هیچ چیز دیگری تغییر نکرده
        return self.quantity * self.product.unit_price

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
