from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='userprofile')
    access_orders = models.BooleanField(default=False, verbose_name="دسترسی به سفارشات")
    access_customers = models.BooleanField(default=False, verbose_name="دسترسی به مشتریان")
    access_products = models.BooleanField(default=False, verbose_name="دسترسی به محصولات")
    access_warehouse = models.BooleanField(default=False, verbose_name="دسترسی به انبار")
    access_production = models.BooleanField(default=False, verbose_name="دسترسی به تولید")
    access_reports = models.BooleanField(default=False, verbose_name="دسترسی به گزارشات")
    is_admin_user = models.BooleanField(default=False, verbose_name="مدیریت کاربران (ادمین)")

    def __str__(self):
        return f"پروفایل {self.user.username}"

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    UserProfile.objects.get_or_create(user=instance)
