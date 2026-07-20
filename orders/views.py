# orders/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from .forms import OrderForm, OrderItemFormSet
from .models import Order

# -----------------------------
# ایجاد سفارش
# -----------------------------
@login_required
def order_create(request):
    if request.method == "POST":
        form = OrderForm(request.POST)
        formset = OrderItemFormSet(request.POST)

        if form.is_valid() and formset.is_valid():
            order = form.save()
            formset.instance = order
            formset.save()
            # redirect به صفحهٔ اصلی تا سفارش جدید بلافاصله نمایش داده شود
            return redirect("core:dashboard")

    else:
        form = OrderForm()
        formset = OrderItemFormSet()

    return render(request, "orders/order_create.html", {
        "form": form,
        "formset": formset
    })


# -----------------------------
# لیست سفارش‌ها
# -----------------------------
@login_required
def order_list(request):
    orders = Order.objects.all().order_by("-id")
    return render(request, "orders/order_list.html", {"orders": orders})


# -----------------------------
# جزئیات سفارش
# -----------------------------
@login_required
def order_detail(request, pk):
    order = get_object_or_404(Order, pk=pk)
    items = order.items.all()
    return render(request, "orders/order_detail.html", {
        "order": order,
        "items": items
    })


# -----------------------------
# ویرایش سفارش
# -----------------------------
@login_required
def order_edit(request, pk):
    order = get_object_or_404(Order, pk=pk)

    if request.method == "POST":
        form = OrderForm(request.POST, instance=order)
        formset = OrderItemFormSet(request.POST, instance=order)

        if form.is_valid() and formset.is_valid():
            form.save()
            formset.save()
            # redirect به داشبورد تا تغییرات سریعاً دیده شوند
            return redirect("core:dashboard")

    else:
        form = OrderForm(instance=order)
        formset = OrderItemFormSet(instance=order)

    return render(request, "orders/order_edit.html", {
        "form": form,
        "formset": formset,
        "order": order
    })


# -----------------------------
# حذف سفارش
# -----------------------------
@login_required
@require_POST
def order_delete(request, pk):
    order = get_object_or_404(Order, pk=pk)
    order.delete()
    return redirect("orders:order_list")


@login_required
def order_delete_confirm(request, pk):
    order = get_object_or_404(Order, pk=pk)
    return render(request, "orders/order_delete_confirm.html", {
        "order": order
    })
