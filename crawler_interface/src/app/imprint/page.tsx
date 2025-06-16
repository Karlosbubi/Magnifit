"use client";

import { Container, Typography, Box, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useState, useEffect } from "react";

function getThemePreference(): "light" | "dark" | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("magnifit_theme") as "light" | "dark" | null;
}

export default function ImprintPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = getThemePreference();
    if (savedTheme === "dark") {
      setDarkMode(true);
    } else if (savedTheme === "light") {  
      setDarkMode(false);
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Imprint
        </Typography>
        
        <Typography variant="body1" paragraph>
          This is a search engine application built with the T3 stack.
        </Typography>
        
        <Typography variant="body1" paragraph>
          For more information about this project, please contact the development team.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Technical Information
          </Typography>
          <Typography variant="body1" paragraph>
            • Built with Next.js, tRPC, and TypeScript
          </Typography>
          <Typography variant="body1" paragraph>
            • Search powered by PostgreSQL and tiktoken tokenization
          </Typography>
          <Typography variant="body1" paragraph>
            • Web crawler built with .NET
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography 
            component="a" 
            href="/" 
            sx={{ 
              color: theme.palette.primary.main,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" }
            }}
          >
            ← Back to Search
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
