import React from "react";
import { Order, Customer, Product, StockItem, Warehouse } from "../types";
import { ShoppingBag, Users, Package, Archive, Plus, ArrowLeftRight, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  warehouses: Warehouse[];
  stockItems: StockItem[];
  setCurrentTab: (tab: string) => void;
  setSelectedOrderId: (id: string | null) => void;
}

export default function Dashboard({
  orders,
  customers,
  products,
  warehouses,
  stockItems,
  setCurrentTab,
  setSelectedOrderId,
}: DashboardProps) {
  // Metrics Calculations
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const totalStock = stockItems.reduce((acc, curr) => acc + Number(curr.quantity), 0);

  // Status mapping
  const statusLabels: Record<string, { text: string; bg: string; textCol: string }> = {
    registered: { text: "ثبت شده", bg: "bg-blue-50", textCol: "text-blue-600" },
    cutting: { text: "برش", bg: "bg-amber-50", textCol: "text-amber-600" },
    sewing: { text: "دوخت", bg: "bg-purple-50", textCol: "text-purple-600" },
    quality: { text: "کنترل کیفیت", bg: "bg-indigo-50", textCol: "text-indigo-600" },
    warehouse: { text: "انبار", bg: "bg-sky-50", textCol: "text-sky-600" },
    delivered: { text: "تحویل داده شد", bg: "bg-emerald-50", textCol: "text-emerald-600" },
    cancelled: { text: "لغو شده", bg: "bg-rose-50", textCol: "text-rose-600" },
  };

  const getCustomerName = (id: string) => {
    const cust = customers.find((c) => c.id === id);
    return cust ? `${cust.name} ${cust.last_name}` : "—";
  };

  const calculateOrderTotal = (order: Order) => {
    return order.items.reduce((sum, item) => {
      const prod = products.find((p) => p.id === item.product_id);
      const price = prod ? prod.unit_price : 0;
      return sum + item.quantity * price;
    }, 0);
  };

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const kpis = [
    {
      title: "تعداد کل سفارشات",
      value: totalOrders,
      desc: "سفارشات ثبت شده در سامانه",
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "مشتریان فعال",
      value: totalCustomers,
      desc: "خریداران ثبت نام شده",
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      title: "تنوع محصولات (کالاها)",
      value: totalProducts,
      desc: "قلم کالا در کاتالوگ",
      icon: Package,
      color: "from-amber-500 to-amber-600",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      title: "موجودی کل انبار",
      value: `${totalStock.toLocaleString()} واحد`,
      desc: "کل اقلام موجود در انبارها",
      icon: Archive,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  const quickActions = [
    { label: "ثبت سفارش جدید", icon: Plus, tab: "order_create", color: "bg-brand-500 text-white hover:bg-brand-600" },
    { label: "افزودن مشتری جدید", icon: Plus, tab: "customer_create", color: "bg-slate-100 text-slate-700 hover:bg-slate-200" },
    { label: "مدیریت و انتقال انبار", icon: ArrowLeftRight, tab: "warehouse", color: "bg-slate-100 text-slate-700 hover:bg-slate-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">داشبورد سیستم مدیریت</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">خلاصه وضعیت، سفارشات اخیر و کنترل انبار حاما پارچه</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-sm">
          <Clock className="w-4 h-4 text-brand-500" />
          <span>امروز: ۲۸ تیر ۱۴۰۵</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400">{kpi.title}</span>
                  <div className="text-xl font-extrabold text-slate-800 mt-1">{kpi.value}</div>
                </div>
                <div className={`w-11 h-11 rounded-lg ${kpi.bg} ${kpi.text} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-[10px] font-medium text-slate-400 mt-3">{kpi.desc}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Orders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Left 2 Columns */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-50">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">آخرین سفارشات ثبت شده</h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">سفارشات جدید و وضعیت‌های کاری آن‌ها</p>
            </div>
            <button
              onClick={() => setCurrentTab("orders")}
              className="text-xs font-bold text-brand-500 hover:text-brand-600 hover:underline"
            >
              مشاهده همه
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">هیچ سفارشی ثبت نشده است.</div>
            ) : (
              <table className="w-full text-right text-xs mt-3">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-50">
                    <th className="py-2.5">کد سفارش</th>
                    <th className="py-2.5">مشتری</th>
                    <th className="py-2.5">مجموع (ریال)</th>
                    <th className="py-2.5 text-center">وضعیت</th>
                    <th className="py-2.5 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order) => {
                    const status = statusLabels[order.status] || { text: order.status, bg: "bg-slate-50", textCol: "text-slate-600" };
                    return (
                      <tr key={order.id} className="text-slate-700 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 font-bold text-slate-800">{order.order_code}</td>
                        <td className="py-3">{getCustomerName(order.customer_id)}</td>
                        <td className="py-3 font-medium text-slate-800">
                          {calculateOrderTotal(order).toLocaleString()}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.textCol}`}>
                            {status.text}
                          </span>
                        </td>
                        <td className="py-3 text-left">
                          <button
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setCurrentTab("orders");
                            }}
                            className="text-[10px] font-bold text-brand-500 hover:text-brand-600 bg-brand-50 hover:bg-brand-100 px-2 py-1 rounded"
                          >
                            جزئیات
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Tools & Info - Right Column */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-50">دسترسی سریع</h2>
            <div className="space-y-3 mt-4">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentTab(action.tab)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all duration-150 shadow-sm ${action.color}`}
                  >
                    <span>{action.label}</span>
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick System Stats */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-50">اطلاعات سامانه</h2>
            <div className="space-y-3 mt-4 text-xs font-medium text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">نسخه پایگاه داده</span>
                <span className="font-mono text-slate-800 font-bold">Local-v1.0 (In-Memory)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">انبار فعال</span>
                <span className="text-slate-800 font-bold">{warehouses.length} انبار بزرگ</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">کالاهای تعریف شده</span>
                <span className="text-slate-800 font-bold">{totalProducts} کالا</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">موتور برنامه</span>
                <span className="text-brand-500 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                  فعال (React-SPA)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
