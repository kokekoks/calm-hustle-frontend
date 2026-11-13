import { useState } from "react";
import { Link as RouterLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Link, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setSaving(true);
    try {
      await login(email.trim(), password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      if (err.response?.status === 401) setError("Invalid email or password.");
      else if (err.response?.status === 422) {
        const errors = err.response.data?.errors;
        setError(errors ? Object.values(errors).flat().join(" ") : "Please check your input.");
      } else setError("Unable to sign in. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 420 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Login
        </Typography>

        {location.state?.registered && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful. Please log in.
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "grid", gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Signing in..." : "Login"}
          </Button>
          <Typography variant="body2">
            No account yet?{" "}
            <Link component={RouterLink} to="/register">
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}