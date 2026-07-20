import React, { useState } from "react";
import { Check, Landmark, Settings as SettingsIcon } from "lucide-react";
import { motion } from "motion/react";

export default function Settings() {
  const [formData, setFormData] = useState({
    company_name: "نساجی حاما پارچه اصفهان",
    currency: "ریال",
    vat_rate: 9,
    timezone: "Asia/Tehran",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">تنظیمات پیکربندی</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">پیکربندی هویت سازمان، واحد پول، قوانین مالیاتی و مالی</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-400 mb-1.5 font-bold">نام رسمی شرکت (سامانه)</label>
            <div className="relative">
              <Landmark className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full pr-9 pl-3 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1.5 font-bold">واحد پول پیش‌فرض</label>
              <input
                type="text"
                required
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5 font-bold">نرخ مالیات بر ارزش افزوده (٪)</label>
              <input
                type="number"
                required
                min={0}
                value={formData.vat_rate}
                onChange={(e) => setFormData({ ...formData, vat_rate: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5 font-bold">منطقه زمانی سیستم</label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-100 rounded-lg bg-white focus:outline-none"
            >
              <option value="Asia/Tehran">تهران (UTC+3:30)</option>
              <option value="Asia/Dubai">دبی (UTC+4:00)</option>
              <option value="UTC">هماهنگ جهانی (UTC)</option>
            </select>
          </div>

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-50 text-emerald-800 rounded-lg flex items-center gap-2 font-bold"
            >
              <Check className="w-4 h-4" />
              تنظیمات پیکربندی با موفقیت ذخیره شد.
            </motion.div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-sm"
            >
              ذخیره تنظیمات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
