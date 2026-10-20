import { Link } from "react-router-dom";
import { ArrowRight, Package, UserRound } from "lucide-react";
import { useStore } from "../context/store";
import { formatINR } from "../utils/price";
import { formatOrderDate, getOrderStep } from "../utils/order";

export default function Orders() {
  const { user, orders } = useStore();

  if (!user) {
    return (
      <div className="mx-auto w-[92%] max-w-[520px] py-14 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <UserRound size={34} />
        </div>
        <h1 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
          Log in to see your orders
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

  return (
    <div className="mx-auto w-[92%] max-w-[900px] py-6 sm:py-8">
      <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
        Your orders
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {orders.length} order{orders.length === 1 ? "" : "s"} placed so far
      </p>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white px-5 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
            <Package size={24} />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-900">
            You have not placed any order yet
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-800"
          >
            Start shopping <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((order) => {
            const step = getOrderStep(order);
            const itemCount = order.items.reduce(
              (sum, item) => sum + (item.quantity || 0),
              0
            );

            return (
              <li key={order.id}>
                <Link
                  to={`/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 transition hover:border-violet-200 sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {formatOrderDate(order.placedAt)} · {itemCount} item
                      {itemCount > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                      {step.label}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatINR(order.totals.grand)}
                    </span>
                    <ArrowRight size={16} className="text-gray-400" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
