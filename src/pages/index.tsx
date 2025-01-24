import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import Form from "./form";
import Navbar from "./navbar";
import "@fontsource/prompt";

const theme = createTheme({
  typography: {
    fontFamily: ["Prompt"].join(","),
    h1: {
      fontSize: "4rem",
      fontWeight: 700,
    },
  },
});

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Form />
    </ThemeProvider>
  );
}
