from django import forms
from .models import Product, ProductGroup


class ProductGroupForm(forms.ModelForm):
    class Meta:
        model = ProductGroup
        fields = ["name"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control-custom"}),
        }


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = [
            "code",
            "group",
            "name",
            "unit",
            "initial_stock",
            "unit_price",
            "description",
        ]

        widgets = {
            "code": forms.TextInput(attrs={"class": "form-control-custom"}),
            "group": forms.Select(attrs={"class": "form-control-custom"}),
            "name": forms.TextInput(attrs={"class": "form-control-custom"}),
            "unit": forms.Select(attrs={"class": "form-control-custom"}),
            "initial_stock": forms.NumberInput(attrs={"class": "form-control-custom"}),
            "unit_price": forms.NumberInput(attrs={"class": "form-control-custom"}),
            "description": forms.Textarea(attrs={"class": "form-control-custom", "rows": 3}),
        }
