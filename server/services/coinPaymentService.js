let coinPayments = null;

function getCoinPayments() {
  if (!coinPayments && process.env.COINPAYMENTS_PUBLIC_KEY && process.env.COINPAYMENTS_PRIVATE_KEY) {
    const CoinPayments = require("coinpayments");
    coinPayments = new CoinPayments({
      key: process.env.COINPAYMENTS_PUBLIC_KEY,
      secret: process.env.COINPAYMENTS_PRIVATE_KEY,
    });
  }
  return coinPayments;
}

const createCoinPayment = async ({ amount, currency, email, item_name }) => {
  const cp = getCoinPayments();
  if (!cp) {
    throw new Error("CoinPayments not configured - missing COINPAYMENTS_PUBLIC_KEY or COINPAYMENTS_PRIVATE_KEY");
  }
  
  return await cp.createTransaction({
    amount,
    currency: "USD",
    currency2: "BTC",
    buyer_email: email,
    item_name,
    ipn_url: "https://server.prospct.io/app/payment/coinpayments/ipn",
  });
};

// Helper for IPN signature validation
const validateIPNSignature = (signature, body) => {
  // Implement the validation logic as per CoinPayments' documentation
  // Assuming `crypto` library usage or any hash-based approach to validate
  return true; // Return true if valid, false otherwise
};

module.exports = { createCoinPayment, validateIPNSignature };