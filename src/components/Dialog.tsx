import { useEffect } from "react"
import { Ban, CircleAlert, CircleCheck, Info, X } from 'lucide-react'

export type DialogType = 'success' | 'error' | 'info' | 'warning'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: DialogType
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
}

const Dialog = ({ isOpen, onClose, title, message, type = 'info', onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel' }: DialogProps) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const getDialogStyles = () => {
    switch (type) {
      case 'success':
        return {
          borderColor: 'border-green-500',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-500',
          iconBg: 'bg-green-100'
        }
      case 'error':
        return {
          borderColor: 'border-red-500',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-500',
          iconBg: 'bg-red-100'
        }
      case 'warning':
        return {
          borderColor: 'border-yellow-500',
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-500',
          iconBg: 'bg-yellow-100'
        }
      default:
        return {
          borderColor: 'border-blue-500',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-500',
          iconBg: 'bg-blue-100'
        }
    }
  }

  const styles = getDialogStyles()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm "
        onClick={onClose}
      />

      <div className={`relative w-full max-w-md bg-white rounded-lg shadow-2xl border-2 ${styles.borderColor} ${styles.bgColor}`}>
        <button
          onClick={onClose}
          className={`text-white transition-colors absolute top-4 right-4 rounded-full p-2 ${
            type === 'success' ? 'bg-green-500 hover:bg-green-600' :
            type === 'error' ? 'bg-red-500 hover:bg-red-600' :
            type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
            'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          <X size={20} />
        </button>

        <div className="p-6 flex justify-center items-center flex-col">
          <div className={`w-12 h-12 ${styles.iconBg} ${styles.iconColor} rounded-full flex items-center justify-center mb-4`}>
            {type === 'success' && (
                  <CircleCheck size={35} className="text-green-500" />

            )}
            {type === 'error' && (
             <Ban size={35} className="text-red-500" />
            )}
            {type === 'warning' && (
    <CircleAlert size={35} className="text-yellow-500" />
            )}
            {type === 'info' && (
                 <Info size={35} className="text-blue-500" />

            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>

          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex gap-3 w-full">
            {onCancel && (
              <button
                onClick={() => {
                  onClose()
                  onCancel()
                }}
                className="w-full border border-gray-500 py-2 px-4 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                onClose()
                if (onConfirm) onConfirm()
              }}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors ${
                type === 'success' ? 'bg-green-500 hover:bg-green-600' :
                type === 'error' ? 'bg-red-500 hover:bg-red-600' :
                type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
                'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dialog
