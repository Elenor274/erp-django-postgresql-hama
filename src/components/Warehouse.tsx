import React, { useState } from "react";
import { Warehouse as WarehouseType, StockItem, Product, StockTransaction } from "../types";
import { Plus, Search, Archive, ArrowDownCircle, ArrowUpCircle, History, Layout, MapPin, X, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface WarehouseProps {
  warehouses: WarehouseType[];
  setWarehouses: (warehouses: WarehouseType[]) => void;
  stockItems: StockItem[];
  setStockItems: (stockItems: StockItem[]) => void;
  products: Product[];
  transactions: StockTransaction[];
  setTransactions: (transactions: StockTransaction[]) => void;
  userFullName: string;
}

export default function Warehouse({
  warehouses,
  setWarehouses,
  stockItems,
  setStockItems,
  products,
  transactions,
  setTransactions,
  userFullName,
}: WarehouseProps) {
  const [activeSubTab, setActiveSubTab] = useState<"warehouses" | "transactions">("warehouses");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);

  // Forms state
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);
  const [isNewWarehouseOpen, setIsNewWarehouseOpen] = useState(false);

  // Stock In Form Data
  const [stockInForm, setStockInForm] = useState({
    warehouse_id: warehouses[0]?.id || "",
    product_id: products[0]?.id || "",
    quantity: 1,
    transaction_category: "domestic_purchase" as StockTransaction["transaction_category"],
    supplier_name: "",
    delivery_date: new Date().toISOString().split("T")[0],
    reference: "",
  });

  // Stock Out Form Data
  const [stockOutForm, setStockOutForm] = useState({
    warehouse_id: warehouses[0]?.id || "",
    product_id: products[0]?.id || "",
    quantity: 1,
    consumption_amount: 0,
    reference: "",
  });

  // New Warehouse Form Data
  const [newWarehouseForm, setNewWarehouseForm] = useState({
    code: "",
    name: "",
    warehouse_type: "raw_material" as WarehouseType["warehouse_type"],
    description: "",
  });

  const getProductDetail = (prodId: string) => {
    return products.find(p => p.id === prodId);
  };

  const getWarehouseName = (whId: string) => {
    return warehouses.find(w => w.id === whId)?.name || "انبار نامشخص";
  };

  const typeLabels: Record<WarehouseType["warehouse_type"], string> = {
    raw_material: "مواد اولیه",
    finished_goods: "محصول نهایی",
    semi_finished: "نیمه‌ساخته",
    other: "سایر",
  };

  const categoryLabels: Record<StockTransaction["transaction_category"], string> = {
    foreign_purchase: "خرید خارجی",
    domestic_purchase: "خرید داخلی",
    production: "تولید",
    return: "مرجوعی",
    other: "سایر",
  };

  // Stock Reorder Status logic
  const getReorderStatus = (item: StockItem) => {
    const qty = Number(item.quantity);
    const min = Number(item.min_stock);
    const rp = Number(item.reorder_point);

    if (qty <= 0) return { text: "🔴 تمام شده", bg: "bg-rose-50", textCol: "text-rose-600" };
    if (qty <= min) return { text: "🟠 کمبود موجودی", bg: "bg-amber-50", textCol: "text-amber-600" };
    if (qty <= rp) return { text: "🟡 نقطه سفارش", bg: "bg-yellow-50", textCol: "text-yellow-600" };
    return { text: "🟢 موجودی کافی", bg: "bg-emerald-50", textCol: "text-emerald-600" };
  };

  // Actions handlers
  const handleStockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(stockInForm.quantity);
    if (!stockInForm.warehouse_id || !stockInForm.product_id || qty <= 0) {
      alert("لطفاً اطلاعات را به درستی پر کنید.");
      return;
    }

    // 1. Update Stock Quantity in the specific warehouse
    const existingIndex = stockItems.findIndex(
      s => s.warehouse_id === stockInForm.warehouse_id && s.product_id === stockInForm.product_id
    );

    let updatedStockItems = [...stockItems];
    if (existingIndex > -1) {
      updatedStockItems[existingIndex] = {
        ...updatedStockItems[existingIndex],
        quantity: Number(updatedStockItems[existingIndex].quantity) + qty,
      };
    } else {
      updatedStockItems.push({
        id: `s_${Date.now()}`,
        warehouse_id: stockInForm.warehouse_id,
        product_id: stockInForm.product_id,
        quantity: qty,
        min_stock: 5,
        reorder_point: 10,
      });
    }
    setStockStockItems(updatedStockItems);

    // 2. Record Stock Transaction
    const newTx: StockTransaction = {
      id: `t_${Date.now()}`,
      warehouse_id: stockInForm.warehouse_id,
      product_id: stockInForm.product_id,
      type: "IN",
      quantity: qty,
      unit: getProductDetail(stockInForm.product_id)?.unit || "واحد",
      transaction_category: stockInForm.transaction_category,
      supplier_name: stockInForm.supplier_name,
      delivery_date: stockInForm.delivery_date,
      reference: stockInForm.reference,
      created_at: new Date().toISOString(),
      user: userFullName,
    };
    setTransactions([newTx, ...transactions]);

    setIsStockInOpen(false);
  };

  const handleStockOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(stockOutForm.quantity);
    if (!stockOutForm.warehouse_id || !stockOutForm.product_id || qty <= 0) {
      alert("لطفاً اطلاعات را به درستی وارد کنید.");
      return;
    }

    // Find existing stock item
    const existingIndex = stockItems.findIndex(
      s => s.warehouse_id === stockOutForm.warehouse_id && s.product_id === stockOutForm.product_id
    );

    if (existingIndex === -1 || Number(stockItems[existingIndex].quantity) < qty) {
      alert("خطا: موجودی انبار برای این کالا کافی نیست!");
      return;
    }

    // 1. Deduct Stock Item quantity
    const updatedStockItems = [...stockItems];
    updatedStockItems[existingIndex] = {
      ...updatedStockItems[existingIndex],
      quantity: Number(updatedStockItems[existingIndex].quantity) - qty,
    };
    setStockStockItems(updatedStockItems);

    // 2. Record Transaction
    const newTx: StockTransaction = {
      id: `t_${Date.now()}`,
      warehouse_id: stockOutForm.warehouse_id,
      product_id: stockOutForm.product_id,
      type: "OUT",
      quantity: qty,
      unit: getProductDetail(stockOutForm.product_id)?.unit || "واحد",
      transaction_category: "other", // default category for outs
      consumption_amount: Number(stockOutForm.consumption_amount),
      reference: stockOutForm.reference,
      created_at: new Date().toISOString(),
      user: userFullName,
    };
    setTransactions([newTx, ...transactions]);

    setIsStockOutOpen(false);
  };

  const handleNewWarehouseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWarehouseForm.code || !newWarehouseForm.name) return;

    if (warehouses.some(w => w.code === newWarehouseForm.code)) {
      alert("کد انبار تکراری است.");
      return;
    }

    const newWh: WarehouseType = {
      id: `w_${Date.now()}`,
      ...newWarehouseForm,
    };
    setWarehouses([...warehouses, newWh]);
    setIsNewWarehouseOpen(false);
  };

  // Helper setter to ensure local storage gets written
  const setStockStockItems = (items: StockItem[]) => {
    setStockItems(items);
  };

  const selectedWarehouse = warehouses.find(w => w.id === selectedWarehouseId);
  const warehouseStocks = stockItems.filter(s => s.warehouse_id === selectedWarehouseId);

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">مدیریت انبارها و موجودی</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">کنترل موجودی کالاها، ثبت ورودی/خروجی و تاریخچه کل تراکنش‌ها</p>
        </div>
        
        <div className="flex gap-2 text-xs font-bold">
          <button
            onClick={() => setIsStockInOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>ورود کالا به انبار</span>
          </button>
          <button
            onClick={() => setIsStockOutOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm"
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>خروج کالا از انبار</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-100 gap-6 text-xs font-bold">
        <button
          onClick={() => {
            setActiveSubTab("warehouses");
            setSelectedWarehouseId(null);
          }}
          className={`pb-3 transition-colors relative ${
            activeSubTab === "warehouses" ? "text-brand-500" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Layout className="w-4 h-4" />
            لیست انبارها
          </span>
          {activeSubTab === "warehouses" && (
            <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-brand-500 rounded" />
          )}
        </button>
        <button
          onClick={() => {
            setActiveSubTab("transactions");
            setSelectedWarehouseId(null);
          }}
          className={`pb-3 transition-colors relative ${
            activeSubTab === "transactions" ? "text-brand-500" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <History className="w-4 h-4" />
            تاریخچه تراکنش‌های انبار
          </span>
          {activeSubTab === "transactions" && (
            <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-brand-500 rounded" />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      {activeSubTab === "warehouses" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Warehouse list */}
          <div className={`bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 ${selectedWarehouseId ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-50">
              <span className="text-xs font-bold text-slate-700">انبارها</span>
              {!selectedWarehouseId && (
                <button
                  onClick={() => setIsNewWarehouseOpen(true)}
                  className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  ساخت انبار جدید
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {warehouses.map((wh) => {
                const isSelected = selectedWarehouseId === wh.id;
                const totalStockInWarehouse = stockItems
                  .filter(s => s.warehouse_id === wh.id)
                  .reduce((sum, curr) => sum + Number(curr.quantity), 0);

                return (
                  <div
                    key={wh.id}
                    onClick={() => setSelectedWarehouseId(wh.id)}
                    className={`p-4 border rounded-xl shadow-sm transition-all duration-200 cursor-pointer flex justify-between items-start ${
                      isSelected
                        ? "border-brand-500 bg-brand-50/10 shadow-md shadow-brand-500/5"
                        : "border-slate-100 bg-white hover:border-slate-200 hover:shadow"
                    }`}
                  >
                    <div className="space-y-1.5 text-right">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-500" />
                        <span className="font-bold text-slate-800 text-xs">{wh.name} ({wh.code})</span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400">
                        نوع انبار: {typeLabels[wh.warehouse_type]}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal line-clamp-1">
                        {wh.description || "بدون توضیحات"}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {totalStockInWarehouse.toLocaleString()} رول/متر
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warehouse stocks detail view */}
          {selectedWarehouseId && selectedWarehouse && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <Archive className="w-4.5 h-4.5 text-brand-500" />
                  <span>موجودی کالاها در {selectedWarehouse.name} ({selectedWarehouse.code})</span>
                </div>
                <button
                  onClick={() => setSelectedWarehouseId(null)}
                  className="p-1 text-slate-400 hover:bg-slate-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                {warehouseStocks.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">هیچ کالایی در این انبار موجود نیست.</div>
                ) : (
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="text-slate-400 font-bold border-b border-slate-100">
                        <th className="py-2.5 px-2">کد کالا</th>
                        <th className="py-2.5 px-2">شرح کالا</th>
                        <th className="py-2.5 px-2">موجودی فعلی</th>
                        <th className="py-2.5 px-2">حداقل موجودی</th>
                        <th className="py-2.5 px-2 text-center">وضعیت انباشت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {warehouseStocks.map((item) => {
                        const prod = getProductDetail(item.product_id);
                        const status = getReorderStatus(item);
                        return (
                          <tr key={item.id} className="text-slate-700 hover:bg-slate-50/20">
                            <td className="py-3 px-2 font-bold">{prod?.code || "—"}</td>
                            <td className="py-3 px-2 font-semibold text-slate-900">{prod?.name || "کالای نامشخص"}</td>
                            <td className="py-3 px-2 font-mono font-bold text-slate-800">
                              {Number(item.quantity).toLocaleString()} {prod?.unit || "واحد"}
                            </td>
                            <td className="py-3 px-2 font-mono text-slate-400">{Number(item.min_stock).toLocaleString()}</td>
                            <td className="py-3 px-2 text-center">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.textCol}`}>
                                {status.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* History log */
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">هیچ تراکنشی ثبت نشده است.</div>
            ) : (
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100">
                    <th className="py-3 px-2">تاریخ ثبت</th>
                    <th className="py-3 px-2">انبار</th>
                    <th className="py-3 px-2">کالا</th>
                    <th className="py-3 px-2">نوع</th>
                    <th className="py-3 px-2">مقدار</th>
                    <th className="py-3 px-2">دسته‌بندی</th>
                    <th className="py-3 px-2">مرجع سند</th>
                    <th className="py-3 px-2">تامین‌کننده</th>
                    <th className="py-3 px-2">کاربر ثبت کننده</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((tx) => {
                    const prod = getProductDetail(tx.product_id);
                    return (
                      <tr key={tx.id} className="text-slate-700 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-2 font-mono text-slate-400">
                          {new Date(tx.created_at).toLocaleString("fa-IR")}
                        </td>
                        <td className="py-3 px-2 font-bold">{getWarehouseName(tx.warehouse_id)}</td>
                        <td className="py-3 px-2 font-semibold text-slate-900">{prod?.name || "کالا"}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.type === "IN" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          }`}>
                            {tx.type === "IN" ? "ورودی" : "خروجی"}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono font-bold text-slate-800">
                          {tx.quantity.toLocaleString()} {tx.unit}
                        </td>
                        <td className="py-3 px-2 font-medium">{categoryLabels[tx.transaction_category] || "سایر"}</td>
                        <td className="py-3 px-2 font-mono text-slate-500">{tx.reference || "—"}</td>
                        <td className="py-3 px-2">{tx.supplier_name || "—"}</td>
                        <td className="py-3 px-2 text-slate-500">{tx.user}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Stock In Form Modal */}
      {isStockInOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white border border-slate-100 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsStockInOpen(false)}
              className="absolute top-4 left-4 p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-50 flex items-center gap-2">
              <ArrowDownCircle className="w-5 h-5 text-emerald-600" />
              ورود کالا به انبار
            </h2>

            <form onSubmit={handleStockInSubmit} className="space-y-4 mt-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">انتخاب انبار <span className="text-rose-500">*</span></label>
                  <select
                    required
                    value={stockInForm.warehouse_id}
                    onChange={(e) => setStockInForm({ ...stockInForm, warehouse_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-white focus:outline-none"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">انتخاب کالا <span className="text-rose-500">*</span></label>
                  <select
                    required
                    value={stockInForm.product_id}
                    onChange={(e) => setStockInForm({ ...stockInForm, product_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-white focus:outline-none"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">مقدار ورودی <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={stockInForm.quantity}
                    onChange={(e) => setStockInForm({ ...stockInForm, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">دسته‌بندی تراکنش</label>
                  <select
                    value={stockInForm.transaction_category}
                    onChange={(e) => setStockInForm({ ...stockInForm, transaction_category: e.target.value as StockTransaction["transaction_category"] })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-white focus:outline-none"
                  >
                    <option value="domestic_purchase">خرید داخلی</option>
                    <option value="foreign_purchase">خرید خارجی</option>
                    <option value="production">تولید</option>
                    <option value="return">مرجوعی</option>
                    <option value="other">سایر</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">نام تامین‌کننده</label>
                  <input
                    type="text"
                    value={stockInForm.supplier_name}
                    onChange={(e) => setStockInForm({ ...stockInForm, supplier_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">مرجع (فاکتور/رسید)</label>
                  <input
                    type="text"
                    placeholder="مانند: رسید ۱۲"
                    value={stockInForm.reference}
                    onChange={(e) => setStockInForm({ ...stockInForm, reference: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsStockInOpen(false)}
                  className="px-4 py-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-slate-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                >
                  ثبت ورود کالا
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Out Form Modal */}
      {isStockOutOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white border border-slate-100 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsStockOutOpen(false)}
              className="absolute top-4 left-4 p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-50 flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-rose-600" />
              خروج کالا از انبار
            </h2>

            <form onSubmit={handleStockOutSubmit} className="space-y-4 mt-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">انتخاب انبار <span className="text-rose-500">*</span></label>
                  <select
                    required
                    value={stockOutForm.warehouse_id}
                    onChange={(e) => setStockOutForm({ ...stockOutForm, warehouse_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-white focus:outline-none"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">انتخاب کالا <span className="text-rose-500">*</span></label>
                  <select
                    required
                    value={stockOutForm.product_id}
                    onChange={(e) => setStockOutForm({ ...stockOutForm, product_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-white focus:outline-none"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">مقدار خروجی <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={stockOutForm.quantity}
                    onChange={(e) => setStockOutForm({ ...stockOutForm, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">میزان مصرف (طول/متراژ)</label>
                  <input
                    type="number"
                    min={0}
                    value={stockOutForm.consumption_amount}
                    onChange={(e) => setStockOutForm({ ...stockOutForm, consumption_amount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">مرجع خروج (حواله/سفارش)</label>
                <input
                  type="text"
                  placeholder="مانند: حواله ۴۰۲"
                  value={stockOutForm.reference}
                  onChange={(e) => setStockOutForm({ ...stockOutForm, reference: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsStockOutOpen(false)}
                  className="px-4 py-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-slate-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm"
                >
                  ثبت خروج کالا
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Warehouse Modal */}
      {isNewWarehouseOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white border border-slate-100 rounded-xl w-full max-w-sm p-6 shadow-2xl relative">
            <button
              onClick={() => setIsNewWarehouseOpen(false)}
              className="absolute top-4 left-4 p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-50 flex items-center gap-2">
              <Archive className="w-5 h-5 text-brand-500" />
              ساخت انبار جدید
            </h2>

            <form onSubmit={handleNewWarehouseSubmit} className="space-y-4 mt-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">کد انبار <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="مانند: W-03"
                    value={newWarehouseForm.code}
                    onChange={(e) => setNewWarehouseForm({ ...newWarehouseForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">نام انبار <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newWarehouseForm.name}
                    onChange={(e) => setNewWarehouseForm({ ...newWarehouseForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">نوع انبار</label>
                <select
                  value={newWarehouseForm.warehouse_type}
                  onChange={(e) => setNewWarehouseForm({ ...newWarehouseForm, warehouse_type: e.target.value as WarehouseType["warehouse_type"] })}
                  className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-white focus:outline-none"
                >
                  <option value="raw_material">مواد اولیه</option>
                  <option value="finished_goods">محصول نهایی</option>
                  <option value="semi_finished">نیمه‌ساخته</option>
                  <option value="other">سایر</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">توضیحات</label>
                <textarea
                  rows={2}
                  value={newWarehouseForm.description}
                  onChange={(e) => setNewWarehouseForm({ ...newWarehouseForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsNewWarehouseOpen(false)}
                  className="px-4 py-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-slate-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-sm"
                >
                  ایجاد انبار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
