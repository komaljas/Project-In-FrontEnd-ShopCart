import { useEffect, useState } from "react";
import { StoreContext } from "./store";
import { createOrderId } from "../utils/order";

const STORAGE_KEYS = {
  users: "shopcart.users",
  user: "shopcart.user",
  orders: "shopcart.orders",
  wishlist: "shopcart.wishlist",
};

function readStore(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is not available, the app still works for this session.
  }
}

export default function StoreProvider({ children }) {
  const [users, setUsers] = useState(() => readStore(STORAGE_KEYS.users, []));
  const [user, setUser] = useState(() => readStore(STORAGE_KEYS.user, null));
  const [orders, setOrders] = useState(() => readStore(STORAGE_KEYS.orders, []));
  const [wishlist, setWishlist] = useState(() => readStore(STORAGE_KEYS.wishlist, []));

  useEffect(() => writeStore(STORAGE_KEYS.users, users), [users]);
  useEffect(() => writeStore(STORAGE_KEYS.user, user), [user]);
  useEffect(() => writeStore(STORAGE_KEYS.orders, orders), [orders]);
  useEffect(() => writeStore(STORAGE_KEYS.wishlist, wishlist), [wishlist]);

  const register = ({ name, email, phone, password }) => {
    const cleanEmail = email.trim().toLowerCase();

    if (users.some((item) => item.email === cleanEmail)) {
      return { ok: false, error: "An account with this email already exists." };
    }

    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setUser({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      createdAt: newUser.createdAt,
    });

    return { ok: true };
  };

  const login = ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((item) => item.email === cleanEmail);

    if (!found) {
      return { ok: false, error: "No account found with this email." };
    }

    if (found.password !== password) {
      return { ok: false, error: "That password is not correct. Please try again." };
    }

    setUser({
      name: found.name,
      email: found.email,
      phone: found.phone,
      createdAt: found.createdAt,
    });

    return { ok: true };
  };

  const logout = () => setUser(null);

  const placeOrder = ({ items, totals, address, payment }) => {
    const order = {
      id: createOrderId(),
      placedAt: new Date().toISOString(),
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        thumbnail: item.thumbnail,
        price: item.price,
        discountPercentage: item.discountPercentage,
        quantity: item.quantity,
      })),
      totals,
      address,
      payment,
    };

    setOrders((prev) => [order, ...prev]);

    return order;
  };

  const isWishlisted = (id) => wishlist.some((item) => item.id === id);

  const toggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product]
    );
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const value = {
    user,
    users,
    orders,
    wishlist,
    register,
    login,
    logout,
    placeOrder,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
