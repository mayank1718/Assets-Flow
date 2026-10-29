import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FormInput,
  PrimaryButton,
  PasswordToggle,
  ErrorBanner,
  AssetFlowBrand,
} from "../components/AuthUI";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, loading, error } = useAuth();

  const [fields, setFields] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (values) => {
    const errs = {};
    if (!values.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!values.password) {
      errs.password = "Password is required.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change after first submit attempt
    if (submitted && fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    const success = await handleLogin(fields.email, fields.password);
    if (success) {
      navigate("/");
    }
  };

  // Extract a readable error message from the auth context error
  const apiErrorMessage = error
    ? error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again."
    : null;

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px]">
        {/* Brand */}
        <div className="mb-8">
          <AssetFlowBrand />
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl px-8 py-8">
          {/* Heading */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to manage your workplace assets.
            </p>
          </div>

          {/* API Error */}
          {apiErrorMessage && (
            <div className="mb-5">
              <ErrorBanner message={apiErrorMessage} />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <FormInput
              id="login-email"
              name="email"
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={fields.email}
              onChange={handleChange}
              error={fieldErrors.email}
              disabled={loading}
              autoComplete="email"
              autoFocus
            />

            <FormInput
              id="login-password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={fields.password}
              onChange={handleChange}
              error={fieldErrors.password}
              disabled={loading}
              autoComplete="current-password"
              rightElement={
                <PasswordToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                />
              }
            />

            <div className="mt-1">
              <PrimaryButton
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Sign in
              </PrimaryButton>
            </div>
          </form>
        </div>

        {/* Register link */}
        <p className="mt-5 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors duration-150"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;