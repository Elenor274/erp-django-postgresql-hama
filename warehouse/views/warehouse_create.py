from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from warehouse.models import Warehouse
from warehouse.forms import WarehouseForm

@login_required
def warehouse_create(request):
    if request.method == "POST":
        form = WarehouseForm(request.POST)
        if form.is_valid():
            warehouse = form.save()
            messages.success(request, f"انبار جدید با نام '{warehouse.name}' با موفقیت تعریف شد.")
            return redirect("warehouse:warehouse_detail", pk=warehouse.pk)
    else:
        form = WarehouseForm()
    
    return render(request, "warehouse/warehouse_form.html", {
        "form": form,
    })
