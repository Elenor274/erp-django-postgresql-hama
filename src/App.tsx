import React, { useState, useEffect } from "react";
import { User, Customer, ProductGroup, Product, Order, Warehouse, StockItem, StockTransaction } from "./types";
import {
  initializeDatabase,
  getFromStorage,
  saveToStorage,
  DEFAULT_USER,
  DEFAULT_CUSTOMERS,
  DEFAULT_GROUPS,
  DEFAULT_PRODUCTS,
  DEFAULT_WAREHOUSES,
  DEFAULT_STOCK_ITEMS,
  DEFAULT_ORDERS,
  DEFAULT_TRANSACTIONS,
} from "./data";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Customers from "./components/Customers";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Warehouse from "./components/Warehouse";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Login from "./components/Login";
import { Menu, LogOut, ChevronDown, Bell, Search } from "lucide-react";

export default function App() {
  // Initialize db once
  useEffect(() => {
    initializeDatabase();
  }, []);

  // Authentication State
  const [user, setUser] = useState<User | null>(() => getFromStorage<User | null>("erp_user", null));

  // Application database States
  const [customers, setCustomers] = useState<Customer[]>(() => getFromStorage<Customer[]>("erp_customers", DEFAULT_CUSTOMERS));
  const [groups, setGroups] = useState<ProductGroup[]>(() => getFromStorage<ProductGroup[]>("erp_groups", DEFAULT_GROUPS));
  const [products, setProducts] = useState<Product[]>(() => getFromStorage<Product[]>("erp_products", DEFAULT_PRODUCTS));
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => getFromStorage<Warehouse[]>("erp_warehouses", DEFAULT_WAREHOUSES));
  const [stockItems, setStockItems] = useState<StockItem[]>(() => getFromStorage<StockItem[]>("erp_stock_items", DEFAULT_STOCK_ITEMS));
  const [orders, setOrders] = useState<Order[]>(() => getFromStorage<Order[]>("erp_orders", DEFAULT_ORDERS));
  const [transactions, setTransactions] = useState<StockTransaction[]>(() => getFromStorage<StockTransaction[]>("erp_transactions", DEFAULT_TRANSACTIONS));

  // Sync to Storage on changes
  useEffect(() => {
    saveToStorage("erp_user", user);
  }, [user]);

  useEffect(() => {
    saveToStorage("erp_customers", customers);
  }, [customers]);

  useEffect(() => {
    saveToStorage("erp_groups", groups);
  }, [groups]);

  useEffect(() => {
    saveToStorage("erp_products", products);
  }, [products]);

  useEffect(() => {
    saveToStorage("erp_warehouses", warehouses);
  }, [warehouses]);

  useEffect(() => {
    saveToStorage("erp_stock_items", stockItems);
  }, [stockItems]);

  useEffect(() => {
    saveToStorage("erp_orders", orders);
  }, [orders]);

  useEffect(() => {
    saveToStorage("erp_transactions", transactions);
  }, [transactions]);

  // General layout states
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Auto handle window resizing for sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) {
    return (
      <Login
        onLogin={(username, fullName) => {
          const u: User = { username, full_name: fullName, email: `${username}@hamatextile.com` };
          setUser(u);
        }}
      />
    );
  }

  // Handle Log out
  const handleLogout = () => {
    if (confirm("آیا مایل به خروج از سیستم هستید؟")) {
      setUser(null);
    }
  };

  const getPageTitle = () => {
    switch (currentTab) {
      case "dashboard":
        return "داشبورد مدیریت";
      case "orders":
        return "سفارشات";
      case "order_create":
        return "ثبت سفارش جدید";
      case "customers":
        return "مشتریان";
      case "customer_create":
        return "ثبت مشتری جدید";
      case "products":
        return "محصولات و کاتالوگ";
      case "warehouse":
        return "انبارها و موجودی";
      case "settings":
        return "تنظیمات پیکربندی";
      case "profile":
        return "پروفایل کاربری";
      default:
        return "داشبورد";
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#0f1724] flex font-sans" dir="rtl">
      {/* Right Sidebar navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          // Auto clear select order when changing tabs to keep clean
          if (tab !== "orders") setSelectedOrderId(null);
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={handleLogout}
        userFullName={user.full_name}
      />

      {/* Main layout container */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? "lg:mr-64" : "mr-0"}`}>
        
        {/* Top Header bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm shadow-slate-100/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-extrabold text-slate-800 leading-none">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Search form bar */}
            <div className="relative hidden md:block max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="جستجوی سریع..."
                className="w-full text-xs font-semibold pr-9 pl-3 py-1.5 border border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
                  {user.full_name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-700 hidden sm:inline">{user.full_name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-50 p-1 divide-y divide-slate-50 text-right">
                    <button
                      onClick={() => {
                        setCurrentTab("profile");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-xs font-semibold px-4 py-2.5 hover:bg-slate-50 text-slate-700 rounded-lg block text-right"
                    >
                      مشاهده پروفایل
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab("settings");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-xs font-semibold px-4 py-2.5 hover:bg-slate-50 text-slate-700 rounded-lg block text-right"
                    >
                      تنظیمات سیستم
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-xs font-semibold px-4 py-2.5 hover:bg-rose-50 text-rose-600 rounded-lg block text-right"
                    >
                      خروج از حساب کاربری
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic page content wrapper */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {currentTab === "dashboard" && (
            <Dashboard
              orders={orders}
              customers={customers}
              products={products}
              warehouses={warehouses}
              stockItems={stockItems}
              setCurrentTab={setCurrentTab}
              setSelectedOrderId={setSelectedOrderId}
            />
          )}

          {currentTab === "orders" && (
            <Orders
              orders={orders}
              setOrders={setOrders}
              customers={customers}
              products={products}
              selectedOrderId={selectedOrderId}
              setSelectedOrderId={setSelectedOrderId}
            />
          )}

          {currentTab === "order_create" && (
            <Orders
              orders={orders}
              setOrders={setOrders}
              customers={customers}
              products={products}
              selectedOrderId={selectedOrderId}
              setSelectedOrderId={setSelectedOrderId}
              initialTab="create"
            />
          )}

          {currentTab === "customers" && (
            <Customers
              customers={customers}
              setCustomers={setCustomers}
            />
          )}

          {currentTab === "customer_create" && (
            <Customers
              customers={customers}
              setCustomers={setCustomers}
              initialTab="create"
            />
          )}

          {currentTab === "products" && (
            <Products
              products={products}
              setProducts={setProducts}
              groups={groups}
              setGroups={setGroups}
              stockItems={stockItems}
            />
          )}

          {currentTab === "warehouse" && (
            <Warehouse
              warehouses={warehouses}
              setWarehouses={setWarehouses}
              stockItems={stockItems}
              setStockItems={setStockItems}
              products={products}
              transactions={transactions}
              setTransactions={setTransactions}
              userFullName={user.full_name}
            />
          )}

          {currentTab === "profile" && (
            <Profile
              user={user}
              setUser={setUser}
            />
          )}

          {currentTab === "settings" && (
            <Settings />
          )}
        </main>
      </div>
    </div>
  );
}
