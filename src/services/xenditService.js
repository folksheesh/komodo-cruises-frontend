// Xendit Payment Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://komodo-cruises-production-0c52.up.railway.app';

/**
 * Create a Xendit invoice for payment
 * @param {Object} paymentData - Payment data
 * @param {number} paymentData.amount - Amount in IDR
 * @param {string} paymentData.payerEmail - Payer's email
 * @param {string} paymentData.description - Payment description
 * @param {string} paymentData.customerName - Customer's full name
 * @param {string} paymentData.customerPhone - Customer's phone number
 * @param {Array} paymentData.items - Array of items being purchased
 * @returns {Promise<Object>} Invoice response with invoiceUrl
 */
export async function createXenditInvoice(paymentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/create-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: paymentData.amount,
        payerEmail: paymentData.payerEmail,
        description: paymentData.description,
        customerName: paymentData.customerName,
        customerPhone: paymentData.customerPhone,
        items: paymentData.items,
        successRedirectUrl: paymentData.successRedirectUrl || `${window.location.origin}/payment-success`,
        failureRedirectUrl: paymentData.failureRedirectUrl || `${window.location.origin}/payment-failed`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create invoice');
    }

    return data;
  } catch (error) {
    console.error('Error creating Xendit invoice:', error);
    throw error;
  }
}

/**
 * Get invoice status by ID
 * @param {string} invoiceId - Xendit invoice ID
 * @returns {Promise<Object>} Invoice details
 */
export async function getInvoiceStatus(invoiceId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/invoice/${invoiceId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch invoice');
    }

    return data;
  } catch (error) {
    console.error('Error fetching invoice status:', error);
    throw error;
  }
}

/**
 * Redirect to Xendit payment page
 * @param {string} invoiceUrl - Xendit invoice URL
 */
export function redirectToPayment(invoiceUrl) {
  if (invoiceUrl) {
    window.location.href = invoiceUrl;
  } else {
    throw new Error('Invoice URL is required');
  }
}

/**
 * Format currency to IDR
 * @param {number} amount - Amount in numbers
 * @returns {string} Formatted currency string
 */
export function formatToIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Parse price string to number
 * @param {string} priceString - Price string like "Rp 3,650,000"
 * @returns {number} Price as number
 */
export function parsePriceToNumber(priceString) {
  if (!priceString) return 0;
  if (typeof priceString === 'number') return priceString;
  
  // Remove currency symbols and text, keep only numbers
  const numericString = String(priceString)
    .replace(/[^\d.,]/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '');
  
  return parseInt(numericString) || 0;
}
