from django.contrib import admin
from .models import Warehouse, StockItem, StockTransaction

admin.site.register(Warehouse)
admin.site.register(StockItem)
admin.site.register(StockTransaction)
