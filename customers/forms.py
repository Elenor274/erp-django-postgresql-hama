from django import forms
from .models import Customer

class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = ['customer_code', 'name', 'last_name','phone_number']
        widgets = {
            'customer_code': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'کد مشتری'}),
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'نام'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'نام خانوادگی'}),
            'phone_number':forms.TextInput(attrs={'class':'form-control','placeholder':'شماره تماس'}),
            }

    def clean_phone_number(self):
        phone =self.cleaned_data.get('phone_number')
        if not phone:
            raise forms.ValidationError("شماره تماس را وارد کنید")
        if not phone.isdigit():
            raise forms.ValidationError("شماره تماس باید عدد باشد")
        if len(phone) != 11:
            raise forms.ValidationError('شماره تماس باید 11 رقم باشد')
        return phone