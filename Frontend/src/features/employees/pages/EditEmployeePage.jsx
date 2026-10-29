import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  AlertCircle,
  Building2,
  User,
  Mail,
  BadgeCheck,
} from "lucide-react";
import { useEmployee } from "../hooks/useEmployee";
import { useDepartment } from "../../departments/hooks/useDepartment";
import PageHeader from "../../../components/layout/PageHeader";
import LoadingState from "../../../components/ui/LoadingState";

export const EditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    fetchEmployeeByIdHandler,
    updateEmployeeHandler,
    loading: saving,
    error: apiError,
  } = useEmployee();
  const { departments, fetchDepartmentsHandler } = useDepartment();

  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    department: "",
    employeeId: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true);
      await fetchDepartmentsHandler();

      const employee = await fetchEmployeeByIdHandler(id);
      if (employee) {
        const deptId =
          typeof employee.department === "object" && employee.department?._id
            ? employee.department._id
            : employee.department || "";

        setFields({
          fullName: employee.fullName || employee.name || "",
          email: employee.email || "",
          department: deptId,
          employeeId: employee.employeeId || "",
        });
      } else {
        setFetchError("Employee not found or could not be loaded.");
      }
      setInitialLoading(false);
    };

    if (id) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validate = (values) => {
    const errors = {};
    if (!values.fullName.trim()) {
      errors.fullName = "Employee name is required.";
    }
    if (!values.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    return errors;
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

    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    // Send payload supporting both fullName and name
    const payload = {
      fullName: fields.fullName.trim(),
      name: fields.fullName.trim(),
      email: fields.email.trim(),
      employeeId: fields.employeeId.trim(),
      department: fields.department || null,
    };

    const success = await updateEmployeeHandler(id, payload);
    if (success) {
      navigate(`/employees/${id}`);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingState message="Loading employee form..." />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center shadow-xs">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">{fetchError}</h2>
          <div className="mt-6">
            <Link
              to="/employees"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Employees
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to={`/employees/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Employee Details
        </Link>
      </div>

      <PageHeader
        title="Edit Employee"
        description="Update employee contact, identification, and department assignments."
        breadcrumbs={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Employees", to: "/employees" },
          { label: fields.fullName || "Employee", to: `/employees/${id}` },
          { label: "Edit" },
        ]}
      />

      {/* Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        {apiError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-start gap-3 text-sm"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Update Failed</p>
              <p className="mt-0.5 text-xs text-red-700">{apiError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Employee Name */}
          <div>
            <label
              htmlFor="emp-fullName"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="emp-fullName"
                name="fullName"
                type="text"
                value={fields.fullName}
                onChange={handleChange}
                placeholder="e.g. Jane Doe"
                disabled={saving}
                className={`w-full h-11 px-3.5 rounded-lg border text-sm text-slate-900 bg-white placeholder:text-slate-400 outline-none transition-all ${
                  fieldErrors.fullName
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                } disabled:opacity-50 disabled:bg-slate-50`}
              />
            </div>
            {fieldErrors.fullName && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {fieldErrors.fullName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="emp-email"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Work Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="emp-email"
                name="email"
                type="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="jane.doe@company.com"
                disabled={saving}
                className={`w-full h-11 px-3.5 rounded-lg border text-sm text-slate-900 bg-white placeholder:text-slate-400 outline-none transition-all ${
                  fieldErrors.email
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                } disabled:opacity-50 disabled:bg-slate-50`}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Employee ID */}
          <div>
            <label
              htmlFor="emp-id"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Employee ID
            </label>
            <input
              id="emp-id"
              name="employeeId"
              type="text"
              value={fields.employeeId}
              onChange={handleChange}
              placeholder="e.g. EMP-1042"
              disabled={saving}
              className="w-full h-11 px-3.5 font-mono rounded-lg border border-slate-200 text-sm text-slate-900 bg-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:bg-slate-50 transition-all"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Unique internal staff identifier for hardware tracking.
            </p>
          </div>

          {/* Department */}
          <div>
            <label
              htmlFor="emp-department"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Department
            </label>
            <select
              id="emp-department"
              name="department"
              value={fields.department}
              onChange={handleChange}
              disabled={saving}
              className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:bg-slate-50 transition-all cursor-pointer"
            >
              <option value="">Unassigned</option>
              {departments &&
                departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
            </select>
          </div>

          {/* Note regarding role/password protection */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
            <strong>Security Notice:</strong> Role assignments and authentication passwords cannot be altered from this employee profile form.
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-slate-100 justify-end">
            <Link
              to={`/employees/${id}`}
              className="inline-flex items-center justify-center h-10 px-4 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-2xs disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeePage;