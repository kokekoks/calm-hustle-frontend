import { useState } from "react";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Link, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/useAuth";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.first_name.trim()) next.first_name = "First name is required.";
    if (!form.last_name.trim()) next.last_name = "Last name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    if (form.password.length < 8) next.password = "Password must be at least 8 characters.";
    if (form.password !== form.password_confirmation) {
      next.password_confirmation = "Passwords do not match.";
    }
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      await register({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      if (err.response?.status === 422 && err.response.data?.errors) {
        const serverErrors = {};
        Object.entries(err.response.data.errors).forEach(([field, messages]) => {
          serverErrors[field] = messages[0];
        });
        setErrors(serverErrors);
      } else {
        setError("Unable to register. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 480 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Create an account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "grid", gap: 2 }}>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            <TextField
              label="First name"
              value={form.first_name}
              onChange={handleChange("first_name")}
              error={Boolean(errors.first_name)}
              helperText={errors.first_name}
              autoFocus
            />
            <TextField
              label="Last name"
              value={form.last_name}
              onChange={handleChange("last_name")}
              error={Boolean(errors.last_name)}
              helperText={errors.last_name}
            />
          </Box>
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          <TextField
            label="Confirm password"
            type="password"
            value={form.password_confirmation}
            onChange={handleChange("password_confirmation")}
            error={Boolean(errors.password_confirmation)}
            helperText={errors.password_confirmation}
          />
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Creating account..." : "Register"}
          </Button>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}