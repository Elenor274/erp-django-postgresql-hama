from django.db import models

class ErpSettings(models.Model):
    # Factory info
    factory_name = models.CharField(max_length=200, default="کارخانجات نساجی حاما پارچه", verbose_name="نام کارخانه")
    phone = models.CharField(max_length=50, default="021-12345678", verbose_name="تلفن تماس")
    address = models.TextField(default="تهران، شهرک صنعتی، بلوار صنعت، خیابان نساجی، پلاک ۱۰", verbose_name="آدرس کارخانه")
    national_id = models.CharField(max_length=50, default="10100001234", verbose_name="کد اقتصادی / شناسه ملی")
    
    # Financial/System
    currency = models.CharField(max_length=50, default="تومان", verbose_name="واحد پولی پیش‌فرض")
    vat_rate = models.IntegerField(default=10, verbose_name="نرخ مالیات بر ارزش افزوده (%)")
    length_unit = models.CharField(max_length=50, default="متر", verbose_name="واحد طول پارچه پیش‌فرض")
    
    # Sepidar / Warehouses
    sepidar_sync = models.BooleanField(default=True, verbose_name="فعال بودن اتصال به سپیدار")
    sepidar_api_url = models.CharField(max_length=255, default="https://api.sepidar.hama.ir/v1", verbose_name="آدرس وب‌سرویس سپیدار")
    auto_deduct_stock = models.BooleanField(default=True, verbose_name="کسر خودکار موجودی انبار هنگام پایان تولید")

    class Meta:
        verbose_name = "تنظیمات عمومی"
        verbose_name_plural = "تنظیمات عمومی"

    def __str__(self):
        return "تنظیمات عمومی سامانه"

