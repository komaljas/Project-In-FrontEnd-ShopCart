import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingCart, Trash2, Truck } from "lucide-react";
import {
  calculateTotals,
  formatINR,
  formatPrice,
  FREE_SHIPPING_THRESHOLD,
} from "../utils/price";

export default function Cart({ items = [], onUpdateQty, onRemove, onClear }) {
  const totals = useMemo(() => calculateTotals(items), [items]);

  if (!items.length) {
    return (
      <div className="mx-auto w-[92%] max-w-[720px] py-12 text-center sm:py-16">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <ShoppingCart size={34} />
        </div>
        <h1 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
          Your cart is empty
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
          Nothing here yet. Browse the flash deals and add something you like.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Continue shopping <ArrowRight size={17} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[92%] max-w-[1200px] py-6 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Shopping cart
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {totals.count} item{totals.count > 1 ? "s" : ""} in your cart
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Link
            to="/"
            className="flex-1 rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-50 sm:flex-none"
          >
            Continue shopping
          </Link>
          <button
            type="button"
            onClick={onClear}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 sm:flex-none"
          >
            Clear cart
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3 lg:gap-6">
        {/* Items */}
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => {
            const net = Number(item.price) * (1 - Number(item.discountPercentage || 0) / 100);

            return (
              <div
                key={item.id}
                className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:gap-4 sm:p-4"
              >
                <Link
                  to={`/product/${item.id}`}
                  className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50 sm:h-28 sm:w-28"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-contain p-2"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-600">
                        {item.category}
                      </p>
                      <Link
                        to={`/product/${item.id}`}
                        className="line-clamp-2 text-sm font-semibold text-gray-900 transition hover:text-violet-700 sm:truncate sm:text-base"
                      >
                        {item.title}
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove?.(item.id)}
                      aria-label={`Remove ${item.title}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-gray-900">{formatPrice(net)}</span>
                    <span className="text-xs text-gray-400 line-through">{formatPrice(item.price)}</span>
                    {Number(item.discountPercentage) > 0 && (
                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-[11px] font-bold text-green-700">
                        {Math.round(item.discountPercentage)}% off
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => onUpdateQty?.(item.id, Math.max(1, item.quantity - 1))}
                        className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:text-violet-600"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          onUpdateQty?.(item.id, Math.min(item.stock || 99, item.quantity + 1))
                        }
                        className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:text-violet-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      Subtotal: {formatPrice(net * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex items-center gap-3 rounded-xl bg-violet-50 p-4 text-sm text-violet-900">
            <Truck size={20} className="shrink-0" />
            {totals.delivery === 0 ? (
              <p>
                <span className="font-semibold">Free shipping</span> on this order.
              </p>
            ) : (
              <p>
                Add{" "}
                <span className="font-semibold">
                  {formatINR(FREE_SHIPPING_THRESHOLD - totals.payable)}
                </span>{" "}
                more to get free shipping.
              </p>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-gray-900">Order summary</h2>

          <dl className="mt-4 space-y-2.5 text-sm">
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

          {totals.savings > 0 && (
            <p className="mt-2 text-xs text-green-700">
              You save {formatINR(totals.savings)} on this order
            </p>
          )}

          <Link
            to="/checkout"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Proceed to checkout <ArrowRight size={17} />
          </Link>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <ShieldCheck size={14} className="text-green-600" /> Safe and secure payments
          </p>
        </aside>
      </div>
    </div>
  );
}
