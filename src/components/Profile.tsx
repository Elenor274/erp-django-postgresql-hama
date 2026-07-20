import React, { useState } from "react";
import { User } from "../types";
import { User as UserIcon, Mail, ShieldAlert, Check } from "lucide-react";
import { motion } from "motion/react";

interface ProfileProps {
  user: User;
  setUser: (user: User) => void;
}

export default function Profile({ user, setUser }: ProfileProps) {
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    email: user.email,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      full_name: formData.full_name,
      email: formData.email,
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">پروفایل کاربری</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">ویرایش اطلاعات شخصی و ایمیل مدیر سیستم حاما</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {user.full_name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-800">{user.full_name}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">نام کاربری: {user.username}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-slate-400 mb-1.5 font-bold">نام و نام خانوادگی مدیر</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full pr-9 pl-3 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5 font-bold">نشانی ایمیل</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pr-9 pl-3 py-2 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-mono"
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex gap-3 text-slate-600 leading-relaxed font-medium">
            <ShieldAlert className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div className="text-[10px]">
              سطح کاربری شما <strong>مدیر سیستم (Superuser)</strong> است. شما مجاز به مشاهده کل آمار، انبارها، ویرایش تراکنش‌ها و سفارشات هستید.
            </div>
          </div>

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-50 text-emerald-800 rounded-lg flex items-center gap-2 font-bold"
            >
              <Check className="w-4 h-4" />
              اطلاعات پروفایل با موفقیت بروزرسانی شد.
            </motion.div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-sm"
            >
              ذخیره تغییرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
