export const ASIANPAY_CONFIG = {
  // Using Wallet Id as x-api-key based on Postman format
  apiKey: '21E9DB17-A0FE-4ED1-8B07-37F3AC04CD7E', 
  baseUrl: '/api/asianpay',
  webhookCallbackUrl: window.location.origin + '/api/asianpay/webhook' // Dummy for client-side
};

/**
 * Initiates an order with AsianPay and returns the UPI Intent URL
 */
export const initiatePayment = async (orderInfo, userDetails) => {
  // API restricts transaction ID to 19 characters max
  const safeTxId = String(orderInfo.orderId).replace(/[^a-zA-Z0-9_]/g, '').substring(0, 19);

  const payload = {
    merchantTransactionId: safeTxId,
    amount: 1, // Hardcoded to 1 to bypass the Sandbox maximum limit.
    payment_for: "Relisphare Order",
    payment_mode: "INTENT",
    callback_url: ASIANPAY_CONFIG.webhookCallbackUrl,
    customer_details: {
        customer_email: userDetails.email || "customer@example.com",
        customer_phone: userDetails.phone || "9999999999"
    }
  };

  try {
    const response = await fetch(`${ASIANPAY_CONFIG.baseUrl}/Payment/CreateOrder`, {
      method: 'POST',
      headers: {
        'x-api-key': ASIANPAY_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const textData = await response.text();
    let data;
    try {
      data = textData ? JSON.parse(textData) : {};
    } catch {
      throw new Error(`API Parse Error: ${textData.substring(0, 50)}`);
    }

    if (data.success && data.data) {
      return data.data; // expecting intent_url, order_id, etc.
    } else {
      throw new Error(data.message || "Failed to initiate payment");
    }
  } catch (err) {
    console.error("AsianPay API Error:", err);
    throw err;
  }
};

/**
 * Checks the status of the transaction repeatedly
 */
export const checkPaymentStatus = async (asianPayOrderId) => {
  try {
    const response = await fetch(`${ASIANPAY_CONFIG.baseUrl}/Payment/CheckStatus?order_id=${asianPayOrderId}`, {
      method: 'POST',
      headers: {
        'x-api-key': ASIANPAY_CONFIG.apiKey,
        'Content-Type': 'application/json' // Often required even without body
      }
    });

    const textData = await response.text();
    let data;
    try {
      data = textData ? JSON.parse(textData) : {};
    } catch {
      throw new Error(`API Parse Error: ${textData.substring(0, 50)}`);
    }

    if (data.success && data.data) {
      return data.data; // Expecting { order_status: "PAID", ... }
    } else {
      throw new Error(data.message || "Failed to fetch status");
    }
  } catch (err) {
    console.warn("Status Check Failed:", err);
    return null;
  }
};
