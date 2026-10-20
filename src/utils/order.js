export const ORDER_STEPS = [
  { key: "Placed", label: "Order placed", note: "We have received your order." },
  { key: "Packed", label: "Packed", note: "Your items are packed and ready to go." },
  { key: "Shipped", label: "Shipped", note: "The parcel has left our warehouse." },
  { key: "Out for delivery", label: "Out for delivery", note: "The courier is on the way to you." },
  { key: "Delivered", label: "Delivered", note: "Delivered. Thanks for shopping with us." },
];

// Minutes after placing the order at which each step becomes the current one.
const STEP_TIMELINE = [0, 1, 5, 30, 60];

export function createOrderId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const random = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `SC-${stamp}${random}`;
}

export function getOrderStep(order) {
  const placedAt = new Date(order?.placedAt || Date.now()).getTime();
  const minutes = (Date.now() - placedAt) / 60000;

  let index = 0;
  STEP_TIMELINE.forEach((minute, step) => {
    if (minutes >= minute) index = step;
  });

  return { index, ...ORDER_STEPS[index] };
}

export function formatOrderDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
