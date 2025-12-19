// src/Pages/Login/Login.jsx (updated)
import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { LoginValidation } from "./LoginValidation";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const initialValues = {
  email: "",
  password: "",
};

function Login() {
  const { loginUser, user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on role
      if (role === 'admin') {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, role]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="flex max-w-4xl w-full bg-black rounded-xl shadow-sm border border-neutral-800 overflow-hidden">
        
        {/* Image Section */}
        <div className="hidden md:flex md:w-1/2 bg-neutral-900 items-center justify-center p-8">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/Images/login-img.jpg"
              alt="Perfume"
              className="w-full h-full object-cover rounded-xl opacity-90"
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2">
          <div className="max-w-sm w-full mx-auto">
            
            {/* Header */}
            <div className="bg-black p-6 text-center border-b border-neutral-800">
              <h2 className="text-xl font-semibold text-white">
                Welcome Back
              </h2>
              <p className="text-neutral-400 text-sm mt-1">
                Sign in to your account
              </p>
             
            </div>

            {/* Form */}
            <div className="p-6">
              <Formik
                initialValues={initialValues}
                validationSchema={LoginValidation}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={async (values, { setSubmitting }) => {
                  const result = await loginUser(values.email, values.password);

                  if (result.success) {
                    if (result.role === 'admin') {
                      toast.success("Admin Login Successful");
                      navigate("/admin/dashboard",{replace:true});
                    } else {
                      toast.success("Login Successful");
                      navigate("/",{replace:true});
                    }
                  } else {
                    toast.warn("Invalid Email or Password");
                  }

                  setSubmitting(false);
                }}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-4">
                    {/* Email Field */}
                    <div>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className={`w-full px-3 py-2.5 rounded-md border bg-neutral-900 text-sm text-white placeholder-neutral-500
                          ${
                            errors.email && touched.email
                              ? "border-red-400"
                              : "border-neutral-700 focus:border-white"
                          } focus:outline-none focus:ring-1 focus:ring-white`}
                      />
                      {errors.email && touched.email && (
                        <small className="text-red-400 text-xs mt-1 block">
                          {errors.email}
                        </small>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Password"
                        className={`w-full px-3 py-2.5 rounded-md border bg-neutral-900 text-sm text-white placeholder-neutral-500
                          ${
                            errors.password && touched.password
                              ? "border-red-400"
                              : "border-neutral-700 focus:border-white"
                          } focus:outline-none focus:ring-1 focus:ring-white`}
                      />
                      {errors.password && touched.password && (
                        <small className="text-red-400 text-xs mt-1 block">
                          {errors.password}
                        </small>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white hover:bg-neutral-300 text-black py-2.5 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 text-sm"
                    >
                      {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center pt-3">
                      <span className="text-neutral-400 text-sm">
                        Don't have an account?
                      </span>
                      <Link
                        to="/register"
                        className="text-white hover:text-neutral-300 text-sm font-medium ml-1"
                      >
                        Sign Up
                      </Link>
                    </div>

                  </Form>
                )}
              </Formik>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;