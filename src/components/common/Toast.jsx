import { CheckCircle2, X, AlertCircle, Info } from "lucide-react";

const Toast = ({
  type = "success",
  title,
  message,
  onClose,
}) => {
  const config = {
    success: {
      icon: CheckCircle2,
      iconWrapper: "bg-emerald-100",
      iconColor: "text-emerald-600",
      border: "border-emerald-200",
    },

    error: {
      icon: AlertCircle,
      iconWrapper: "bg-red-100",
      iconColor: "text-red-600",
      border: "border-red-200",
    },

    info: {
      icon: Info,
      iconWrapper: "bg-blue-100",
      iconColor: "text-blue-600",
      border: "border-blue-200",
    },
  };

  const current = config[type] || config.success;
  const Icon = current.icon;

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-right-5 fade-in duration-300">
      <div
        className={`flex min-w-[320px] max-w-[420px] items-start gap-3 rounded-2xl border bg-white px-5 py-4 shadow-xl shadow-slate-900/10 ${current.border}`}
      >
        {/* Icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${current.iconWrapper}`}
        >
          <Icon className={`h-5 w-5 ${current.iconColor}`} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 pr-2">
          {title && (
            <h4 className="text-sm font-semibold text-slate-900">
              {title}
            </h4>
          )}

          <p className="mt-1 text-sm leading-5 text-slate-500">
            {message}
          </p>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;