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
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function getThemePreference(): "light" | "dark" | null {
    return localStorage.getItem("magnifit_theme") as "light" | "dark" | null;
}

function setThemePreference(mode: "light" | "dark") {
    localStorage.setItem("magnifit_theme", mode);
}


export default function AddToDB() {
    const [darkMode, setDarkMode] = useState(false);
    const [focused, setFocused] = useState(false);
    const [query, setQuery] = useState("");
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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


    const handleSearch = async () => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        // Validate URL
        try {
            new URL(trimmedQuery);
        } catch {
            setFeedback("Please enter a valid URL.");
            return;
        }

        setLoading(true);
        setFeedback(null);

        try {
            const response = await fetch(import.meta.env.VITE_ADD_URL_SERVER, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: trimmedQuery }),
            });

            if (!response.ok) throw new Error("Network response was not ok");

            await response.json();
            setFeedback("URL added successfully!");
            setQuery("");
        } catch {
            setFeedback("Failed to add URL.");
        } finally {
            setLoading(false);
        }
    };


    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            await handleSearch();
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
                        alt="Magnifit Logo"
                        sx={{
                            width: 400,
                            height: "auto",
                            transition: "filter 0.3s ease",
                        }}
                    />

                    {/* Input with glow */}
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
                                placeholder="Add a URL"
                                fullWidth
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                onKeyDown={handleKeyDown}
                                InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                        position: "relative",
                                        zIndex: 2,
                                        backgroundColor: "transparent",
                                    },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleSearch} disabled={loading} aria-label="Add URL">
                                                <ArrowForwardIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Paper>
                    </Box>

                    {/* Feedback message */}
                    {feedback && (
                        <Box
                            sx={{
                                mt: 1,
                                color: feedback.includes("success") ? "success.main" : "error.main",
                                fontWeight: 600,
                                textAlign: "center",
                            }}
                            role="alert"
                        >
                            {feedback}
                        </Box>
                    )}
                </Container>

                {/* Footer Links */}
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

            {/* Animation Keyframes */}
            <style>
                {`
                @keyframes waveflow {
                    0% { transform: scale(1) translateY(0); opacity: 0.7; }
                    50% { transform: scale(1.1) translateY(-10px); opacity: 1; }
                    100% { transform: scale(1) translateY(0); opacity: 0.7; }
                }
            `}
            </style>
        </ThemeProvider>
    );
}
