import React, { useState } from "react";
import { Customer } from "../types";
import { Plus, Search, Edit2, Trash2, X, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface CustomersProps {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  initialTab?: string;
}

export default function Customers({ customers, setCustomers, initialTab }: CustomersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(initialTab === "create");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    customer_code: "",
    name: "",
    last_name: "",
    phone_number: "",
  });

  // Handle opening for Create New
  const openCreateModal = () => {
    // Generate a unique code if possible
    const lastCodeNum = customers.reduce((max, c) => {
      const match = c.customer_code.match(/C-(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        return num > max ? num : max;
      }
      return max;
    }, 100);
    
    setFormData({
      customer_code: `C-${lastCodeNum + 1}`,
      name: "",
      last_name: "",
      phone_number: "",
    });
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  // Handle opening for Edit
  const openEditModal = (cust: Customer) => {
    setEditingCustomer(cust);
    setFormData({
      customer_code: cust.customer_code,
      name: cust.name,
      last_name: cust.last_name,
      phone_number: cust.phone_number,
    });
    setIsModalOpen(true);
  };

  // Handle Submit (Create / Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_code || !formData.name || !formData.last_name) {
      alert("لطفاً فیلدهای الزامی را پر کنید.");
      return;
    }

    if (editingCustomer) {
      // Edit
      const updated = customers.map((c) =>
        c.id === editingCustomer.id ? { ...c, ...formData } : c
      );
      setCustomers(updated);
    } else {
      // Create
      // Check code uniqueness
      if (customers.some((c) => c.customer_code === formData.customer_code)) {
        alert("کد مشتری قبلاً ثبت شده است.");
        return;
      }
      const newCust: Customer = {
        id: `c_${Date.now()}`,
        ...formData,
      };
      setCustomers([...customers, newCust]);
    }

    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    if (confirm("آیا از حذف این مشتری اطمینان دارید؟ تمامی سفارشات مربوط به او نیز حذف خواهند شد.")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  // Filtered list
  const filteredCustomers = customers.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.last_name.toLowerCase().includes(query) ||
      c.customer_code.toLowerCase().includes(query) ||
      c.phone_number.includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">مدیریت مشتریان</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">لیست خریداران، ثبت نام مشتریان جدید و ویرایش اطلاعات آن‌ها</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-brand-500/10 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن مشتری جدید</span>
        </button>
      </div>

      {/* Filter and Table Panel */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="جستجوی نام، کد مشتری، شماره تماس..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold pr-9 pl-3 py-2 border border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredCustomers.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">هیچ مشتری با این مشخصات یافت نشد.</div>
          ) : (
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-100">
                  <th className="py-3 px-2">کد مشتری</th>
                  <th className="py-3 px-2">نام و نام خانوادگی</th>
                  <th className="py-3 px-2">شماره تماس</th>
                  <th className="py-3 px-2 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="text-slate-700 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-2 font-bold text-slate-800">{c.customer_code}</td>
                    <td className="py-3 px-2 font-medium text-slate-900">{c.name} {c.last_name}</td>
                    <td className="py-3 px-2 font-mono text-slate-600">{c.phone_number || "—"}</td>
                    <td className="py-3 px-2 text-left">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1 text-slate-400 hover:text-brand-500 hover:bg-slate-50 rounded transition-colors"
                          title="ویرایش"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal - Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white border border-slate-100 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-50">
              {editingCustomer ? "ویرایش مشخصات مشتری" : "ثبت مشتری جدید"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">نام <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">نام خانوادگی <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">کد مشتری <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    disabled={!!editingCustomer}
                    value={formData.customer_code}
                    onChange={(e) => setFormData({ ...formData, customer_code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-slate-50/50 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">شماره تماس</label>
                  <input
                    type="text"
                    placeholder="مانند: 09121111111"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              {editingCustomer && (
                <div className="p-3 bg-amber-50 rounded-lg flex gap-2.5 text-amber-800 leading-relaxed text-[11px]">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>تغییر در مشخصات مشتری، بر روی تمامی سفارشات قبلی او نیز تاثیر خواهد گذاشت.</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-sm"
                >
                  ذخیره اطلاعات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
