import React, { useState } from 'react';

// Enhanced Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  type = 'info', 
  showCancel = false, 
  onConfirm = null,
  className = '',
  size = 'md'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success': 
        return {
          headerColor: 'text-green-700 bg-green-50',
          borderColor: 'border-green-200',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          icon: '✅'
        };
      case 'warning': 
        return {
          headerColor: 'text-yellow-700 bg-yellow-50',
          borderColor: 'border-yellow-200',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
          icon: '⚠️'
        };
      case 'error': 
        return {
          headerColor: 'text-red-700 bg-red-50',
          borderColor: 'border-red-200',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          icon: '❌'
        };
      case 'info':
      default: 
        return {
          headerColor: 'text-blue-700 bg-blue-50',
          borderColor: 'border-blue-200',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          icon: 'ℹ️'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'max-w-sm';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      case 'md':
      default: return 'max-w-md';
    }
  };

  const styles = getTypeStyles();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className={`bg-white rounded-lg ${getSizeStyles()} w-full max-h-[90vh] overflow-y-auto shadow-xl ${styles.borderColor} border-2 ${className} transform transition-all duration-200 scale-100`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-4 ${styles.headerColor} rounded-t-lg`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{styles.icon}</span>
            <h2 className="text-lg font-semibold">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {children}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 bg-gray-50 rounded-b-lg">
          {showCancel && (
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm || onClose}
            className={`${showCancel ? 'flex-1' : 'ml-auto'} py-2 px-4 text-white rounded-lg transition-colors ${styles.buttonColor}`}
          >
            {showCancel ? 'Confirm' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Message Modal Hook for easy usage
export default Modal
