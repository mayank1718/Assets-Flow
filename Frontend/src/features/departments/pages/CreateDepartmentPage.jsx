import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDepartment } from "../hooks/useDepartment";
import {
  PageLayout,
  PageHeader,
  Card,
  FormField,
  FormTextarea,
  PrimaryButton,
  SecondaryButton,
  ErrorBanner,
  BackLink,
} from "../../shared/components/AdminUI";

const validate = (values) => {
  const errors = {};
  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }
  if (!values.code.trim()) {
    errors.code = "Code is required.";
  }
  return errors;
};

const CreateDepartmentPage = () => {
  const navigate = useNavigate();
  const { createDepartmentHandler, loading, error } = useDepartment();

  const [fields, setFields] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

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

    const success = await createDepartmentHandler({
      name: fields.name.trim(),
      code: fields.code.trim(),
      description: fields.description.trim(),
    });

    if (success) {
      navigate("/departments");
    }
  };

  return (
    <PageLayout>
      <BackLink to="/departments" label="Back to Departments" />
      <PageHeader
        title="Create Department"
        description="Add a new department to your organisation."
      />

      <div className="max-w-2xl">
        <Card>
          <div className="px-6 py-6">
            {error && (
              <div className="mb-6">
                <ErrorBanner message={error} />
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-5">
                <FormField
                  id="dept-name"
                  name="name"
                  label="Department Name"
                  placeholder="e.g. Engineering"
                  required
                  value={fields.name}
                  onChange={handleChange}
                  error={fieldErrors.name}
                  disabled={loading}
                  autoFocus
                />

                <FormField
                  id="dept-code"
                  name="code"
                  label="Department Code"
                  placeholder="e.g. ENG"
                  required
                  value={fields.code}
                  onChange={handleChange}
                  error={fieldErrors.code}
                  disabled={loading}
                />

                <FormTextarea
                  id="dept-description"
                  name="description"
                  label="Description"
                  placeholder="Optional description of this department's function."
                  value={fields.description}
                  onChange={handleChange}
                  error={fieldErrors.description}
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3 mt-7 pt-6 border-t border-slate-100">
                <PrimaryButton type="submit" loading={loading} disabled={loading}>
                  Create Department
                </PrimaryButton>
                <SecondaryButton
                  type="button"
                  disabled={loading}
                  onClick={() => navigate("/departments")}
                >
                  Cancel
                </SecondaryButton>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CreateDepartmentPage;