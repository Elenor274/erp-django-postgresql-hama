from django.db import models

class Customer(models.Model):
    customer_code = models.CharField(max_length=20, unique=True, verbose_name='کد مشتری')
    name = models.CharField(max_length=50, verbose_name='نام مشتری')
    last_name = models.CharField(max_length=50, verbose_name='نام خانوادگی')
    phone_number = models.CharField(max_length=12,default='',verbose_name='شماره تماس')

    class Meta:
        verbose_name = 'مشتری'
        verbose_name_plural = 'مشتریان'

    def __str__(self):
        return f"{self.name} {self.last_name} - {self.customer_code}"
