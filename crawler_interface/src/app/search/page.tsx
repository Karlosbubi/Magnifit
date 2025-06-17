"use client";

import {
  Box,
  Container,
  Typography,
  CssBaseline,
  createTheme,
  ThemeProvider,
  IconButton,
  Link,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { api } from "~/trpc/react";

const getThemePreference = (): "light" | "dark" | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("magnifit_theme") as "light" | "dark" | null;
};

const setThemePreference = (mode: "light" | "dark") => {
  if (typeof window === "undefined") return;
  localStorage.setItem("magnifit_theme", mode);
};

interface SearchResult {
  id: string;
  title: string;
  url: string;
  description: string;
}

function SearchContent() {
  const [darkMode, setDarkMode] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams?.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  // Use tRPC to search
  const { data: results = [], isLoading, error } = api.search.search.useQuery(
    searchTerm,
    {
      enabled: !!searchTerm.trim(),
    }
  );

  useEffect(() => {
    const savedTheme = getThemePreference();
    if (savedTheme === "dark") {
      setDarkMode(true);
    } else if (savedTheme === "light") {
      setDarkMode(false);
    }
  }, []);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) {
      setSearchTerm(trimmed);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const logoSrc = darkMode
    ? "/images/Magnifit_Darkmode.png"
    : "/images/Magnifit_Lightmode.png";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: theme.palette.background.paper,
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Box
          component="img"
          src={logoSrc}
          alt="Magnifit Logo"
          sx={{ width: 150, height: "auto", mr: 2, cursor: "pointer" }}
          onClick={() => router.push("/")}
        />

        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          sx={{
            flexGrow: 1,
            maxWidth: 400,
            display: "flex",
            alignItems: "center",
            borderRadius: "999px",
            px: 2,
            py: 0.3,
            boxShadow: 3,
          }}
          elevation={3}
        >
          <TextField
            variant="standard"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: "1rem",
                px: 1,
                color: theme.palette.text.primary,
              },
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 0 }}>
                  <IconButton
                    onClick={handleSearch}
                    aria-label="search"
                    edge="end"
                    size="large"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <Box sx={{ ml: 2 }}>
          <IconButton
            onClick={() => {
              const newMode = !darkMode;
              setDarkMode(newMode);
              setThemePreference(newMode ? "dark" : "light");
            }}
            color="inherit"
            aria-label="Toggle dark/light mode"
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Box>

      <Container sx={{ pt: 4, pb: 12, maxWidth: "md" }}>
        <Typography variant="h5" gutterBottom>
          Search Results for "{searchTerm}"
        </Typography>

        {searchTerm.trim() === "" ? (
          <Typography variant="body1">Please enter a search query.</Typography>
        ) : isLoading ? (
          <Typography variant="body1">Searching...</Typography>
        ) : error ? (
          <Typography variant="body1" color="error">
            Error: {error.message}
          </Typography>
        ) : results.length === 0 ? (
          <Typography variant="body1">No results found.</Typography>
        ) : (
          results.map((item) => (
            <Box key={item.id} sx={{ mb: 3 }}>
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                }}
              >
                {item.title}
              </Link>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.9rem",
                  userSelect: "text",
                }}
              >
                {item.url}
              </Typography>
              <Typography sx={{ mt: 0.5 }}>{item.description}</Typography>
            </Box>
          ))
        )}
      </Container>
    </ThemeProvider>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
