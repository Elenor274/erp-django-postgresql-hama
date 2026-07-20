import React, { useState } from "react";
import { LogIn, Key, User } from "lucide-react";
import { motion } from "motion/react";

interface LoginProps {
  onLogin: (username: string, fullName: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      setError("لطفاً نام کاربری و کلمه عبور را وارد نمایید.");
      return;
    }
    // Allow any login for preview ease, but defaults to Admin
    const fullName = username === "admin" ? "مدیر سیستم حاما" : username;
    onLogin(username, fullName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#eef2f6] px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white border border-slate-100 rounded-2xl p-8 shadow-xl space-y-6 text-right"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl mx-auto flex items-center justify-center text-white font-extrabold text-xl shadow-md">
            ح
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800">ورود به سامانه مدیریت حاما</h1>
            <p className="text-[10px] text-slate-400 font-bold mt-1">مدیریت سفارشات، تولید و انبارداری کارخانجات حاما پارچه</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
          <div>
            <label className="block text-slate-400 mb-1.5">نام کاربری</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-300 absolute right-3 top-2.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-9 pl-3 py-2 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5">کلمه عبور</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-300 absolute right-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-9 pl-3 py-2 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/10 font-extrabold text-xs transition-colors mt-6"
          >
            <LogIn className="w-4 h-4" />
            <span>ورود به سیستم</span>
          </button>
        </form>

        <div className="text-center">
          <span className="text-[10px] text-slate-400 font-medium">
            نام کاربری و رمز پیش‌فرض: <code className="bg-slate-50 px-1 py-0.5 rounded text-slate-600 font-bold font-mono">admin</code> / <code className="bg-slate-50 px-1 py-0.5 rounded text-slate-600 font-bold font-mono">1234</code>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
