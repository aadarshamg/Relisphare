import React, { useState, useEffect, useRef } from 'react';
import { Loader2, QrCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { initiatePayment, checkPaymentStatus } from '@/api/asianpay';
import { Button } from '@/components/ui/button';

// We keep the filename as AsianPaySimulator.jsx but internally it acts as the True Gateway Terminal
const AsianPayTerminal = ({ amount, orderId, userDetails, onPaymentSuccess, onPaymentCancel }) => {
  const [status, setStatus] = useState('initiating'); // initiating, awaiting_payment, success, fail
  const [paymentData, setPaymentData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    // 1. Initiate API Call immediately upon mounting
    const startPayment = async () => {
      try {
        const orderInfo = { amount, orderId };
        const data = await initiatePayment(orderInfo, userDetails || {});
        // data should contain intent_url and order_id (Gateway's internal ID)
        setPaymentData(data);
        setStatus('awaiting_payment');
      } catch (err) {
        setStatus('fail');
        setErrorMsg(err.message || "Failed to connect to gateway.");
      }
    };
    startPayment();

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [amount, orderId, userDetails]);

  useEffect(() => {
    // 2. Poll for Status when awaiting_payment
    if (status === 'awaiting_payment' && paymentData?.order_id) {
      pollIntervalRef.current = setInterval(async () => {
        const result = await checkPaymentStatus(paymentData.order_id);
        if (result && result.order_status === 'PAID') {
          clearInterval(pollIntervalRef.current);
          setStatus('success');
          // Wait 2s to show success state before triggering callback
          setTimeout(() => {
            if (onPaymentSuccess) {
              onPaymentSuccess({
                transactionId: result.merchantTransactionId || result.transactionId,
                status: 'PAID'
              });
            }
          }, 2000);
        } else if (result && result.order_status === 'FAILED') {
          clearInterval(pollIntervalRef.current);
          setStatus('fail');
          setErrorMsg("Transaction Failed or Cancelled by User.");
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [status, paymentData, onPaymentSuccess]);


  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-teal-700 to-teal-900 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">AsianPay</h2>
          <p className="text-teal-100 opacity-90 mt-1">Order Total: ₹{amount}</p>
        </div>

        <div className="p-8 text-center min-h-[350px] flex flex-col justify-center items-center">
          
          {status === 'initiating' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
              <p className="text-gray-600 font-medium">Generating secure payment link...</p>
            </div>
          )}

          {status === 'awaiting_payment' && paymentData && (
            <div className="flex flex-col items-center w-full animate-in fade-in">
              <h3 className="font-semibold text-gray-800 mb-4">Scan QR to Pay</h3>
              
              {/* Generate a QR Code dynamically pointing to the intent_url */}
              <div className="bg-white p-2 border-2 border-dashed border-teal-200 rounded-xl mb-6">
                {paymentData.intent_url ? (
                  <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(paymentData.intent_url)}&size=200x200`} 
                      alt="UPI QR Code" 
                      className="w-48 h-48"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
                    <QrCode className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {paymentData.intent_url && (
                <a 
                  href={paymentData.intent_url} 
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-4 block"
                >
                  Pay via UPI App (Mobile)
                </a>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                Waiting for payment confirmation...
              </div>
            </div>
          )}

          {status === 'success' && (
             <div className="flex flex-col items-center gap-4 animate-in zoom-in">
                <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Payment Verified!</h3>
                  <p className="text-gray-500 mt-2">Completing your order...</p>
                </div>
             </div>
          )}

          {status === 'fail' && (
             <div className="flex flex-col items-center gap-4 animate-in zoom-in">
                <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Payment Failed</h3>
                  <p className="text-gray-500 mt-2">{errorMsg}</p>
                </div>
             </div>
          )}

        </div>

        {/* Action Footer */}
        {status !== 'success' && status !== 'initiating' && (
          <div className="p-4 bg-gray-50 border-t flex justify-center">
             <Button variant="ghost" onClick={onPaymentCancel} className="text-gray-500 hover:text-gray-800">
               Cancel Transaction
             </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AsianPayTerminal;
