from django.shortcuts import render, get_object_or_404
from warehouse.models import Warehouse, StockTransaction
from django.contrib.auth.decorators import login_required

@login_required
def stock_transactions(request, pk):
    warehouse = get_object_or_404(Warehouse, pk=pk)

    transactions = StockTransaction.objects.filter(
        warehouse=warehouse
    ).select_related("product", "user").order_by("-created_at")

    return render(request, "warehouse/stock_transactions.html", {
        "warehouse": warehouse,
        "transactions": transactions
    })
