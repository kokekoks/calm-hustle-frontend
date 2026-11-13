import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";

export default function DeleteProductDialog({ product, onClose, onConfirm }) {
  return (
    <Dialog open={Boolean(product)} onClose={onClose}>
      <DialogTitle>Delete product?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete "{product?.name}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}