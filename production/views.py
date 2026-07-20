from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.core.paginator import Paginator

from .models import Machine, Operator, WorkStage, Planning, MaintenanceActivity
from .forms import MachineForm, OperatorForm, WorkStageForm, PlanningForm, MaintenanceActivityForm

# =====================================================================
# برنامه‌ریزی تولید
# =====================================================================

@login_required
def planning_list(request):
    query = request.GET.get('q', '')
    status_filter = request.GET.get('status', '')
    sort = request.GET.get('sort', '-created_at')
    direction = request.GET.get('dir', 'desc')
    page_number = request.GET.get('page', 1)

    plans = Planning.objects.all().select_related('order', 'product', 'machine', 'operator', 'stage')

    # جستجو
    if query:
        plans = plans.filter(
            Q(planning_code__icontains=query) |
            Q(product__name__icontains=query) |
            Q(machine__name__icontains=query) |
            Q(operator__last_name__icontains=query) |
            Q(order__order_code__icontains=query)
        )

    # فیلتر وضعیت
    if status_filter:
        plans = plans.filter(status=status_filter)

    # مرتب‌سازی
    sort_field = sort
    if direction == 'desc' and not sort.startswith('-'):
        sort_field = '-' + sort
    elif direction == 'asc' and sort.startswith('-'):
        sort_field = sort[1:]

    plans = plans.order_by(sort_field)

    paginator = Paginator(plans, 10)
    page_obj = paginator.get_page(page_number)

    status_choices = Planning.STATUS_CHOICES

    return render(request, 'production/planning_list.html', {
        'page_obj': page_obj,
        'query': query,
        'status_filter': status_filter,
        'status_choices': status_choices,
        'sort': sort,
        'direction': direction,
    })


@login_required
def planning_detail(request, pk):
    plan = get_object_or_404(Planning, pk=pk)
    return render(request, 'production/planning_detail.html', {'plan': plan})


@login_required
def planning_create(request):
    if request.method == 'POST':
        form = PlanningForm(request.POST)
        if form.is_valid():
            plan = form.save()
            
            # کسر اتوماتیک در صورتی که وضعیت از همان ابتدا تولید یا تکمیل باشد
            if plan.status in ['producing', 'completed'] and not plan.material_deducted:
                success, msg = plan.deduct_inventory(user=request.user)
                if success:
                    messages.success(request, f"برنامه‌ریزی ثبت شد. {msg}")
                else:
                    messages.warning(request, f"برنامه‌ریزی ثبت شد ولی: {msg}")
            else:
                messages.success(request, "برنامه‌ریزی تولید با موفقیت ثبت شد.")
                
            return redirect('production:planning_list')
    else:
        form = PlanningForm()

    return render(request, 'production/planning_create.html', {'form': form})


@login_required
def planning_edit(request, pk):
    plan = get_object_or_404(Planning, pk=pk)
    old_status = plan.status

    if request.method == 'POST':
        form = PlanningForm(request.POST, instance=plan)
        if form.is_valid():
            updated_plan = form.save()
            
            # کسر اتوماتیک در صورتی که وضعیت به در حال تولید یا تکمیل تغییر یابد و کسر نشده باشد
            if updated_plan.status in ['producing', 'completed'] and not updated_plan.material_deducted:
                success, msg = updated_plan.deduct_inventory(user=request.user)
                if success:
                    messages.success(request, f"برنامه‌ریزی ویرایش شد. {msg}")
                else:
                    messages.warning(request, f"برنامه‌ریزی ویرایش شد ولی: {msg}")
            else:
                messages.success(request, "برنامه‌ریزی تولید با موفقیت ویرایش شد.")
                
            return redirect('production:planning_list')
    else:
        form = PlanningForm(instance=plan)

    return render(request, 'production/planning_edit.html', {'form': form, 'plan': plan})


@login_required
def planning_delete(request, pk):
    plan = get_object_or_404(Planning, pk=pk)
    if request.method == 'POST':
        plan.delete()
        messages.success(request, "برنامه‌ریزی تولید با موفقیت حذف شد.")
        return redirect('production:planning_list')
    return render(request, 'production/planning_confirm_delete.html', {'plan': plan})


@login_required
def planning_deduct(request, pk):
    """
    متد دستی کسر موجودی انبار برای یک برنامه‌ریزی تولید خاص
    """
    plan = get_object_or_404(Planning, pk=pk)
    success, msg = plan.deduct_inventory(user=request.user)
    if success:
        messages.success(request, msg)
    else:
        messages.error(request, msg)
    return redirect('production:planning_detail', pk=pk)


# =====================================================================
# ماشین‌آلات
# =====================================================================

@login_required
def machine_list(request):
    machines = Machine.objects.all().order_by('machine_code')
    return render(request, 'production/machine_list.html', {'machines': machines})


@login_required
def machine_create(request):
    if request.method == 'POST':
        form = MachineForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "ماشین جدید با موفقیت اضافه شد.")
            return redirect('production:machine_list')
    else:
        form = MachineForm()
    return render(request, 'production/machine_create.html', {'form': form})


@login_required
def machine_edit(request, pk):
    machine = get_object_or_404(Machine, pk=pk)
    if request.method == 'POST':
        form = MachineForm(request.POST, instance=machine)
        if form.is_valid():
            form.save()
            messages.success(request, "ماشین با موفقیت ویرایش شد.")
            return redirect('production:machine_list')
    else:
        form = MachineForm(instance=machine)
    return render(request, 'production/machine_edit.html', {'form': form, 'machine': machine})


@login_required
def machine_delete(request, pk):
    machine = get_object_or_404(Machine, pk=pk)
    if request.method == 'POST':
        machine.delete()
        messages.success(request, "ماشین با موفقیت حذف شد.")
        return redirect('production:machine_list')
    return render(request, 'production/machine_confirm_delete.html', {'machine': machine})


# =====================================================================
# اپراتورها
# =====================================================================

@login_required
def operator_list(request):
    operators = Operator.objects.all().order_by('operator_code')
    return render(request, 'production/operator_list.html', {'operators': operators})


@login_required
def operator_create(request):
    if request.method == 'POST':
        form = OperatorForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "اپراتور جدید با موفقیت ثبت شد.")
            return redirect('production:operator_list')
    else:
        form = OperatorForm()
    return render(request, 'production/operator_create.html', {'form': form})


@login_required
def operator_edit(request, pk):
    operator = get_object_or_404(Operator, pk=pk)
    if request.method == 'POST':
        form = OperatorForm(request.POST, instance=operator)
        if form.is_valid():
            form.save()
            messages.success(request, "اپراتور با موفقیت ویرایش شد.")
            return redirect('production:operator_list')
    else:
        form = OperatorForm(instance=operator)
    return render(request, 'production/operator_edit.html', {'form': form, 'operator': operator})


@login_required
def operator_delete(request, pk):
    operator = get_object_or_404(Operator, pk=pk)
    if request.method == 'POST':
        operator.delete()
        messages.success(request, "اپراتور با موفقیت حذف شد.")
        return redirect('production:operator_list')
    return render(request, 'production/operator_confirm_delete.html', {'operator': operator})


# =====================================================================
# مراحل کاری
# =====================================================================

@login_required
def stage_list(request):
    stages = WorkStage.objects.all().order_by('code')
    return render(request, 'production/stage_list.html', {'stages': stages})


@login_required
def stage_create(request):
    if request.method == 'POST':
        form = WorkStageForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "مرحله کاری جدید با موفقیت تعریف شد.")
            return redirect('production:stage_list')
    else:
        form = WorkStageForm()
    return render(request, 'production/stage_create.html', {'form': form})


@login_required
def stage_edit(request, pk):
    stage = get_object_or_404(WorkStage, pk=pk)
    if request.method == 'POST':
        form = WorkStageForm(request.POST, instance=stage)
        if form.is_valid():
            form.save()
            messages.success(request, "مرحله کاری با موفقیت ویرایش شد.")
            return redirect('production:stage_list')
    else:
        form = WorkStageForm(instance=stage)
    return render(request, 'production/stage_edit.html', {'form': form, 'stage': stage})


@login_required
def stage_delete(request, pk):
    stage = get_object_or_404(WorkStage, pk=pk)
    if request.method == 'POST':
        stage.delete()
        messages.success(request, "مرحله کاری با موفقیت حذف شد.")
        return redirect('production:stage_list')
    return render(request, 'production/stage_confirm_delete.html', {'stage': stage})


# =====================================================================
# نگهداری و تعمیرات (نت)
# =====================================================================

@login_required
def maintenance_list(request):
    query = request.GET.get('q', '')
    repair_type_filter = request.GET.get('repair_type', '')
    dept_filter = request.GET.get('dept', '')
    stoppage_filter = request.GET.get('stoppage', '')
    
    records = MaintenanceActivity.objects.all().select_related('machine', 'operator')
    
    if query:
        records = records.filter(
            Q(maintenance_code__icontains=query) |
            Q(machine__name__icontains=query) |
            Q(machine__machine_code__icontains=query) |
            Q(location__icontains=query) |
            Q(execution_group__icontains=query) |
            Q(consumables_used__icontains=query)
        )
        
    if repair_type_filter:
        records = records.filter(repair_type=repair_type_filter)
        
    if dept_filter:
        records = records.filter(requester_unit=dept_filter)
        
    if stoppage_filter == 'yes':
        records = records.filter(has_stoppage=True)
    elif stoppage_filter == 'no':
        records = records.filter(has_stoppage=False)
        
    paginator = Paginator(records, 15)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'production/maintenance_list.html', {
        'page_obj': page_obj,
        'query': query,
        'repair_types': MaintenanceActivity.REPAIR_TYPES,
        'departments': MaintenanceActivity.DEPARTMENTS,
        'repair_type_filter': repair_type_filter,
        'dept_filter': dept_filter,
        'stoppage_filter': stoppage_filter,
    })


@login_required
def maintenance_detail(request, pk):
    record = get_object_or_404(MaintenanceActivity, pk=pk)
    return render(request, 'production/maintenance_detail.html', {'record': record})


@login_required
def maintenance_create(request):
    if request.method == 'POST':
        form = MaintenanceActivityForm(request.POST)
        if form.is_valid():
            record = form.save()
            messages.success(request, f"درخواست تعمیرات {record.maintenance_code} با موفقیت ثبت گردید.")
            return redirect('production:maintenance_list')
        else:
            messages.error(request, "لطفاً خطاهای فرم را تصحیح فرمایید.")
    else:
        form = MaintenanceActivityForm()
        
    return render(request, 'production/maintenance_create.html', {'form': form})


@login_required
def maintenance_edit(request, pk):
    record = get_object_or_404(MaintenanceActivity, pk=pk)
    if request.method == 'POST':
        form = MaintenanceActivityForm(request.POST, instance=record)
        if form.is_valid():
            record = form.save()
            messages.success(request, f"درخواست تعمیرات {record.maintenance_code} با موفقیت بروزرسانی شد.")
            return redirect('production:maintenance_list')
        else:
            messages.error(request, "لطفاً خطاهای فرم را تصحیح فرمایید.")
    else:
        form = MaintenanceActivityForm(instance=record)
        
    return render(request, 'production/maintenance_edit.html', {'form': form, 'record': record})


@login_required
def maintenance_delete(request, pk):
    record = get_object_or_404(MaintenanceActivity, pk=pk)
    if request.method == 'POST':
        code = record.maintenance_code
        record.delete()
        messages.success(request, f"درخواست تعمیرات {code} با موفقیت حذف گردید.")
        return redirect('production:maintenance_list')
    return render(request, 'production/maintenance_confirm_delete.html', {'record': record})
