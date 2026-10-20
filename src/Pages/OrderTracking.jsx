import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, MapPin, Package, Truck, UserRound } from "lucide-react";
import { useStore } from "../context/store";
import { discountedValue, formatINR, formatPrice } from "../utils/price";
import { formatOrderDate, getOrderStep, ORDER_STEPS } from "../utils/order";

const PAYMENT_LABELS = {
  upi: "UPI",
  card: "Card",
  cod: "Cash on delivery",
};

export default function OrderTracking() {
  const { id } = useParams();
  const { user, orders } = useStore();

  if (!user) {
    return (
      <div className="mx-auto w-[92%] max-w-[520px] py-14 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <UserRound size={34} />
        </div>
        <h1 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
          Log in to track your order
        </h1>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Log in
        </Link>
      </div>
    );
  }

  const order = orders.find((item) => item.id === id);

  if (!order) {
    return (
      <div className="mx-auto w-[92%] max-w-[520px] py-14 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
          <Package size={34} />
        </div>
        <h1 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">Order not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          We could not find an order with the id {id}.
        </p>
        <Link
          to="/orders"
          className="mt-6 inline-flex rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          See all orders
        </Link>
      </div>
    );
  }

  const step = getOrderStep(order);
  const itemCount = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div className="mx-auto w-[92%] max-w-[1100px] py-6 sm:py-8">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        <ArrowLeft size={16} /> All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Order {order.id}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed on {formatOrderDate(order.placedAt)} · {itemCount} item
            {itemCount > 1 ? "s" : ""}
          </p>
        </div>
        <span className="rounded-full bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700">
          {step.label}
        </span>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3 lg:gap-6">
        {/* Tracking */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
              <Truck size={18} className="text-violet-600" /> Tracking
            </h2>

            <ol className="mt-5">
              {ORDER_STEPS.map((item, index) => {
                const done = index <= step.index;
                const current = index === step.index;

                return (
                  <li key={item.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                          done
                            ? "border-violet-600 bg-violet-600 text-white"
                            : "border-gray-200 bg-white text-gray-300"
                        }`}
                      >
                        {done ? <Check size={14} strokeWidth={3} /> : null}
                      </span>
                      {index < ORDER_STEPS.length - 1 && (
                        <span
                          className={`w-0.5 flex-1 ${
                            index < step.index ? "bg-violet-600" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>

                    <div className="pb-6">
                      <p
                        className={`text-sm font-semibold ${
                          done ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{item.note}</p>
                      {current && (
                        <p className="mt-1 text-xs font-semibold text-violet-700">
                          Current status
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold text-gray-900">Items in this order</h2>

            <ul className="mt-4 space-y-4">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <Link
                    to={`/product/${item.id}`}
                    className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-contain p-1"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${item.id}`}
                      className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-violet-700"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-gray-500">Qty {item.quantity}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-gray-900">
                    {formatPrice(
                      discountedValue(item.price, item.discountPercentage) *
                        (item.quantity || 1)
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Details */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
              <MapPin size={17} className="text-violet-600" /> Delivery address
            </h2>
            <address className="mt-3 text-sm not-italic leading-6 text-gray-600">
              <span className="block font-medium text-gray-900">{order.address.fullName}</span>
              {order.address.address}
              {order.address.landmark ? `, ${order.address.landmark}` : ""}
              <br />
              {order.address.city}, {order.address.state} {order.address.pincode}
              <br />
              {order.address.phone}
            </address>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold text-gray-900">Payment</h2>
            <p className="mt-2 text-sm text-gray-600">
              {PAYMENT_LABELS[order.payment] || order.payment}
            </p>

            <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal (MRP)</dt>
                <dd className="font-medium text-gray-500 line-through decoration-gray-300">
                  {formatINR(order.totals.mrp)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Discount on MRP</dt>
                <dd className="font-medium text-green-600">
                  − {formatINR(order.totals.savings)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Delivery</dt>
                <dd
                  className={`font-medium ${
                    order.totals.delivery === 0 ? "text-green-600" : ""
                  }`}
                >
                  {order.totals.delivery === 0 ? "FREE" : formatINR(order.totals.delivery)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
                <dt>Total</dt>
                <dd>{formatINR(order.totals.grand)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
