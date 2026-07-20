from django import forms
from products.models import Product
from .models import StockTransaction, Warehouse


# ============================
#   فرم ورودی انبار (Stock IN)
# ============================
class StockInForm(forms.Form):
    product = forms.ModelChoiceField(
        queryset=Product.objects.all(),
        label="کالا",
        widget=forms.Select(attrs={"class": "form-control-custom"})
    )

    quantity = forms.DecimalField(
        max_digits=12,
        decimal_places=2,
        label="مقدار ورودی",
        widget=forms.NumberInput(attrs={"class": "form-control-custom"})
    )

    unit = forms.CharField(
        max_length=20,
        label="واحد اندازه‌گیری",
        initial="عدد",
        widget=forms.TextInput(attrs={"class": "form-control-custom"})
    )

    supplier_name = forms.CharField(
        max_length=100,
        required=False,
        label="نام تأمین‌کننده",
        widget=forms.TextInput(attrs={"class": "form-control-custom"})
    )

    transaction_category = forms.ChoiceField(
        choices=StockTransaction.TRANSACTION_CATEGORY_CHOICES,
        label="نوع تراکنش",
        widget=forms.Select(attrs={"class": "form-control-custom"})
    )

    delivery_date = forms.DateField(
        required=False,
        label="تاریخ تحویل",
        widget=forms.DateInput(attrs={"class": "form-control-custom", "type": "date"})
    )

    reference = forms.CharField(
        max_length=100,
        required=False,
        label="مرجع",
        widget=forms.TextInput(attrs={"class": "form-control-custom"})
    )

    order_remaining = forms.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
        label="مانده سفارش",
        widget=forms.NumberInput(attrs={"class": "form-control-custom"})
    )


# ============================
#   فرم خروجی انبار (Stock OUT)
# ============================
class StockOutForm(forms.Form):
    product = forms.ModelChoiceField(
        queryset=Product.objects.all(),
        label="کالا",
        widget=forms.Select(attrs={"class": "form-control-custom"})
    )

    quantity = forms.DecimalField(
        max_digits=12,
        decimal_places=2,
        label="مقدار خروجی",
        widget=forms.NumberInput(attrs={"class": "form-control-custom"})
    )

    unit = forms.CharField(
        max_length=20,
        label="واحد اندازه‌گیری",
        initial="عدد",
        widget=forms.TextInput(attrs={"class": "form-control-custom"})
    )

    consumption_amount = forms.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
        label="مقدار مصرف",
        widget=forms.NumberInput(attrs={"class": "form-control-custom"})
    )

    transaction_category = forms.ChoiceField(
        choices=StockTransaction.TRANSACTION_CATEGORY_CHOICES,
        label="نوع تراکنش",
        widget=forms.Select(attrs={"class": "form-control-custom"})
    )

    delivery_date = forms.DateField(
        required=False,
        label="تاریخ تحویل",
        widget=forms.DateInput(attrs={"class": "form-control-custom", "type": "date"})
    )

    reference = forms.CharField(
        max_length=100,
        required=False,
        label="مرجع",
        widget=forms.TextInput(attrs={"class": "form-control-custom"})
    )


# ============================
#   فرم تعریف انبار جدید
# ============================
class WarehouseForm(forms.ModelForm):
    class Meta:
        model = Warehouse
        fields = ["name", "code", "warehouse_type", "description"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control-custom", "placeholder": "نام انبار را وارد کنید..."}),
            "code": forms.TextInput(attrs={"class": "form-control-custom", "placeholder": "کد انبار (مثلاً WH-01)..."}),
            "warehouse_type": forms.Select(attrs={"class": "form-control-custom"}),
            "description": forms.Textarea(attrs={"class": "form-control-custom", "rows": 3, "placeholder": "توضیحات یا آدرس استقرار انبار..."}),
        }

