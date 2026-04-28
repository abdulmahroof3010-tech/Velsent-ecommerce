import React,{useState} from "react";
import { Formik, Form, Field } from "formik";
import { RegisterValidation } from "./RegisterValidation";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { tuple } from "yup";

const initialValues = {
  name: "",
  email: "",
  password: "",
  cpassword: "",
};

function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showComPassword, setShowComPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-black rounded-xl shadow-sm border border-neutral-800 overflow-hidden">
        {/* Minimal Header */}
        <div className="bg-black p-6 text-center border-b border-neutral-800">
          <h3 className="text-xl font-semibold text-white">CREATE ACCOUNT</h3>
          <p className="text-neutral-400 text-sm mt-1">
            Begin Your Fragrance Journey
          </p>
        </div>

        {/* Compact Form */}
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={RegisterValidation}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const result = await registerUser({
                  name: values.name,
                  email: values.email,
                  password: values.password,
                });

                console.log("register Faileed:", result);
                if (result.success) {
                  toast.success(result.message);

                  navigate("/verify-otp", { state: { email: values.email } });
                } else {
                  toast.error(result.message);
                }
              } catch (err) {
                console.log("Error Registering User: ", err);
                toast.warn("Failed to Create Account !");
              } finally {
           
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                {/* Name Field */}
                <div>
                  <Field name="name" >
                    {({field,form})=>(
                        <input 
                        {...field}
                      type="text"
                    name="name"
                    placeholder="Full Name"
                    className={`w-full px-3 py-2.5 rounded-md border bg-neutral-900 text-sm text-white placeholder-neutral-500
                      ${
                        errors.name && touched.name
                        ? "border-red-400"
                        : "border-neutral-700 focus:border-white"
                        } focus:outline-none focus:ring-1 focus:ring-white`}

                        onFocus={()=>form.setFieldError("name","")}
                        />
                      )}
                  </Field>
                  {errors.name && touched.name && (
                    <small className="text-red-400 text-xs mt-1 block">
                      {errors.name}
                    </small>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <Field name="email">
                    {({field,form})=>(
                      <input 
                      {...field}
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className={`w-full px-3 py-2.5 rounded-md border bg-neutral-900 text-sm text-white placeholder-neutral-500
                        ${
                          errors.email && touched.email
                          ? "border-red-400"
                          : "border-neutral-700 focus:border-white"
                        } focus:outline-none focus:ring-1 focus:ring-white`}

                        onFocus={()=> form.setFieldError("email","")}
                        />
                      )}
                </Field>
                  {errors.email && touched.email && (
                    <small className="text-red-400 text-xs mt-1 block">
                      {errors.email}
                    </small>
                  )}
                </div>

                {/* Password Field */}
                <div className="relative">
                  <Field name="password">
                    {({field,form})=>(

                      <input 
                      {...field}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className={`w-full px-3 py-2.5 pr-10 rounded-md border bg-neutral-900 text-sm text-white placeholder-neutral-500
                        ${
                          errors.password && touched.password
                          ? "border-red-400"
                          : "border-neutral-700 focus:border-white"
                        } focus:outline-none focus:ring-1 focus:ring-white`}
                        onFocus={()=> form.setFieldError("password","")}
                        />
                      )}
                      </Field>

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>

                  {errors.password && touched.password && (
                    <small className="text-red-400 text-xs mt-1 block">
                      {errors.password}
                    </small>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <Field name="cpassword">
                    {({field,form})=>(
                      <input 
                      {...field}
                      
                      
                      
                      type={showComPassword ? "text" : "password"}
                      name="cpassword"
                      placeholder="Confirm Password"
                      className={`w-full px-3 py-2.5 pr-10 rounded-md border bg-neutral-900 text-sm text-white placeholder-neutral-500
                        ${
                          errors.cpassword && touched.cpassword
                          ? "border-red-400"
                          : "border-neutral-700 focus:border-white"
                        } focus:outline-none focus:ring-1 focus:ring-white`}
                        
                        onFocus={()=> form.setFieldError("cpassword","")}
                        />
                      )}
                      </Field>

                  <button
                    type="button"
                    onClick={() => setShowComPassword(!showComPassword)}
                    className="absolute right-3 top-2.5 text-gray-400"
                  >
                    {showComPassword ?<FaEye /> :  <FaEyeSlash />}
                  </button>

                  {errors.cpassword && touched.cpassword && (
                    <small className="text-red-400 text-xs mt-1 block">
                      {errors.cpassword}
                    </small>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-neutral-300 text-black py-2.5 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? "Sending OTP...." : "Create Account"}
                </button>

                {/* Login Link */}
                <div className="text-center pt-3">
                  <p className="text-neutral-400 text-sm inline">
                    Already have an account?
                  </p>
                  <Link
                    to="/login"
                    className="text-white hover:text-neutral-300 text-sm font-medium inline-block ml-1"
                  >
                    Sign In
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Register;
