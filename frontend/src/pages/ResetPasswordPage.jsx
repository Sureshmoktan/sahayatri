import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";

// ── Password strength checker ──
const checkStrength = (password) => {
  const checks = {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number:    /[0-9]/.test(password),
    special:   /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  return { checks, passed };
};

const strengthLabel = (passed) => {
  if (passed <= 1) return { label: "Very Weak",  color: "bg-red-500",    text: "text-red-500"    };
  if (passed === 2) return { label: "Weak",       color: "bg-orange-500", text: "text-orange-500" };
  if (passed === 3) return { label: "Fair",       color: "bg-yellow-500", text: "text-yellow-500" };
  if (passed === 4) return { label: "Strong",     color: "bg-blue-500",   text: "text-blue-500"   };
  return              { label: "Very Strong", color: "bg-emerald-500", text: "text-emerald-500" };
};

export default function ResetPasswordPage() {
  const { token }   = useParams();
  const navigate    = useNavigate();

  const [form, setForm]               = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [errors, setErrors]           = useState({});
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { checks, passed } = checkStrength(form.password);
  const strength = strengthLabel(passed);

  const validate = () => {
    const newErrors = {};

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!checks.uppercase) {
      newErrors.password = "Must contain at least one uppercase letter";
    } else if (!checks.lowercase) {
      newErrors.password = "Must contain at least one lowercase letter";
    } else if (!checks.number) {
      newErrors.password = "Must contain at least one number";
    } else if (!checks.special) {
      newErrors.password = "Must contain at least one special character (!@#$%^&*)";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await resetPassword(token, form.password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Link expired or invalid." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-blue-100/60 border border-blue-100 overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500" />
        <div className="p-8">

          {!success ? (
            <>
              <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <h1 className="text-2xl font-black text-slate-900 mb-1">Set New Password</h1>
              <p className="text-slate-400 text-sm mb-6">Choose a strong password for your account.</p>

              {/* API Error */}
              {errors.api && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3 mb-4">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.api}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">New Password</label>
                  <div className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 transition-all duration-200
                    ${errors.password ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50 focus-within:border-blue-400 focus-within:bg-white"}`}>
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, password: e.target.value }));
                        setErrors((p) => ({ ...p, password: "" }));
                      }}
                      placeholder="Min. 8 characters"
                      className="flex-1 outline-none text-sm font-medium text-slate-700 bg-transparent placeholder-slate-300"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-blue-500 transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showPass
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                        }
                      </svg>
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}

                  {/* Strength bar — shows when typing */}
                  {form.password.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {/* Bar */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              i <= passed ? strength.color : "bg-slate-100"
                            }`}
                          />
                        ))}
                      </div>
                      {/* Label */}
                      <p className={`text-xs font-bold ${strength.text}`}>
                        {strength.label}
                      </p>

                      {/* Checklist */}
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        {[
                          { key: "length",    label: "8+ characters"       },
                          { key: "uppercase", label: "Uppercase letter"     },
                          { key: "lowercase", label: "Lowercase letter"     },
                          { key: "number",    label: "Number"               },
                          { key: "special",   label: "Special character"    },
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                              checks[key] ? "bg-emerald-500" : "bg-slate-200"
                            }`}>
                              {checks[key] && (
                                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs transition-colors duration-200 ${
                              checks[key] ? "text-emerald-600 font-semibold" : "text-slate-400"
                            }`}>
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Confirm Password</label>
                  <div className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 transition-all duration-200
                    ${errors.confirmPassword ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50 focus-within:border-blue-400 focus-within:bg-white"}`}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, confirmPassword: e.target.value }));
                        setErrors((p) => ({ ...p, confirmPassword: "" }));
                      }}
                      placeholder="Re-enter password"
                      className="flex-1 outline-none text-sm font-medium text-slate-700 bg-transparent placeholder-slate-300"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-slate-400 hover:text-blue-500 transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showConfirm
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                        }
                      </svg>
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}

                  {/* Match indicator */}
                  {form.confirmPassword.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                        form.password === form.confirmPassword ? "bg-emerald-500" : "bg-red-400"
                      }`}>
                        <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {form.password === form.confirmPassword
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          }
                        </svg>
                      </div>
                      <span className={`text-xs font-semibold ${
                        form.password === form.confirmPassword ? "text-emerald-600" : "text-red-400"
                      }`}>
                        {form.password === form.confirmPassword ? "Passwords match" : "Passwords do not match"}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || passed < 4}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-sm font-bold py-3.5 rounded-xl shadow-md shadow-blue-200 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Resetting...
                    </>
                  ) : "Reset Password →"}
                </button>

                {/* Hint */}
                {passed < 4 && form.password.length > 0 && (
                  <p className="text-xs text-slate-400 text-center">
                    Password must be at least <span className="font-bold text-blue-500">Strong</span> to continue
                  </p>
                )}
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Password Reset! 🎉</h2>
              <p className="text-slate-400 text-sm mb-2">Your password has been updated successfully.</p>
              <p className="text-slate-300 text-xs mb-6">Redirecting to login in 3 seconds...</p>
              <Link to="/login" className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline">
                Go to Login →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}