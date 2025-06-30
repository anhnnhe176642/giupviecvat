import React, { useState, useEffect } from 'react';
import { X, Loader, CheckCircle, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReferralCode as applyReferralCode, validateReferralCode } from '../services/api';

const UseReferralCodeModal = ({ isOpen, onClose, onSuccess }) => {
  const [referralCode, setReferralCode] = useState('');
  const [referralInfo, setReferralInfo] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const validateCode = async (code) => {
    if (!code || code.length < 3) {
      setReferralInfo(null);
      return;
    }

    try {
      setIsValidating(true);
      const response = await validateReferralCode(code);
      if (response.success) {
        setReferralInfo(response.data);
      } else {
        setReferralInfo(null);
      }
    } catch (error) {
      setReferralInfo(null);
      console.error('Error validating referral:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCodeChange = (e) => {
    const code = e.target.value.toUpperCase();
    setReferralCode(code);
    
    // Debounce validation
    setTimeout(() => {
      if (code === referralCode) {
        validateCode(code);
      }
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!referralCode) {
      toast.error('Vui lòng nhập mã giới thiệu');
      return;
    }

    if (!referralInfo) {
      toast.error('Mã giới thiệu không hợp lệ');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await applyReferralCode(referralCode);
      
      if (response.success) {
        toast.success(response.message || 'Sử dụng mã giới thiệu thành công!');
        onSuccess && onSuccess(response.data);
        handleClose();
      } else {
        toast.error(response.message || 'Không thể sử dụng mã giới thiệu');
      }
    } catch (error) {
      console.error('Error using referral code:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReferralCode('');
    setReferralInfo(null);
    setIsValidating(false);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-md max-h-[90vh] overflow-hidden border-0 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
        style={{boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)'}}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 bg-gradient-to-r from-emerald-50 via-white to-green-50 shrink-0 border-b border-gray-100">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent flex items-center">
            <Gift size={20} className="mr-3 text-emerald-600" />
            Sử dụng mã giới thiệu
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-50 rounded-full p-1.5 transition-all shadow-sm border border-gray-100 hover:border-gray-200"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto p-6 max-h-[70vh] custom-scrollbar">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Referral Code Input */}
              <div>
                <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mã giới thiệu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="referralCode"
                    type="text"
                    value={referralCode}
                    onChange={handleCodeChange}
                    placeholder="Nhập mã giới thiệu (VD: FRIEND2025)"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm transition-all ${
                      referralInfo ? 'border-emerald-400 bg-emerald-50' : 
                      referralCode && !referralInfo && !isValidating ? 'border-red-400 bg-red-50' : 
                      'border-gray-200'
                    }`}
                    maxLength={20}
                  />
                  {isValidating && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader size={16} className="animate-spin text-gray-500" />
                    </div>
                  )}
                </div>
                
                {/* Success state */}
                {referralInfo && (
                  <div className="mt-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle size={16} className="text-emerald-500 mr-2" />
                      <span className="text-sm text-emerald-700 font-medium">
                        Mã hợp lệ từ: {referralInfo.referrerName}
                      </span>
                    </div>
                    <div className="text-sm text-emerald-600 flex items-center">
                      <Gift size={14} className="mr-1" />
                      Bạn sẽ nhận được 100,000đ + voucher giảm giá 15%!
                    </div>
                  </div>
                )}
                
                {/* Error state */}
                {referralCode && !referralInfo && !isValidating && (
                  <div className="mt-2 text-sm text-red-600">
                    Mã giới thiệu không hợp lệ hoặc đã được sử dụng
                  </div>
                )}
                
                {/* Help text */}
                <p className="text-sm text-gray-500 mt-2">
                  Nhập mã giới thiệu từ bạn bè để nhận thưởng
                </p>
              </div>

              {/* Benefits section */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <h3 className="text-sm font-medium text-blue-900 mb-2">🎁 Ưu đãi khi sử dụng mã giới thiệu:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Nhận ngay 100,000đ vào tài khoản</li>
                  <li>• Voucher giảm 15% cho lần đặt đầu tiên</li>
                  <li>• Tích điểm thành viên VIP</li>
                </ul>
              </div>
            </div>
          </form>
        </div>
        
        {/* Action buttons */}
        <div className="border-t border-gray-100 p-5 flex gap-3 justify-end bg-gradient-to-r from-gray-50 to-white shrink-0">
          <button 
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium hover:border-gray-300"
          >
            Hủy
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={!referralInfo || isSubmitting}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader size={16} className="animate-spin mr-2" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Gift size={16} className="mr-2" />
                Sử dụng mã
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Add custom scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 100px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default UseReferralCodeModal;
