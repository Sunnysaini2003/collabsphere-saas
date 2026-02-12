import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://collabsphere-saas.onrender.com/api/auth/login",
        formData
      );
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard"); 
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body p-5">
          
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Welcome Back</h2>
            <p className="text-muted small">Log in to your CollabSphere account</p>
          </div>

          <form onSubmit={loginUser}>
            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Mail size={18} />
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  className="form-control border-start-0 ps-0"
                  placeholder="name@example.com"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label className="form-label small fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Lock size={18} />
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-control border-start-0 border-end-0 ps-0"
                  placeholder="Enter password"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="input-group-text bg-white border-start-0 text-muted"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="remember" />
                <label className="form-check-label small" htmlFor="remember">Remember me</label>
              </div>
              <a href="/" className="small text-decoration-none fw-semibold">Forgot?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
              style={{ backgroundColor: "#4f46e5", border: "none" }}
            >
              {isLoading ? <Loader2 className="spinner-border spinner-border-sm" /> : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-4 mb-0 small text-muted">
            Don't have an account? <a href="/signup" className="text-decoration-none fw-bold">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}