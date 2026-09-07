import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}) => {
  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className="
        fixed inset-0 z-[60]
        flex items-center justify-center
        bg-[#073F42]/40
        p-4
        backdrop-blur-sm
      "
      onClick={onCancel}
    >
      <div
        className="
          w-full max-w-sm
          rounded-2xl
          border border-[#D9E9E7]
          bg-white
          p-5
          shadow-2xl
          sm:rounded-3xl
          sm:p-6
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div
            className={`
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              ${
                isDanger
                  ? "bg-red-50 text-red-600"
                  : "bg-[#E8F8F6] text-[#08A6A0]"
              }
            `}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              text-[#819596]
              transition
              hover:bg-[#F1F7F6]
              hover:text-[#073F42]
            "
            aria-label="Close confirmation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="mt-4">
          <h3
            className="
              text-base font-bold
              text-[#073F42]
              sm:text-lg
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-2
              text-xs leading-5
              text-[#819596]
              sm:text-sm sm:leading-6
            "
          >
            {message}
          </p>
        </div>

        {/* ACTIONS */}
        <div
          className="
            mt-5
            flex items-center justify-end
            gap-2
          "
        >
          <button
            type="button"
            onClick={onCancel}
            className="
              inline-flex h-9
              items-center justify-center
              rounded-lg
              border border-[#D9E9E7]
              bg-white
              px-4
              text-xs font-semibold
              text-[#31585A]
              transition
              hover:border-[#08A6A0]
              hover:bg-[#E8F8F6]
              hover:text-[#08A6A0]
              sm:h-10
              sm:rounded-xl
              sm:px-5
              sm:text-sm
            "
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`
              inline-flex h-9
              items-center justify-center
              rounded-lg
              px-4
              text-xs font-semibold
              text-white
              transition
              sm:h-10
              sm:rounded-xl
              sm:px-5
              sm:text-sm
              ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#08A6A0] hover:bg-[#078F8A]"
              }
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
