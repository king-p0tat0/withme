import { createTheme } from "@mui/material/styles";
//import { purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      light: "#D4A26A",
      main: "#804D15",
      dark: "#552C00",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000"
    }
  }
});

export default theme;
