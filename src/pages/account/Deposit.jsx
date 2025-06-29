import { useState, useContext } from 'react';
import { CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { simulateDeposit } from '../../services/api';
import { AuthContext } from '../../conext/AuthContext';

const Deposit = () => {
  const { user, setUser } = useContext(AuthContext);
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const depositMethods = [
    {
      id: 'bank',
      name: 'Chuyển khoản ngân hàng',
      description: 'Chuyển khoản qua VietQR hoặc Internet Banking',
      icon: BanknotesIcon,
      fee: 0
    },
    {
      id: 'card',
      name: 'Thẻ tín dụng/ghi nợ',
      description: 'Visa, MasterCard, JCB',
      icon: CreditCardIcon,
      fee: 2.5
    }
  ];

  const quickAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) < 10000) {
      toast.error('Số tiền nạp tối thiểu là 10.000 VND');
      return;
    }

    if (parseFloat(amount) > 10000000) {
      toast.error('Số tiền nạp tối đa là 10.000.000 VND');
      return;
    }

    setIsProcessing(true);
    
    try {
      const paymentMethodMap = {
        'bank': 'bank_transfer',
        'card': 'credit_card'
      };

      const result = await simulateDeposit(
        parseFloat(amount), 
        paymentMethodMap[selectedMethod]
      );

      if (result.success) {
        toast.success(result.message);
        setAmount('');
        
        // Update user balance in context
        if (result.transaction && result.transaction.balanceAfter !== undefined) {
          setUser(prevUser => ({
            ...prevUser,
            balance: result.transaction.balanceAfter
          }));
        }
      } else {
        toast.error(result.message || 'Nạp tiền thất bại');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        {/* Current Balance */}
        {user && user.accountBalance !== undefined && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">Số dư hiện tại:</span>
              <span className="text-lg font-bold text-blue-900">
                {formatCurrency(user.accountBalance)}
              </span>
            </div>
          </div>
        )}

        {/* Deposit Methods */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn phương thức nạp tiền</h3>
          <div className="space-y-3">
            {depositMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.id}
                  className={`relative border rounded-lg p-4 cursor-pointer transition ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-center">
                    <Icon className="w-6 h-6 text-gray-600 mr-3" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{method.name}</h4>
                        {method.fee > 0 && (
                          <span className="text-sm text-orange-600 font-medium">
                            Phí {method.fee}%
                          </span>
                        )}
                        {method.fee === 0 && (
                          <span className="text-sm text-green-600 font-medium">Miễn phí</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ml-3 ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedMethod === method.id && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nhập số tiền</h3>
          
          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="p-3 border border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition"
              >
                {formatCurrency(quickAmount)}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Nhập số tiền tùy chỉnh"
              className="w-full p-4 border border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min="10000"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              VND
            </div>
          </div>
          
          {amount && parseFloat(amount) >= 10000 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Số tiền nạp:</span>
                <span className="font-semibold">{formatCurrency(parseFloat(amount))}</span>
              </div>
              {selectedMethod === 'card' && (
                <div className="flex justify-between items-center mt-2">
                  <span>Phí giao dịch (2.5%):</span>
                  <span className="text-orange-600">
                    {formatCurrency(parseFloat(amount) * 0.025)}
                  </span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>Tổng thanh toán:</span>
                  <span className="text-blue-600">
                    {formatCurrency(
                      parseFloat(amount) + 
                      (selectedMethod === 'card' ? parseFloat(amount) * 0.025 : 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleDeposit}
          disabled={!amount || parseFloat(amount) < 10000 || isProcessing}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition ${
            !amount || parseFloat(amount) < 10000 || isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Đang xử lý...
            </div>
          ) : (
            'Tiến hành nạp tiền'
          )}
        </button>

        {/* Note */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Lưu ý:</strong> Tính năng thử nghiệm
          </p>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
