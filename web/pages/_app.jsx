import "fontsource-roboto";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import DTheme from "../theme.json";
import { CssBaseline } from "@material-ui/core";
const theme = createMuiTheme(DTheme);

const App = (ctx) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ctx.Component {...ctx.pageProps} />
  </ThemeProvider>
);

export default App;
