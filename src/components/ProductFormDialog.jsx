import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import api from "../api/axios";

const emptyForm = {
  name: "",
  price: "",
  stock: "",
  category_id: "",
  image: "",
  description: "",
};

const getInitialForm = (product) =>
  product
    ? {
        name: product.name ?? "",
        price: String(product.price ?? ""),
        stock: String(product.stock ?? ""),
        category_id: String(product.category_id ?? ""),
        image: product.image ?? "",
        description: product.description ?? "",
      }
    : emptyForm;

function ProductForm({ product, onClose, onSave }) {
  const [form, setForm] = useState(() => getInitialForm(product));
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let active = true;
    api
      .get("/categories")
      .then((response) => {
        const data = response.data?.data ?? response.data;
        if (active) setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setCategories([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.name.trim()) nextErrors.name = "Product name is required.";
    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      nextErrors.price = "Enter a valid price of zero or more.";
    }
    if (form.stock === "" || !Number.isInteger(stock) || stock < 0) {
      nextErrors.stock = "Enter a whole number of zero or more.";
    }
    if (!form.category_id) nextErrors.category_id = "Select a category.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    setSubmitError("");
    const errorMessage = await onSave({
      category_id: Number(form.category_id),
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      stock,
      image: form.image.trim() || null,
    });
    if (errorMessage) {
      setSubmitError(errorMessage);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        {submitError && <Alert severity="error">{submitError}</Alert>}
        <TextField
          label="Product Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
          fullWidth
          required
          autoFocus
        />
        <TextField
          label="Price (PHP)"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          error={Boolean(errors.price)}
          helperText={errors.price}
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
          fullWidth
          required
        />
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          error={Boolean(errors.stock)}
          helperText={errors.stock}
          slotProps={{ htmlInput: { min: 0, step: 1 } }}
          fullWidth
          required
        />
        <TextField
          select
          label="Category"
          name="category_id"
          value={categories.length ? form.category_id : ""}
          onChange={handleChange}
          error={Boolean(errors.category_id)}
          helperText={errors.category_id}
          fullWidth
          required
        >
          {categories.map((category) => (
            <MenuItem key={category.category_id} value={String(category.category_id)}>
              {category.category_name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Image URL"
          name="image"
          value={form.image}
          onChange={handleChange}
          helperText="Optional. A placeholder is used if empty."
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          minRows={3}
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? "Saving..." : product ? "Save Changes" : "Add Product"}
        </Button>
      </DialogActions>
    </form>
  );
}

export default function ProductFormDialog({ open, product, onClose, onSave }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <ProductForm product={product} onClose={onClose} onSave={onSave} />
    </Dialog>
  );
}