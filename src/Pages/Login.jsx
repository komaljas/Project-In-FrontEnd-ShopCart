import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/store";

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
      />
    </label>
  );
}

export default function Login() {
  const { login, user } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    const result = login(form);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate("/profile");
  };

  if (user) {
    return (
      <div className="mx-auto w-[92%] max-w-[420px] py-14 text-center">
        <h1 className="text-xl font-bold text-gray-900">You are already signed in</h1>
        <p className="mt-2 text-sm text-gray-500">Signed in as {user.email}</p>
        <Link
          to="/profile"
          className="mt-6 inline-flex rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Go to profile
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[92%] max-w-[420px] py-10 sm:py-14">
      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900">Log in</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back. Log in to see your orders and profile.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
          />
          <Field
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={form.password}
            onChange={update("password")}
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Log in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          New to ShopCart?{" "}
          <Link to="/register" className="font-semibold text-violet-700 hover:text-violet-800">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
