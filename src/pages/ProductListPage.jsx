import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import api from "../api/axios";
import {
  createProduct as createProductRequest,
  deleteProduct as deleteProductRequest,
  getProducts,
  updateProduct as updateProductRequest,
} from "../api/productApi";
import { useAuth } from "../context/useAuth";
import ProductCard from "../components/ProductCard";
import ProductFormDialog from "../components/ProductFormDialog";
import DeleteProductDialog from "../components/DeleteProductDialog";

const unwrap = (body) => body?.data ?? body;

const getErrorMessage = (err, fallback) => {
  if (err.response?.status === 403) {
    return "Access denied. Only administrators can perform this action.";
  }
  const errors = err.response?.data?.errors;
  if (errors) return Object.values(errors).flat().join(" ");
  return err.response?.data?.message || fallback;
};

export default function ProductListPage() {
  const { user, isAdmin } = useAuth();

  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState({ message: "", severity: "success" });
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const [brandOpen, setBrandOpen] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [brandError, setBrandError] = useState("");
  const [brandSaving, setBrandSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const [productsBody, categoriesResponse] = await Promise.all([
          getProducts(),
          api.get("/categories"),
        ]);
        const productData = unwrap(productsBody);
        const categoryData = unwrap(categoriesResponse.data);
        if (active) {
          setProducts(Array.isArray(productData) ? productData : []);
          setCategoryList(Array.isArray(categoryData) ? categoryData : []);
          setError("");
        }
      } catch (err) {
        if (active && err.response?.status !== 401) {
          setError(
            err.response?.status === 403
              ? "Access denied."
              : "Unable to load products. Check the API connection and try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const loadProducts = () => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  };

  const showNotice = (message, severity = "success") =>
    setNotice({ message, severity });

  const createProduct = async (values) => {
    try {
      await createProductRequest(values);
      showNotice("Product created successfully.");
      loadProducts();
      return "";
    } catch (err) {
      return getErrorMessage(err, "Unable to create product. Check the fields and try again.");
    }
  };

  const updateProduct = async (id, values) => {
    try {
      await updateProductRequest(id, values);
      showNotice("Product updated successfully.");
      loadProducts();
      return "";
    } catch (err) {
      return getErrorMessage(err, "Unable to update product. Check the fields and try again.");
    }
  };

  const deleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProductRequest(deletingProduct.product_id);
      setProducts((current) =>
        current.filter((p) => p.product_id !== deletingProduct.product_id)
      );
      showNotice("Product deleted successfully.");
      setDeletingProduct(null);
    } catch (err) {
      showNotice(
        getErrorMessage(err, "Unable to delete product. Please try again."),
        "error"
      );
      setDeletingProduct(null);
    }
  };

  const handleSaveProduct = async (values) => {
    const errorMessage = editingProduct
      ? await updateProduct(editingProduct.product_id, values)
      : await createProduct(values);
    if (!errorMessage) {
      setFormOpen(false);
      setEditingProduct(null);
    }
    return errorMessage;
  };

  const closeBrandDialog = () => {
    setBrandOpen(false);
    setNewBrand("");
    setBrandError("");
  };

  const handleSaveBrand = async () => {
    const name = newBrand.trim();
    if (!name) {
      setBrandError("Brand name is required.");
      return;
    }
    setBrandSaving(true);
    setBrandError("");
    try {
      await api.post("/categories", { category_name: name });
      showNotice("Brand added successfully.");
      closeBrandDialog();
      loadProducts();
    } catch (err) {
      setBrandError(getErrorMessage(err, "Unable to add brand. Please try again."));
    } finally {
      setBrandSaving(false);
    }
  };

  const categories = [
    "All",
    ...categoryList.map((category) => category.category_name).filter(Boolean),
  ];

  const visibleProducts = products.filter((p) => {
    const matchesSearch = String(p.name ?? "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      String(p.category?.category_name ?? "").toLowerCase() ===
        selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Product Catalog
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Signed in as {user?.name} ({user?.role})
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button variant="outlined" onClick={loadProducts} disabled={loading}>
            Refresh
          </Button>
          {isAdmin && (
            <Button
              variant="contained"
              onClick={() => {
                setEditingProduct(null);
                setFormOpen(true);
              }}
            >
              + Add Product
            </Button>
          )}
        </Box>
      </Box>

      <TextField
        label="Search by product name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2, backgroundColor: "#fff", borderRadius: 1 }}
      />

      <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "contained" : "outlined"}
            onClick={() => setSelectedCategory(cat)}
            sx={{ borderRadius: "20px", textTransform: "none" }}
          >
            {cat}
          </Button>
        ))}
        {isAdmin && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setBrandOpen(true)}
            sx={{ borderRadius: "20px", textTransform: "none", borderStyle: "dashed" }}
          >
            + Add Brand
          </Button>
        )}
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 6 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadProducts}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}
      {!loading && !error && visibleProducts.length === 0 && (
        <Alert severity="info">
          No products found. Try a different search{isAdmin ? " or add a product" : ""}.
        </Alert>
      )}

      {!loading && !error && visibleProducts.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {visibleProducts.map((product) => (
            <Box key={product.product_id} sx={{ minWidth: 0 }}>
              <ProductCard
                product={product}
                canManage={isAdmin}
                onEdit={(p) => {
                  setEditingProduct(p);
                  setFormOpen(true);
                }}
                onDelete={setDeletingProduct}
              />
            </Box>
          ))}
        </Box>
      )}

      {isAdmin && (
        <>
          <ProductFormDialog
            open={formOpen}
            product={editingProduct}
            onClose={() => {
              setFormOpen(false);
              setEditingProduct(null);
            }}
            onSave={handleSaveProduct}
          />

          <DeleteProductDialog
            product={deletingProduct}
            onClose={() => setDeletingProduct(null)}
            onConfirm={deleteProduct}
          />

          <Dialog open={brandOpen} onClose={closeBrandDialog} fullWidth maxWidth="xs">
            <DialogTitle>Add New Brand</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              {brandError && <Alert severity="error">{brandError}</Alert>}
              <TextField
                autoFocus
                label="Brand Name (e.g. Uniqlo)"
                fullWidth
                value={newBrand}
                onChange={(e) => {
                  setNewBrand(e.target.value);
                  setBrandError("");
                }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={closeBrandDialog} color="inherit" disabled={brandSaving}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSaveBrand} disabled={brandSaving}>
                {brandSaving ? "Saving..." : "Add Brand"}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      <Snackbar
        open={Boolean(notice.message)}
        autoHideDuration={3000}
        onClose={() => setNotice((n) => ({ ...n, message: "" }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setNotice((n) => ({ ...n, message: "" }))}
          severity={notice.severity}
          variant="filled"
        >
          {notice.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}