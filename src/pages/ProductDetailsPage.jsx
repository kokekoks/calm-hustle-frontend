import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Rating,
  Typography,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon,
  FlashOn as FlashOnIcon,
} from "@mui/icons-material";
import api from "../api/axios";

const FALLBACK_IMAGE = "https://placehold.co/600x600?text=No+Image";
const availableSizes = ["S", "M", "L", "XL", "2XL"];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(
    Number(price)
  );

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/products/${id}`);
        const data = response.data?.data ?? response.data;
        if (active) setProduct(data);
      } catch (err) {
        if (active) {
          setProduct(null);
          setError(
            err.response?.status === 404
              ? "Product not found."
              : "Unable to load this product. Check the API connection."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: "center" }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error || "Product not found."}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  const inStock = Number(product.stock) > 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 3, textTransform: "none" }}
      >
        Back
      </Button>

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 2,
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: "300px", md: "100%" },
              minHeight: { md: "450px" },
              backgroundColor: "#e2e8f0",
            }}
          >
            <Box
              component="img"
              src={product.image || FALLBACK_IMAGE}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>

          <Box
            sx={{
              p: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <Box sx={{ mb: 1 }}>
              {product.category?.category_name && (
                <Chip
                  label={product.category.category_name}
                  size="small"
                  sx={{
                    backgroundColor: "action.hover",
                    color: "text.secondary",
                    fontWeight: 600,
                    borderRadius: "6px",
                  }}
                />
              )}
            </Box>

            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              {product.name}
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              {formatPrice(product.price)}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Rating value={5} precision={0.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                (5 reviews)
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Chip
                label={inStock ? "In stock" : "Out of stock"}
                size="small"
                color={inStock ? "success" : "error"}
                sx={{ fontWeight: "bold", borderRadius: "12px" }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Available Stock: <strong>{product.stock ?? 0} pcs</strong>
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Select Size:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {availableSizes.map((size) => {
                  const selected = selectedSize === size;
                  return (
                    <Button
                      key={size}
                      variant={selected ? "contained" : "outlined"}
                      onClick={() => setSelectedSize(size)}
                      sx={{
                        minWidth: "45px",
                        height: "40px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        borderColor: "divider",
                        backgroundColor: selected ? "primary.main" : "transparent",
                        color: selected ? "primary.contrastText" : "text.primary",
                        "&:hover": {
                          backgroundColor: selected ? "primary.dark" : "action.hover",
                        },
                      }}
                    >
                      {size}
                    </Button>
                  );
                })}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ flexGrow: 1, mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                About this item
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {product.description || "No description available for this product."}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                startIcon={<ShoppingCartIcon />}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  fontWeight: "bold",
                }}
              >
                ADD TO CART
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<FlashOnIcon />}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  fontWeight: "bold",
                }}
              >
                BUY NOW
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}