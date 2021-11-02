import { createTheme } from '@mui/material/styles';

// Our Theme
export const muiNinjaTheme = createTheme({
  typography: {
    h2: {
      fontSize: 36,
      marginBottom: 15,
    },
  },
  palette: {
    primary: {
      main: '#ac0021',
    },
    secondary: {
      main: '#66a0ff',
    },
  },
});
