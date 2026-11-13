import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#111111" },        
    secondary: { main: "#F97316" },     
    background: { default: "#EEEEEE" }, 
    text: { primary: "#111111", secondary: "#555555" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
  },
});

export default theme;