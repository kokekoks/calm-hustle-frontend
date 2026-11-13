import {
  Box, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Typography,
} from "@mui/material";
import { Visibility, Edit, Delete, FavoriteBorder } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const FALLBACK_IMAGE = "https://placehold.co/600x400?text=Product";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(price));

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 2,
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", width: "100%", height: 180, overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={product.image || FALLBACK_IMAGE}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          sx={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
        <Chip
          label={product.category?.category_name || "Uncategorized"}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
        <IconButton
          size="small"
          aria-label="Add to favorites"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "&:hover": { backgroundColor: "#fff" },
          }}
        >
          <FavoriteBorder fontSize="small" />
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="h6" noWrap fontWeight="bold">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Stock: {product.stock ?? 0}
        </Typography>
        <Typography variant="subtitle1" color="primary" fontWeight="bold">
          {formatPrice(product.price)}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2, pt: 0 }}>
        <IconButton
          component={RouterLink}
          to={`/products/${product.product_id}`}
          color="primary"
          title="View Details"
          aria-label="View details"
        >
          <Visibility fontSize="small" />
        </IconButton>
        <Box>
          <IconButton
            color="secondary"
            onClick={() => onEdit(product)}
            title="Edit Product"
            aria-label="Edit product"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => onDelete(product)}
            title="Delete Product"
            aria-label="Delete product"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}