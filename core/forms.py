from django import forms
from .models import ErpSettings

class ErpSettingsForm(forms.ModelForm):
    class Meta:
        model = ErpSettings
        fields = [
            'factory_name', 'phone', 'address', 'national_id',
            'currency', 'vat_rate', 'length_unit',
            'sepidar_sync', 'sepidar_api_url', 'auto_deduct_stock'
        ]
        widgets = {
            'factory_name': forms.TextInput(attrs={'class': 'form-control'}),
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'national_id': forms.TextInput(attrs={'class': 'form-control'}),
            'currency': forms.TextInput(attrs={'class': 'form-control'}),
            'vat_rate': forms.NumberInput(attrs={'class': 'form-control'}),
            'length_unit': forms.TextInput(attrs={'class': 'form-control'}),
            'sepidar_sync': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'sepidar_api_url': forms.URLInput(attrs={'class': 'form-control'}),
            'auto_deduct_stock': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
        labels = {
            'factory_name': 'نام کارخانه / شرکت',
            'phone': 'تلفن تماس ثابت',
            'address': 'آدرس فیزیکی کارخانه',
            'national_id': 'شناسه ملی / کد اقتصادی',
            'currency': 'واحد پول پیش‌فرض سیستم',
            'vat_rate': 'نرخ مالیات بر ارزش افزوده (درصد)',
            'length_unit': 'واحد طول پیش‌فرض (پارچه)',
            'sepidar_sync': 'فعال‌سازی همگام‌سازی وب‌سرویس سپیدار',
            'sepidar_api_url': 'آدرس سرور وب‌سرویس سپیدار (API)',
            'auto_deduct_stock': 'کسر خودکار مواد اولیه از انبار در پایان تولید',
        }
