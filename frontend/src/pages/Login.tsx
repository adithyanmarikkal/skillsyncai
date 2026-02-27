import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        setLoading(true);
        try {
            const res = await api.post("/login", { email, password });
            localStorage.setItem("token", res.data.access_token);
            navigate("/");
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                // Show the real error message from the server (e.g. "Invalid credentials")
                alert(`Login failed: ${err.response.data.detail || "Unknown error"}`);
            } else {
                alert("Login failed: Could not reach the server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in…" : "Login"}
            </button>
        </div>
    );
};

export default Login;