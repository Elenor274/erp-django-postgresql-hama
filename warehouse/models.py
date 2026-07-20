from django.db import models
from django.contrib.auth.models import User
from products.models import Product


# ============================
#   مدل انبار
# ============================
class Warehouse(models.Model):
    WAREHOUSE_TYPES = (
        ("raw_material", "مواد اولیه"),
        ("finished_goods", "محصول نهایی"),
        ("semi_finished", "نیمه‌ساخته"),
        ("other", "سایر"),
    )

    name = models.CharField(max_length=100, verbose_name="نام انبار")
    code = models.CharField(max_length=50, unique=True, verbose_name="کد انبار")
    description = models.TextField(blank=True, null=True, verbose_name="توضیحات")

    warehouse_type = models.CharField(
        max_length=50,
        choices=WAREHOUSE_TYPES,
        default="raw_material",
        verbose_name="نوع انبار",
    )

    class Meta:
        verbose_name = "انبار"
        verbose_name_plural = "انبارها"

    def __str__(self):
        return f"{self.code} - {self.name}"


# ============================
#   موجودی کالا در انبار
# ============================
class StockItem(models.Model):
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, verbose_name="انبار")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="کالا")

    quantity = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="موجودی فعلی")

    min_stock = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="حداقل موجودی")
    max_stock = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, verbose_name="حداکثر موجودی")

    reorder_point = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name="نقطه سفارش",
    )

    class Meta:
        unique_together = ("warehouse", "product")
        verbose_name = "موجودی کالا"
        verbose_name_plural = "موجودی کالاها"

    def __str__(self):
        return f"{self.product} @ {self.warehouse} = {self.quantity}"

    @property
    def reorder_status(self):
        if self.quantity <= 0:
            return "🔴 تمام شده"
        if self.quantity <= self.min_stock:
            return "🟠 کمبود"
        if self.quantity <= self.reorder_point:
            return "🟡 نقطه سفارش"
        return "🟢 موجودی کافی"


# ============================
#   تراکنش‌های انبار
# ============================
class StockTransaction(models.Model):
    IN = "IN"
    OUT = "OUT"

    TRANSACTION_TYPES = (
        (IN, "ورودی"),
        (OUT, "خروجی"),
    )

    TRANSACTION_CATEGORY_CHOICES = (
        ("foreign_purchase", "خرید خارجی"),
        ("domestic_purchase", "خرید داخلی"),
        ("production", "تولید"),
        ("return", "مرجوعی"),
        ("other", "سایر"),
    )

    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, verbose_name="انبار")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="کالا")

    type = models.CharField(max_length=3, choices=TRANSACTION_TYPES, verbose_name="نوع تراکنش")
    quantity = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="مقدار")

    unit = models.CharField(
        max_length=20,
        default="عدد",
        verbose_name="واحد اندازه‌گیری (متر/عدد/کیلو/بسته)",
    )

    supplier_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="نام تأمین‌کننده",
    )

    delivery_date = models.DateField(
        blank=True,
        null=True,
        verbose_name="تاریخ تحویل",
    )

    consumption_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name="مقدار مصرف",
    )

    transaction_category = models.CharField(
        max_length=50,
        choices=TRANSACTION_CATEGORY_CHOICES,
        default="other",
        verbose_name="نوع تراکنش (خرید/تولید/...)",
    )

    order_remaining = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name="مانده سفارش",
    )

    reference = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="مرجع (سفارش/تولید/رسید)",
    )

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name="کاربر ثبت‌کننده")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت")

    class Meta:
        verbose_name = "تراکنش انبار"
        verbose_name_plural = "تراکنش‌های انبار"

    def __str__(self):
        return f"{self.type} {self.quantity} {self.product} @ {self.warehouse}"
