import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, ShoppingCart } from "lucide-react";
import { useStore } from "../context/store";
import { calculateTotals, discountedValue, formatINR, formatPrice } from "../utils/price";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", note: "Pay with any UPI app" },
  { id: "card", label: "Card", note: "Debit or credit card" },
  { id: "cod", label: "Cash on delivery", note: "Pay when the parcel arrives" },
];

function TextField({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        {...props}
        className={`mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-100 ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-gray-300 focus:border-violet-500"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export default function Checkout({ items = [], onClear }) {
  const { user, placeOrder } = useStore();
  const navigate = useNavigate();

  const totals = useMemo(() => calculateTotals(items), [items]);

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [payment, setPayment] = useState("upi");
  const [errors, setErrors] = useState({});

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const validate = () => {
    const next = {};

    if (form.fullName.trim().length < 2) {
      next.fullName = "Please enter your full name.";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      next.phone = "Please enter a valid 10 digit phone number.";
    }

    if (form.address.trim().length < 5) {
      next.address = "Please enter your street address.";
    }

    if (!form.city.trim()) {
      next.city = "Please enter your city.";
    }

    if (!form.state.trim()) {
      next.state = "Please enter your state.";
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      next.pincode = "Please enter a valid 6 digit pincode.";
    }

    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const next = validate();
    setErrors(next);

    if (Object.keys(next).length) {
      return;
    }

    const order = placeOrder({
      items,
      totals,
      address: { ...form },
      payment,
    });

    onClear?.();
    navigate(`/orders/${order.id}`);
  };

  if (!items.length) {
    return (
      <div className="mx-auto w-[92%] max-w-[600px] py-12 text-center sm:py-16">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <ShoppingCart size={34} />
        </div>
        <h1 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
          There is nothing to check out
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Add a few products to your cart and come back here.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Browse products <ArrowRight size={17} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[92%] max-w-[1100px] py-6 sm:py-8">
      <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
        Checkout
      </h1>

      {!user && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p>Log in to keep this order in your account.</p>
          <Link
            to="/login"
            className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700"
          >
            Log in
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-3 lg:gap-6">
        {/* Form */}
        <div className="space-y-4 lg:col-span-2">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-base font-bold text-gray-900">Delivery address</h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Full name"
                  name="fullName"
                  autoComplete="name"
                  placeholder="Komal Sharma"
                  value={form.fullName}
                  onChange={update("fullName")}
                  error={errors.fullName}
                />
                <TextField
                  label="Phone number"
                  name="phone"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={update("phone")}
                  error={errors.phone}
                />
                <div className="sm:col-span-2">
                  <TextField
                    label="Address"
                    name="address"
                    autoComplete="street-address"
                    placeholder="Flat / house number, street, area"
                    value={form.address}
                    onChange={update("address")}
                    error={errors.address}
                  />
                </div>
                <TextField
                  label="Landmark (optional)"
                  name="landmark"
                  placeholder="Near the park"
                  value={form.landmark}
                  onChange={update("landmark")}
                />
                <TextField
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  placeholder="Indore"
                  value={form.city}
                  onChange={update("city")}
                  error={errors.city}
                />
                <TextField
                  label="State"
                  name="state"
                  autoComplete="address-level1"
                  placeholder="Madhya Pradesh"
                  value={form.state}
                  onChange={update("state")}
                  error={errors.state}
                />
                <TextField
                  label="Pincode"
                  name="pincode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="452001"
                  value={form.pincode}
                  onChange={update("pincode")}
                  error={errors.pincode}
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-base font-bold text-gray-900">Payment method</h2>

              <div className="mt-4 space-y-2">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                      payment === method.id
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={payment === method.id}
                      onChange={() => setPayment(method.id)}
                      className="h-4 w-4 accent-violet-600"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-gray-900">
                        {method.label}
                      </span>
                      <span className="block text-xs text-gray-500">{method.note}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 lg:hidden"
            >
              Place order · {formatINR(totals.grand)}
            </button>
          </form>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-gray-900">Order summary</h2>

          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => {
              const lineTotal =
                discountedValue(item.price, item.discountPercentage) * (item.quantity || 1);

              return (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-gray-900">
                    {formatPrice(lineTotal)}
                  </span>
                </li>
              );
            })}
          </ul>

          <dl className="mt-4 space-y-2.5 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal (MRP)</dt>
              <dd className="font-medium text-gray-500 line-through decoration-gray-300">
                {formatINR(totals.mrp)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Discount on MRP</dt>
              <dd className="font-medium text-green-600">− {formatINR(totals.savings)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Delivery</dt>
              <dd className={`font-medium ${totals.delivery === 0 ? "text-green-600" : ""}`}>
                {totals.delivery === 0 ? "FREE" : formatINR(totals.delivery)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
              <dt>Total</dt>
              <dd>{formatINR(totals.grand)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            form="checkout-form"
            className="mt-4 hidden w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 lg:flex"
          >
            Place order <ArrowRight size={17} />
          </button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <Lock size={13} className="text-green-600" /> Safe and secure payments
          </p>
        </aside>
      </div>
    </div>
  );
}
