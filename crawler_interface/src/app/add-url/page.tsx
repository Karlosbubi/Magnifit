"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  IconButton,
  InputAdornment,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Box,
  Paper,
  Typography,
  Alert,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { api } from "~/trpc/react";

function getThemePreference(): "light" | "dark" | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("magnifit_theme") as "light" | "dark" | null;
}

function setThemePreference(mode: "light" | "dark") {
  if (typeof window === "undefined") return;
  localStorage.setItem("magnifit_theme", mode);
}

export default function AddToDB() {
  const [darkMode, setDarkMode] = useState(false);
  const [focused, setFocused] = useState(false);
  const [url, setUrl] = useState("");
  const [feedback, setFeedback] = useState<{ 
    type: "success" | "error" | "info"; 
    message: string;
    details?: string;
  } | null>(null);

  const addToIndexMutation = api.search.addToIndex.useMutation({
    onSuccess: (data) => {
      if (data.alreadyExists) {
        setFeedback({ 
          type: "info", 
          message: "URL Already Exists",
          details: data.message
        });
      } else {
        setFeedback({ 
          type: "success", 
          message: "URL Added Successfully!",
          details: data.message
        });
      }
      setUrl("");
    },
    onError: (error) => {
      setFeedback({ 
        type: "error", 
        message: "Failed to Add URL",
        details: error.message || "An unexpected error occurred."
      });
    },
  });

  useEffect(() => {
    const savedMode = getThemePreference();
    if (savedMode === "dark") {
      setDarkMode(true);
    } else if (savedMode === "light") {
      setDarkMode(false);
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1a73e8",
      },
    },
  });

  const handleToggleTheme = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      setThemePreference(newMode ? "dark" : "light");
      return newMode;
    });
  };

  const handleAddUrl = async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    setFeedback(null);
    addToIndexMutation.mutate(trimmedUrl);
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleAddUrl();
    }
  };

  const logoSrc = darkMode
    ? "/images/Magnifit_Darkmode_Add.png"
    : "/images/Magnifit_Lightmode_Add.png";

  const glowColor = darkMode ? "#5fdde0" : "#005f6b";
  const borderColor = darkMode ? "#a2f5f7" : "#238a97";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          transition: "background-color 0.3s ease, color 0.3s ease",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* Theme Toggle */}
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <IconButton
            onClick={handleToggleTheme}
            color="inherit"
            aria-label="Toggle dark/light mode"
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>

        {/* Main Content */}
        <Container
          maxWidth="sm"
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src={logoSrc}
            alt="Magnifit Add URL Logo"
            sx={{
              width: 400,
              height: "auto",
              transition: "filter 0.3s ease",
            }}
          />

          {/* Add URL Form */}
          <Box sx={{ position: "relative", width: "100%" }}>
            {focused && (
              <Box
                sx={{
                  position: "absolute",
                  top: "-30%",
                  left: "-10%",
                  width: "120%",
                  height: "160%",
                  zIndex: 0,
                  filter: "blur(40px)",
                  background: `radial-gradient(circle at 50% 50%, ${glowColor}aa, transparent 70%)`,
                  animation: "waveflow 6s ease-in-out infinite",
                  borderRadius: "999px",
                  pointerEvents: "none",
                }}
              />
            )}

            <Paper
              elevation={focused ? 6 : 3}
              sx={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                px: 2,
                py: 0.5,
                display: "flex",
                alignItems: "center",
                borderRadius: "999px",
                border: focused ? `2px solid ${borderColor}` : "2px solid transparent",
                transition: "all 0.4s ease",
              }}
            >
              <TextField
                variant="standard"
                placeholder="Enter URL to add (https://example.com)..."
                fullWidth
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                disabled={addToIndexMutation.isPending}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    position: "relative",
                    zIndex: 2,
                    backgroundColor: "transparent",
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleAddUrl}
                        disabled={addToIndexMutation.isPending}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>
          </Box>

          {/* Feedback Messages */}
          {feedback && (
            <Alert 
              severity={feedback.type} 
              sx={{ 
                width: "100%", 
                borderRadius: 2,
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
              onClose={() => setFeedback(null)}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: feedback.details ? 0.5 : 0 }}>
                {feedback.message}
              </Typography>
              {feedback.details && (
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {feedback.details}
                </Typography>
              )}
            </Alert>
          )}

          {/* Instructions */}
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: "center", 
              color: theme.palette.text.secondary,
              maxWidth: "80%"
            }}
          >
            Enter a URL to add it to the crawl queue. The crawler will index this page and any linked pages.
          </Typography>
        </Container>

        {/* Footer */}
        <Box
          sx={{
            position: "absolute",
            bottom: 24,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            component="a"
            href="/"
            sx={{
              textDecoration: "none",
              color: theme.palette.text.secondary,
              fontSize: "0.9rem",
              fontWeight: 500,
              transition: "color 0.3s ease",
              "&:hover": {
                color: darkMode ? "#5fdde0" : "#005f6b",
              },
            }}
          >
            Search
          </Box>

          <Box
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.9rem",
              userSelect: "none",
              mx: 1,
            }}
          >
            |
          </Box>

          <Box
            component="a"
            href="/imprint"
            sx={{
              textDecoration: "none",
              color: theme.palette.text.secondary,
              fontSize: "0.9rem",
              fontWeight: 500,
              transition: "color 0.3s ease",
              "&:hover": {
                color: darkMode ? "#5fdde0" : "#005f6b",
              },
            }}
          >
            Imprint
          </Box>
        </Box>
      </Box>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes waveflow {
          0% {
            transform: scale(1) translateY(0);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1) translateY(-10px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 0.7;
          }
        }
      `}</style>
    </ThemeProvider>
  );
}
