import { createTheme, colors, ThemeProvider } from "@mui/material";
import "../styles/globals.css";

const theme = createTheme({
  spacing: 1,
  palette: {
    primary: {
      light: "#EBAFEB",
      main: "#5E7BFD",
      dark: "#3A53A2",
      contrastText: "#fff",
    },
    secondary: {
      light: "#EBD4F7",
      main: "#FFC5F6",
      dark: "#FF9FB1",
      contrastText: "#000",
    },
  },
  typography: {
    htmlFontSize: 10,
    fontFamily: "Ubuntu",
    fontSize: 10,
    h1: {
      fontSize: 22,
      fontWeight: 700,
      color: "#3A53A2",
      marginBottom: 20,
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
