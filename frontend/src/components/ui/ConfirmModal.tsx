import { useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning" | "info"
  confirmVariant?: "danger" | "warning" | "info" | string
  isLoading?: boolean
  onConfirm: () => void
  onClose?: () => void
  onCancel?: () => void
}

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  confirmVariant,
  isLoading = false,
  onConfirm,
  onClose,
  onCancel
}: ConfirmModalProps) {
  const handleClose = onClose || onCancel || (() => {})
  const activeVariant = (confirmVariant as "danger" | "warning" | "info") || variant

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        handleClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isLoading, handleClose])

  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (activeVariant) {
      case "danger":
        return {
          iconBg: "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
          btnBg: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
        }
      case "warning":
        return {
          iconBg: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
          btnBg: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20"
        }
      default:
        return {
          iconBg: "bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400",
          btnBg: "bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20"
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200 cursor-pointer" 
        onClick={() => !isLoading && handleClose()}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-200/80 dark:border-slate-700 z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
            <AlertTriangle size={24} />
          </div>

          <div className="flex-1 pr-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-sm"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-sm flex items-center gap-2 ${styles.btnBg}`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
