import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const variantStyles = {
    danger: {
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100 dark:bg-red-900/20',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700 text-white'
    },
    warning: {
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
      confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white'
    },
    info: {
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
      confirmButtonClass: 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  };

  const currentVariant = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              {/* Header */}
              <div className="relative p-6 pb-4">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </button>
                
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${currentVariant.iconBg}`}>
                    {variant === 'danger' && <Trash2 className={`h-6 w-6 ${currentVariant.iconColor}`} />}
                    {variant === 'warning' && <AlertTriangle className={`h-6 w-6 ${currentVariant.iconColor}`} />}
                    {variant === 'info' && <AlertTriangle className={`h-6 w-6 ${currentVariant.iconColor}`} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3 sm:gap-3 sm:justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="order-2 sm:order-1"
                >
                  {cancelText}
                </Button>
                
                <Button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className={`order-1 sm:order-2 ${currentVariant.confirmButtonClass} min-w-[100px]`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    confirmText
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}