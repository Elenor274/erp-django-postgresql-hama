from django.shortcuts import render, get_object_or_404
from warehouse.models import Warehouse, StockItem
from django.contrib.auth.decorators import login_required

@login_required
def stock_list(request, pk):
    warehouse = get_object_or_404(Warehouse, pk=pk)
    stock_items = StockItem.objects.filter(warehouse=warehouse).select_related("product")

    return render(request, "warehouse/stock_list.html", {
        "warehouse": warehouse,
        "stock_items": stock_items
    })
