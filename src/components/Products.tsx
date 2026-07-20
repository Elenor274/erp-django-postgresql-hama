import React, { useState } from "react";
import { Product, ProductGroup, StockItem } from "../types";
import { Plus, Search, Edit2, Trash2, X, Tag } from "lucide-react";
import { motion } from "motion/react";

interface ProductsProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  groups: ProductGroup[];
  setGroups: (groups: ProductGroup[]) => void;
  stockItems: StockItem[];
}

export default function Products({
  products,
  setProducts,
  groups,
  setGroups,
  stockItems,
}: ProductsProps) {
  const [activeTab, setActiveTab] = useState<"items" | "groups">("items");
  const [searchQuery, setSearchQuery] = useState("");

  // Product Modals / Forms State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({
    code: "",
    name: "",
    group_id: "",
    unit: "عدد" as "عدد" | "کیلوگرم" | "بسته",
    initial_stock: 0,
    unit_price: 0,
    description: "",
  });

  // Group Modals / Forms State
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ProductGroup | null>(null);
  const [groupFormData, setGroupFormData] = useState({ name: "" });

  // Get current stock for product (summing across warehouses)
  const getProductStock = (prodId: string) => {
    const total = stockItems
      .filter((s) => s.product_id === prodId)
      .reduce((sum, curr) => sum + Number(curr.quantity), 0);
    return total;
  };

  const getGroupName = (id: string) => {
    const grp = groups.find((g) => g.id === id);
    return grp ? grp.name : "بدون گروه";
  };

  // Product Handlers
  const openCreateProduct = () => {
    const lastCodeNum = products.reduce((max, p) => {
      const match = p.code.match(/P-(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        return num > max ? num : max;
      }
      return max;
    }, 200);

    setProductFormData({
      code: `P-${lastCodeNum + 1}`,
      name: "",
      group_id: groups[0]?.id || "",
      unit: "عدد",
      initial_stock: 0,
      unit_price: 0,
      description: "",
    });
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductFormData({
      code: prod.code,
      name: prod.name,
      group_id: prod.group_id,
      unit: prod.unit,
      initial_stock: prod.initial_stock,
      unit_price: prod.unit_price,
      description: prod.description || "",
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.code || !productFormData.name || !productFormData.group_id) {
      alert("لطفاً فیلدهای ستاره‌دار را تکمیل نمایید.");
      return;
    }

    if (editingProduct) {
      setProducts(
        products.map((p) => (p.id === editingProduct.id ? { ...p, ...productFormData } : p))
      );
    } else {
      if (products.some((p) => p.code === productFormData.code)) {
        alert("کد کالا قبلاً استفاده شده است.");
        return;
      }
      const newProd: Product = {
        id: `p_${Date.now()}`,
        ...productFormData,
      };
      setProducts([...products, newProd]);
    }

    setIsProductModalOpen(false);
  };

  const handleProductDelete = (id: string) => {
    if (confirm("آیا از حذف این کالا اطمینان دارید؟")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // Group Handlers
  const openCreateGroup = () => {
    setGroupFormData({ name: "" });
    setEditingGroup(null);
    setIsGroupModalOpen(true);
  };

  const openEditGroup = (g: ProductGroup) => {
    setEditingGroup(g);
    setGroupFormData({ name: g.name });
    setIsGroupModalOpen(true);
  };

  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupFormData.name) return;

    if (editingGroup) {
      setGroups(groups.map((g) => (g.id === editingGroup.id ? { ...g, ...groupFormData } : g)));
    } else {
      const newGroup: ProductGroup = {
        id: `g_${Date.now()}`,
        name: groupFormData.name,
      };
      setGroups([...groups, newGroup]);
    }

    setIsGroupModalOpen(false);
  };

  const handleGroupDelete = (id: string) => {
    if (products.some((p) => p.group_id === id)) {
      alert("این گروه دارای کالاهای فعال است و امکان حذف آن وجود ندارد.");
      return;
    }
    if (confirm("آیا از حذف این گروه کالا اطمینان دارید؟")) {
      setGroups(groups.filter((g) => g.id !== id));
    }
  };

  // Filter lists
  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query) ||
      getGroupName(p.group_id).toLowerCase().includes(query)
    );
  });

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">محصولات و کاتالوگ</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            تعریف و ویرایش کالاها، گروه‌بندی کالاها و مشاهده موجودی کل آن‌ها
          </p>
        </div>
        <div>
          {activeTab === "items" ? (
            <button
              onClick={openCreateProduct}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن کالای جدید</span>
            </button>
          ) : (
            <button
              onClick={openCreateGroup}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن گروه جدید</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 gap-6 text-xs font-bold">
        <button
          onClick={() => {
            setActiveTab("items");
            setSearchQuery("");
          }}
          className={`pb-3 transition-colors relative ${
            activeTab === "items" ? "text-brand-500" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <span>کالاها (کاتالوگ)</span>
          {activeTab === "items" && (
            <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-brand-500 rounded" />
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab("groups");
            setSearchQuery("");
          }}
          className={`pb-3 transition-colors relative ${
            activeTab === "groups" ? "text-brand-500" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <span>گروه‌های کالا</span>
          {activeTab === "groups" && (
            <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-brand-500 rounded" />
          )}
        </button>
      </div>

      {/* Main Catalog View */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder={activeTab === "items" ? "جستجوی کالا، کد کالا، گروه..." : "جستجوی گروه..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold pr-9 pl-3 py-2 border border-slate-100 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Content based on Active Tab */}
        {activeTab === "items" ? (
          <div className="overflow-x-auto">
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">هیچ کالایی یافت نشد.</div>
            ) : (
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100">
                    <th className="py-3 px-2">کد کالا</th>
                    <th className="py-3 px-2">شرح کالا</th>
                    <th className="py-3 px-2">گروه کالا</th>
                    <th className="py-3 px-2">واحد</th>
                    <th className="py-3 px-2">موجودی اولیه</th>
                    <th className="py-3 px-2">موجودی کل</th>
                    <th className="py-3 px-2">قیمت واحد (ریال)</th>
                    <th className="py-3 px-2 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProducts.map((p) => {
                    const currentStock = getProductStock(p.id);
                    return (
                      <tr key={p.id} className="text-slate-700 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-2 font-bold text-slate-800">{p.code}</td>
                        <td className="py-3 px-2 font-semibold text-slate-900">{p.name}</td>
                        <td className="py-3 px-2">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px]">
                            <Tag className="w-3 h-3" />
                            {getGroupName(p.group_id)}
                          </span>
                        </td>
                        <td className="py-3 px-2">{p.unit}</td>
                        <td className="py-3 px-2 font-mono">{p.initial_stock.toLocaleString()}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`font-mono font-bold ${
                              currentStock <= 0 ? "text-rose-500" : "text-emerald-600"
                            }`}
                          >
                            {currentStock.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono font-bold text-slate-800">
                          {p.unit_price.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-left">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => openEditProduct(p)}
                              className="p-1 text-slate-400 hover:text-brand-500 hover:bg-slate-50 rounded"
                              title="ویرایش"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleProductDelete(p.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredGroups.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">هیچ گروه کالایی یافت نشد.</div>
            ) : (
              <table className="w-full text-right text-xs max-w-xl">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100">
                    <th className="py-3 px-2">نام گروه کالا</th>
                    <th className="py-3 px-2 text-center">تعداد کالاهای متصل</th>
                    <th className="py-3 px-2 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredGroups.map((g) => {
                    const count = products.filter((p) => p.group_id === g.id).length;
                    return (
                      <tr key={g.id} className="text-slate-700 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-2 font-bold text-slate-800">{g.name}</td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-slate-600">{count}</td>
                        <td className="py-3 px-2 text-left">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => openEditGroup(g)}
                              className="p-1 text-slate-400 hover:text-brand-500 hover:bg-slate-50 rounded"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleGroupDelete(g.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white border border-slate-100 rounded-xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 left-4 p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-50">
              {editingProduct ? "ویرایش کالا" : "ثبت کالای جدید"}
            </h2>

            <form onSubmit={handleProductSubmit} className="space-y-4 mt-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">کد کالا <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    disabled={!!editingProduct}
                    value={productFormData.code}
                    onChange={(e) => setProductFormData({ ...productFormData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-slate-50/50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">شرح (نام) کالا <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">گروه کالا <span className="text-rose-500">*</span></label>
                  <select
                    required
                    value={productFormData.group_id}
                    onChange={(e) => setProductFormData({ ...productFormData, group_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                  >
                    <option value="">-- انتخاب گروه --</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">واحد اندازه‌گیری <span className="text-rose-500">*</span></label>
                  <select
                    required
                    value={productFormData.unit}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        unit: e.target.value as "عدد" | "کیلوگرم" | "بسته",
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                  >
                    <option value="عدد">عدد</option>
                    <option value="کیلوگرم">کیلوگرم</option>
                    <option value="بسته">بسته</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">قیمت واحد (ریال) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productFormData.unit_price}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        unit_price: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-mono"
                  />
                </div>
              </div>

              {!editingProduct && (
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">موجودی اولیه</label>
                  <input
                    type="number"
                    min={0}
                    value={productFormData.initial_stock}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        initial_stock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">توضیحات</label>
                <textarea
                  rows={2}
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-sm"
                >
                  ذخیره کالا
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Group Modal */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white border border-slate-100 rounded-xl w-full max-w-sm p-6 shadow-2xl relative">
            <button
              onClick={() => setIsGroupModalOpen(false)}
              className="absolute top-4 left-4 p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <h2 className="text-sm font-extrabold text-slate-800 pb-3 border-b border-slate-50">
              {editingGroup ? "ویرایش گروه کالا" : "ثبت گروه کالا جدید"}
            </h2>

            <form onSubmit={handleGroupSubmit} className="space-y-4 mt-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">نام گروه کالا <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={groupFormData.name}
                  onChange={(e) => setGroupFormData({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="px-4 py-2 border border-slate-100 rounded-lg text-slate-500 hover:bg-slate-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-sm"
                >
                  ذخیره گروه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
