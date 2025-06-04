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
import { useSearchParams, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const getThemePreference = (): "light" | "dark" | null => {
    return localStorage.getItem("magnifit_theme") as "light" | "dark" | null;
};

const setThemePreference = (mode: "light" | "dark") => {
    localStorage.setItem("magnifit_theme", mode);
};



const mockData = [
    {
        id: 1,
        title: "Healthy Living Tips",
        description: "Stay fit with easy daily routines.",
        url: "https://example.com/healthy-living",
    },
    {
        id: 2,
        title: "Magnifit Workout Plans",
        description: "Custom workout plans for every level.",
        url: "https://magnifit.com/workout-plans",
    },
    {
        id: 3,
        title: "Nutrition Guide",
        description: "Learn how to eat well for energy and health.",
        url: "https://example.com/nutrition-guide",
    },
    {
        id: 4,
        title: "Mental Fitness",
        description: "Improve your mindset with daily exercises.",
        url: "https://example.com/mental-fitness",
    },
    {
        id: 5,
        title: "Yoga for Beginners",
        description: "Gentle yoga to get you started.",
        url: "https://example.com/yoga-beginners",
    },
];

export default function SearchPage() {
    const [darkMode, setDarkMode] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<typeof mockData>([]);

    useEffect(() => {
        const savedTheme = getThemePreference();
        if (savedTheme === "dark") {
            setDarkMode(true);
        } else if (savedTheme === "light") {
            setDarkMode(false);
        }
    }, []);

    // Handle search filtering
    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (q) {
            const filtered = mockData.filter(
                (item) =>
                    item.title.toLowerCase().includes(q) ||
                    item.description.toLowerCase().includes(q)
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
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
            {/* Header */}
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
                {/* Logo */}
                <Box
                    component="img"
                    src={logoSrc}
                    alt="Magnifit Logo"
                    sx={{ width: 150, height: "auto", mr: 2, cursor: "pointer" }}
                    onClick={() => navigate("/")}
                />

                {/* Search Bar */}
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

                {/* Dark/Light Toggle */}
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

            {/* Results */ }
    <Container sx={{ pt: 4, pb: 12, maxWidth: "md" }}>
        <Typography variant="h5" gutterBottom>
            Search Results for "{query}"
        </Typography>

        {query.trim() === "" ? (
            <Typography variant="body1">Please enter a search query.</Typography>
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
        </ThemeProvider >
    );
}
