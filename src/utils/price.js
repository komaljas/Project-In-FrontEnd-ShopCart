export const USD_TO_INR = 88;

export const FREE_SHIPPING_THRESHOLD = 499;
export const DELIVERY_CHARGE = 49;

export function toINR(amountInUSD) {
  return Math.round(Number(amountInUSD || 0) * USD_TO_INR);
}

export function formatPrice(amountInUSD) {
  return `₹${toINR(amountInUSD).toLocaleString("en-IN")}`;
}

export function getDiscountedPrice(price, discountPercentage) {
  const discounted = Number(price || 0) * (1 - Number(discountPercentage || 0) / 100);
  return formatPrice(discounted);
}

export function discountedValue(price, discountPercentage) {
  return Number(price || 0) * (1 - Number(discountPercentage || 0) / 100);
}

// For amounts that are already in rupees (cart totals, order totals).
export function formatINR(amount) {
  return `₹${Math.round(Number(amount) || 0).toLocaleString("en-IN")}`;
}

// Item prices are in dollars, the totals that come back are in rupees.
export function calculateTotals(items = []) {
  let mrp = 0;
  let payable = 0;
  let count = 0;

  items.forEach((item) => {
    const qty = Number(item.quantity) || 0;
    count += qty;
    mrp += Number(item.price) * USD_TO_INR * qty;
    payable += discountedValue(item.price, item.discountPercentage) * USD_TO_INR * qty;
  });

  const savings = mrp - payable;
  const delivery =
    payable === 0 || payable >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_CHARGE;

  return { mrp, payable, savings, delivery, grand: payable + delivery, count };
}
