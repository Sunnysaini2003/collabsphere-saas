import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const res = await axios.post(
        "https://collabsphere-saas.onrender.com/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      alert("Login success");
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>CollabSphere Login</h2>

      <input
        className="form-control mt-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="form-control mt-3"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-dark mt-3" onClick={loginUser}>
        Login
      </button>
    </div>
  );
}