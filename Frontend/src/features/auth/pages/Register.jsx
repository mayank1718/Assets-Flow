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

const INITIAL_FIELDS = {
  fullName: "",
  email: "",
  password: "",
};

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, loading, error } = useAuth();

  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (values) => {
    const errs = {};
    if (!values.fullName.trim()) errs.fullName = "Full name is required.";
    if (!values.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!values.password) {
      errs.password = "Password is required.";
    } else if (values.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }
    if (!values.department.trim()) errs.department = "Department is required.";
    if (!values.employeeId.trim()) errs.employeeId = "Employee ID is required.";
    if (!values.designation.trim()) errs.designation = "Designation is required.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
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
    const success = await handleRegister(
      fields.fullName,
      fields.email,
      fields.password,
    );
    if (success) {
      navigate("/");
    }
  };

  const apiErrorMessage = error
    ? error?.response?.data?.message ||
      error?.message ||
      "Registration failed. Please try again."
    : null;

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[520px]">
        {/* Brand */}
        <div className="mb-8">
          <AssetFlowBrand />
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl px-8 py-8">
          {/* Heading */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Get started managing your workplace assets.
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
            {/* Section: Personal */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Personal details
              </p>

              <FormInput
                id="reg-fullName"
                name="fullName"
                label="Full name"
                type="text"
                placeholder="Jane Doe"
                value={fields.fullName}
                onChange={handleChange}
                error={fieldErrors.fullName}
                disabled={loading}
                autoComplete="name"
                autoFocus
              />

              <FormInput
                id="reg-email"
                name="email"
                label="Work email"
                type="email"
                placeholder="you@company.com"
                value={fields.email}
                onChange={handleChange}
                error={fieldErrors.email}
                disabled={loading}
                autoComplete="email"
              />

              <FormInput
                id="reg-password"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={fields.password}
                onChange={handleChange}
                error={fieldErrors.password}
                disabled={loading}
                autoComplete="new-password"
                rightElement={
                  <PasswordToggle
                    visible={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                  />
                }
              />
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 my-1" />
          
            <div className="mt-2">
              <PrimaryButton
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Create account
              </PrimaryButton>
            </div>
          </form>
        </div>

        {/* Login link */}
        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors duration-150"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;