import React from "react";
import { Grid, ShoppingBag, PlusSquare, Users, UserPlus, Package, Archive, Settings, User, LogOut, Menu } from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
  userFullName: string;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  isOpen,
  setIsOpen,
  onLogout,
  userFullName,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "داشبورد", icon: Grid, section: "داشبورد" },
    { id: "orders", label: "سفارشات", icon: ShoppingBag, section: "فروش و سفارشات" },
    { id: "order_create", label: "ثبت سفارش", icon: PlusSquare, section: "فروش و سفارشات" },
    { id: "customers", label: "مشتریان", icon: Users, section: "مشتریان و فروش" },
    { id: "customer_create", label: "مشتری جدید", icon: UserPlus, section: "مشتریان و فروش" },
    { id: "products", label: "محصولات", icon: Package, section: "محصولات و انبار" },
    { id: "warehouse", label: "انبارها", icon: Archive, section: "محصولات و انبار" },
    { id: "settings", label: "تنظیمات", icon: Settings, section: "پیکربندی" },
    { id: "profile", label: "پروفایل", icon: User, section: "ابزارها" },
  ];

  const sections = ["داشبورد", "فروش و سفارشات", "مشتریان و فروش", "محصولات و انبار", "پیکربندی", "ابزارها"];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
          onClick={() => setIsIsOpen(false)}
        />
      )}

      <aside
        className={`fixed right-0 top-0 h-screen w-64 bg-white border-l border-slate-100 shadow-xl lg:shadow-none flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-50 gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
            ح
          </div>
          <div>
            <div className="font-bold text-slate-800 text-sm leading-tight">
              حاما <span className="text-brand-500">پارچه</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">سامانه مدیریت ERP</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {sections.map((section) => {
            const items = menuItems.filter((item) => item.section === section);
            if (items.length === 0) return null;

            return (
              <div key={section} className="space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-2">
                  {section}
                </span>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id || (item.id === "orders" && currentTab === "order_edit");
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        if (window.innerWidth < 1024) setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? "bg-gradient-to-l from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/10"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Logout button */}
          <div className="pt-2 border-t border-slate-50">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-all duration-150"
            >
              <LogOut className="w-4.5 h-4.5 text-rose-400" />
              <span>خروج از سیستم</span>
            </button>
          </div>
        </nav>

        {/* User Info Footer */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs uppercase">
            {userFullName.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-slate-700 truncate">{userFullName}</div>
            <div className="text-[10px] text-slate-400 font-medium">سطح دسترسی: مدیر</div>
          </div>
        </div>
      </aside>
    </>
  );
}
