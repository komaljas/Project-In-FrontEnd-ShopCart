import { Link } from "react-router-dom";
import { ArrowRight, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useStore } from "../context/store";
import { formatPrice, getDiscountedPrice } from "../utils/price";

export default function Wishlist({ onAdd }) {
  const { wishlist, toggleWishlist, removeFromWishlist } = useStore();

  if (!wishlist.length) {
    return (
      <div className="mx-auto w-[92%] max-w-[600px] py-12 text-center sm:py-16">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
          <Heart size={34} />
        </div>
        <h1 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
          Your wishlist is empty
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
          Tap the heart on any product to save it here for later.
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
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Wishlist
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {wishlist.length} item{wishlist.length > 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
          >
            <div className="relative aspect-square bg-gray-50">
              <Link to={`/product/${product.id}`} aria-label={`View ${product.title}`}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  loading="lazy"
                  className="h-full w-full object-contain p-3 sm:p-4"
                />
              </Link>

              {Number(product.discountPercentage) > 0 && (
                <span className="absolute left-2 top-2 rounded-md bg-red-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
                  -{Math.round(product.discountPercentage)}%
                </span>
              )}

              <button
                type="button"
                onClick={() => removeFromWishlist(product.id)}
                aria-label={`Remove ${product.title} from wishlist`}
                className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition hover:scale-105"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex flex-1 flex-col p-3 sm:p-4">
              <p className="mb-1 truncate text-xs font-medium capitalize text-violet-600">
                {product.category}
              </p>
              <h2 className="line-clamp-2 min-h-9 text-sm font-semibold text-gray-900">
                <Link to={`/product/${product.id}`} className="hover:text-violet-700">
                  {product.title}
                </Link>
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-sm font-bold text-gray-900 sm:text-base">
                  {getDiscountedPrice(product.price, product.discountPercentage)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onAdd?.(product, 1)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-700 sm:text-sm"
              >
                <ShoppingCart size={16} />
                Add to cart
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 sm:text-sm"
              >
                <Heart size={15} className="fill-red-500 text-red-500" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
