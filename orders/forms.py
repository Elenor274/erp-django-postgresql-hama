from django import forms
from .models import Order, OrderItem
from django.forms import inlineformset_factory


class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['order_code', 'sepidar_code', 'customer', 'status', 'description']
        widgets = {
            'order_code': forms.TextInput(attrs={'class': 'form-control-custom'}),
            'sepidar_code': forms.TextInput(attrs={'class': 'form-control-custom', 'placeholder': 'مثال: SEP-9812'}),
            'customer': forms.Select(attrs={'class': 'form-control-custom'}),
            'status': forms.Select(attrs={'class': 'form-control-custom'}),
            'description': forms.Textarea(attrs={'class': 'form-control-custom', 'rows': 3}),
        }


class OrderItemForm(forms.ModelForm):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'weight', 'length', 'width']
        widgets = {
            'product': forms.Select(attrs={'class': 'form-control-custom'}),
            'quantity': forms.NumberInput(attrs={'class': 'form-control-custom'}),
            'weight': forms.NumberInput(attrs={'class': 'form-control-custom'}),
            'length': forms.NumberInput(attrs={'class': 'form-control-custom'}),
            'width': forms.NumberInput(attrs={'class': 'form-control-custom'}),
        }


# نسخهٔ صحیح و نهایی — مخصوص ایجاد و ویرایش
OrderItemFormSet = inlineformset_factory(
    Order,
    OrderItem,
    form=OrderItemForm,
    extra=1,          # یک آیتم خالی بساز تا فیلدها نمایش داده شوند
    can_delete=False  # چون دکمه حذف نداریم
)
