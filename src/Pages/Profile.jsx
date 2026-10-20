import { Link } from "react-router-dom";
import { ArrowRight, Heart, LogOut, Package, UserRound } from "lucide-react";
import { useStore } from "../context/store";
import { formatINR } from "../utils/price";
import { formatOrderDate, getOrderStep } from "../utils/order";

export default function Profile() {
  const { user, orders, wishlist, logout } = useStore();

  if (!user) {
    return (
      <div className="mx-auto w-[92%] max-w-[520px] py-14 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <UserRound size={34} />
        </div>
        <h1 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
          Log in to see your profile
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Your orders, addresses and saved items live in your account.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            to="/login"
            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-50"
          >
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[92%] max-w-[1100px] py-6 sm:py-8">
      <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
        Your profile
      </h1>

      <div className="mt-6 grid gap-5 lg:grid-cols-3 lg:gap-6">
        {/* Account */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-700">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            <dl className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm">
              <div>
                <dt className="text-xs text-gray-500">Phone number</dt>
                <dd className="mt-0.5 font-medium text-gray-900">{user.phone || "Not added"}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Member since</dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {user.createdAt ? formatOrderDate(user.createdAt) : "Today"}
                </dd>
              </div>
            </dl>

            <div className="mt-5 space-y-2">
              <Link
                to="/wishlist"
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-500" />
                  Wishlist
                </span>
                <span className="text-xs text-gray-500">{wishlist.length} saved</span>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <LogOut size={16} className="text-gray-500" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-bold text-gray-900">Your orders</h2>
              {orders.length > 0 && (
                <span className="text-xs text-gray-500">{orders.length} total</span>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                  <Package size={24} />
                </div>
                <p className="mt-4 text-sm font-medium text-gray-900">
                  You have not placed any order yet
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Your orders will show up here once you check out.
                </p>
                <Link
                  to="/"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-800"
                >
                  Start shopping <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
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
                        className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-gray-50"
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
        </div>
      </div>
    </div>
  );
}
