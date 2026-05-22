"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastHelpers = React.useMemo(
    () => ({
      success: (msg: string) => addToast(msg, "success"),
      error: (msg: string) => addToast(msg, "error"),
      info: (msg: string) => addToast(msg, "info"),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: toastHelpers }}>
      {children}

      {/* Floating Banners Portal Container */}
      <div className="fixed bottom-5 right-5 z-55 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl glass transition-all ${
                toast.type === "success"
                  ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-200"
                  : toast.type === "error"
                  ? "border-rose-500/30 bg-rose-950/20 text-rose-200"
                  : "border-indigo-500/30 bg-indigo-950/20 text-indigo-200"
              }`}
            >
              {/* Icon */}
              <span className="shrink-0 mt-0.5">
                {toast.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : toast.type === "error" ? (
                  <AlertCircle className="h-5 w-5 text-rose-400" />
                ) : (
                  <Info className="h-5 w-5 text-indigo-400" />
                )}
              </span>

              {/* Message content */}
              <p className="flex-1 text-sm font-medium leading-normal">
                {toast.message}
              </p>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-0.5 rounded-full hover:bg-black/20 text-current/60 hover:text-current transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}
