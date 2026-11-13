import { AppBar, Box, Button, Chip, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar position="sticky" elevation={1} color="primary">
      <Toolbar sx={{ width: "min(1200px, 100%)", mx: "auto", gap: 1 }}>
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          sx={{
            color: "inherit",
            textDecoration: "none",
            fontWeight: 800,
            flexGrow: 1,
          }}
        >
          Calm Hustle Co.
        </Typography>

        {isAuthenticated ? (
          <>
            <Button component={RouterLink} to="/" color="inherit">
              Products
            </Button>
            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
              <Typography variant="body2">{user.name}</Typography>
              <Chip label={user.role} size="small" color="secondary" />
            </Box>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button component={RouterLink} to="/login" color="inherit">
              Login
            </Button>
            <Button component={RouterLink} to="/register" variant="contained" color="secondary">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}