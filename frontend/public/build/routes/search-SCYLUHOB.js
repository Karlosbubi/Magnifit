import {
  Box_default,
  Brightness4_default,
  Brightness7_default,
  Container_default,
  CssBaseline_default,
  IconButton_default,
  InputAdornment_default,
  Link_default,
  Paper_default,
  Search_default,
  TextField_default,
  ThemeProvider,
  Typography_default,
  createTheme
} from "/build/_shared/chunk-3YQTELJ3.js";
import "/build/_shared/chunk-B43JI2TA.js";
import {
  useNavigate,
  useSearchParams
} from "/build/_shared/chunk-BD2BBOZ5.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  createHotContext
} from "/build/_shared/chunk-MFAHHSY2.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/search.tsx
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\search.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\search.tsx"
  );
  import.meta.hot.lastModified = "1749032169527.9277";
}
var mockData = [{
  id: 1,
  title: "Healthy Living Tips",
  description: "Stay fit with easy daily routines.",
  url: "https://example.com/healthy-living"
}, {
  id: 2,
  title: "Magnifit Workout Plans",
  description: "Custom workout plans for every level.",
  url: "https://magnifit.com/workout-plans"
}, {
  id: 3,
  title: "Nutrition Guide",
  description: "Learn how to eat well for energy and health.",
  url: "https://example.com/nutrition-guide"
}, {
  id: 4,
  title: "Mental Fitness",
  description: "Improve your mindset with daily exercises.",
  url: "https://example.com/mental-fitness"
}, {
  id: 5,
  title: "Yoga for Beginners",
  description: "Gentle yoga to get you started.",
  url: "https://example.com/yoga-beginners"
}];
function SearchPage() {
  _s();
  const [darkMode, setDarkMode] = (0, import_react2.useState)(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = (0, import_react2.useState)(initialQuery);
  const [results, setResults] = (0, import_react2.useState)([]);
  (0, import_react2.useEffect)(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      const filtered = mockData.filter((item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
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
  const handleKeyDown = (e) => {
    if (e.key === "Enter")
      handleSearch();
  };
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light"
    }
  });
  const logoSrc = darkMode ? "/images/Magnifit_Darkmode.png" : "/images/Magnifit_Lightmode.png";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ThemeProvider, { theme, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CssBaseline_default, {}, void 0, false, {
      fileName: "app/routes/search.tsx",
      lineNumber: 91,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box_default, { sx: {
      px: 2,
      py: 1,
      display: "flex",
      alignItems: "center",
      borderBottom: 1,
      borderColor: "divider",
      backgroundColor: theme.palette.background.paper,
      position: "sticky",
      top: 0,
      zIndex: 1e3
    }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box_default, { component: "img", src: logoSrc, alt: "Magnifit Logo", sx: {
        width: 150,
        height: "auto",
        mr: 2,
        cursor: "pointer"
      }, onClick: () => navigate("/") }, void 0, false, {
        fileName: "app/routes/search.tsx",
        lineNumber: 106,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Paper_default, { component: "form", onSubmit: (e) => {
        e.preventDefault();
        handleSearch();
      }, sx: {
        flexGrow: 1,
        maxWidth: 400,
        // narrower width
        display: "flex",
        alignItems: "center",
        borderRadius: "999px",
        px: 2,
        py: 0.3,
        boxShadow: 3
      }, elevation: 3, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextField_default, { variant: "standard", placeholder: "Search...", value: query, onChange: (e) => setQuery(e.target.value), onKeyDown: handleKeyDown, fullWidth: true, InputProps: {
        disableUnderline: true,
        sx: {
          fontSize: "1rem",
          px: 1,
          color: theme.palette.text.primary
        },
        endAdornment: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(InputAdornment_default, { position: "end", sx: {
          mr: 0
        }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(IconButton_default, { onClick: handleSearch, "aria-label": "search", edge: "end", size: "large", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search_default, {}, void 0, false, {
          fileName: "app/routes/search.tsx",
          lineNumber: 140,
          columnNumber: 41
        }, this) }, void 0, false, {
          fileName: "app/routes/search.tsx",
          lineNumber: 139,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "app/routes/search.tsx",
          lineNumber: 136,
          columnNumber: 25
        }, this)
      } }, void 0, false, {
        fileName: "app/routes/search.tsx",
        lineNumber: 129,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/routes/search.tsx",
        lineNumber: 115,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box_default, { sx: {
        ml: 2
      }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(IconButton_default, { onClick: () => setDarkMode(!darkMode), color: "inherit", "aria-label": "Toggle dark/light mode", children: darkMode ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Brightness7_default, {}, void 0, false, {
        fileName: "app/routes/search.tsx",
        lineNumber: 151,
        columnNumber: 37
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Brightness4_default, {}, void 0, false, {
        fileName: "app/routes/search.tsx",
        lineNumber: 151,
        columnNumber: 59
      }, this) }, void 0, false, {
        fileName: "app/routes/search.tsx",
        lineNumber: 150,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/routes/search.tsx",
        lineNumber: 147,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/search.tsx",
      lineNumber: 93,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container_default, { sx: {
      pt: 4,
      pb: 12,
      maxWidth: "md"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Typography_default, { variant: "h5", gutterBottom: true, children: [
        'Search Results for "',
        query,
        '"'
      ] }, void 0, true, {
        fileName: "app/routes/search.tsx",
        lineNumber: 162,
        columnNumber: 17
      }, this),
      query.trim() === "" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Typography_default, { variant: "body1", children: "Please enter a search query." }, void 0, false, {
        fileName: "app/routes/search.tsx",
        lineNumber: 166,
        columnNumber: 40
      }, this) : results.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Typography_default, { variant: "body1", children: "No results found." }, void 0, false, {
        fileName: "app/routes/search.tsx",
        lineNumber: 166,
        columnNumber: 135
      }, this) : results.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box_default, { sx: {
        mb: 3
      }, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link_default, { href: item.url, target: "_blank", rel: "noopener noreferrer", underline: "hover", sx: {
          fontSize: "1.25rem",
          fontWeight: 600,
          color: theme.palette.primary.main
        }, children: item.title }, void 0, false, {
          fileName: "app/routes/search.tsx",
          lineNumber: 169,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Typography_default, { sx: {
          color: "text.secondary",
          fontSize: "0.9rem",
          userSelect: "text"
        }, children: item.url }, void 0, false, {
          fileName: "app/routes/search.tsx",
          lineNumber: 176,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Typography_default, { sx: {
          mt: 0.5
        }, children: item.description }, void 0, false, {
          fileName: "app/routes/search.tsx",
          lineNumber: 183,
          columnNumber: 29
        }, this)
      ] }, item.id, true, {
        fileName: "app/routes/search.tsx",
        lineNumber: 166,
        columnNumber: 216
      }, this))
    ] }, void 0, true, {
      fileName: "app/routes/search.tsx",
      lineNumber: 157,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/search.tsx",
    lineNumber: 90,
    columnNumber: 10
  }, this);
}
_s(SearchPage, "sxATVXa5mZkb3ZEWJ6UcYmqRi0s=", false, function() {
  return [useSearchParams, useNavigate];
});
_c = SearchPage;
var _c;
$RefreshReg$(_c, "SearchPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  SearchPage as default
};
//# sourceMappingURL=/build/routes/search-SCYLUHOB.js.map
