from django.shortcuts import redirect
from django.contrib import messages
from .models import UserProfile

class UserPermissionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            path = request.path
            
            # Auto-ensure user has a UserProfile
            profile, created = UserProfile.objects.get_or_create(user=request.user)
            
            # Superusers have bypass permission
            if not request.user.is_superuser:
                # 1. Users management app (except user profile)
                if path.startswith('/users/') and not path.startswith('/users/profile/'):
                    if not profile.is_admin_user:
                        messages.error(request, "شما دسترسی لازم برای مدیریت کاربران را ندارید.")
                        return redirect('core:dashboard')
                
                # 2. Orders app
                elif path.startswith('/orders/'):
                    if not profile.access_orders:
                        messages.error(request, "شما دسترسی لازم برای مشاهده یا تغییر سفارشات را ندارید.")
                        return redirect('core:dashboard')
                        
                # 3. Customers app
                elif path.startswith('/customers/'):
                    if not profile.access_customers:
                        messages.error(request, "شما دسترسی لازم برای مشاهده یا تغییر مشتریان را ندارید.")
                        return redirect('core:dashboard')
                        
                # 4. Products app
                elif path.startswith('/products/'):
                    if not profile.access_products:
                        messages.error(request, "شما دسترسی لازم برای مشاهده یا تغییر محصولات را ندارید.")
                        return redirect('core:dashboard')
                        
                # 5. Warehouse app
                elif path.startswith('/warehouse/'):
                    if not profile.access_warehouse:
                        messages.error(request, "شما دسترسی لازم برای بخش انبارداری را ندارید.")
                        return redirect('core:dashboard')
                        
                # 6. Production app
                elif path.startswith('/production/'):
                    if not profile.access_production:
                        messages.error(request, "شما دسترسی لازم برای بخش تولید و برنامه‌ریزی را ندارید.")
                        return redirect('core:dashboard')
                        
                # 7. Reports app
                elif path.startswith('/reports/'):
                    if not profile.access_reports:
                        messages.error(request, "شما دسترسی لازم برای بخش گزارشات را ندارید.")
                        return redirect('core:dashboard')

        response = self.get_response(request)
        return response
