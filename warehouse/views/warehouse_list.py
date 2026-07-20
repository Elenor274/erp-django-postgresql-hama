from django.shortcuts import render
from warehouse.models import Warehouse
from django.contrib.auth.decorators import login_required

@login_required
def warehouse_list(request):
    warehouses = Warehouse.objects.all()

    return render(request, "warehouse/warehouse_list.html", {
        "warehouses": warehouses
    })
