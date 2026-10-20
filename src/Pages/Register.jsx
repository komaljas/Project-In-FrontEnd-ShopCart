import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/store";

function Field({ label, error, ...props }) {
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

function validate(form) {
  const errors = {};

  if (form.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
    errors.phone = "Please enter a valid 10 digit phone number.";
  }

  if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (form.password !== form.confirm) {
    errors.confirm = "Both passwords should match.";
  }

  return errors;
}

export default function Register() {
  const { register } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    const result = register(form);

    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    navigate("/profile");
  };

  return (
    <div className="mx-auto w-[92%] max-w-[460px] py-10 sm:py-14">
      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900">Create an account</h1>
        <p className="mt-1 text-sm text-gray-500">
          It takes a minute. After that you can track your orders.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field
            label="Full name"
            name="name"
            autoComplete="name"
            placeholder="Komal Sharma"
            value={form.name}
            onChange={update("name")}
            error={errors.name}
          />
          <Field
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
            error={errors.email}
          />
          <Field
            label="Phone number"
            name="phone"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="9876543210"
            value={form.phone}
            onChange={update("phone")}
            error={errors.phone}
          />
          <Field
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={update("password")}
            error={errors.password}
          />
          <Field
            label="Confirm password"
            type="password"
            name="confirm"
            autoComplete="new-password"
            placeholder="Type the password again"
            value={form.confirm}
            onChange={update("confirm")}
            error={errors.confirm}
          />

          {message && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{message}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-violet-700 hover:text-violet-800">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
