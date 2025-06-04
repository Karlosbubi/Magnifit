import {
  Box_default,
  Brightness4_default,
  Brightness7_default,
  Container_default,
  CssBaseline_default,
  IconButton_default,
  InputAdornment_default,
  Paper_default,
  Search_default,
  TextField_default,
  ThemeProvider,
  createTheme
} from "/build/_shared/chunk-3YQTELJ3.js";
import "/build/_shared/chunk-B43JI2TA.js";
import {
  useNavigate
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

// app/routes/_index.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\_index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\_index.tsx"
  );
  import.meta.hot.lastModified = "1749032083562.2173";
}
function Index() {
  _s();
  const [darkMode, setDarkMode] = (0, import_react.useState)(false);
  const [focused, setFocused] = (0, import_react.useState)(false);
  const [query, setQuery] = (0, import_react.useState)("");
  const navigate = useNavigate();
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1a73e8"
      }
    }
  });
  const handleToggleTheme = () => setDarkMode(!darkMode);
  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter")
      handleSearch();
  };
  const logoSrc = darkMode ? "/images/Magnifit_Darkmode.png" : "/images/Magnifit_Lightmode.png";
  const glowColor = darkMode ? "#5fdde0" : "#005f6b";
  const borderColor = darkMode ? "#a2f5f7" : "#238a97";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ThemeProvider, { theme, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CssBaseline_default, {}, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 56,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box_default, { sx: {
      transition: "background-color 0.3s ease, color 0.3s ease",
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      minHeight: "100vh",
      position: "relative"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box_default, { sx: {
        position: "absolute",
        top: 16,
        right: 16
      }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(IconButton_default, { onClick: handleToggleTheme, color: "inherit", children: darkMode ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Brightness7_default, {}, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 71,
        columnNumber: 25
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Brightness4_default, {}, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 71,
        columnNumber: 47
      }, this) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 70,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 65,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Container_default, { maxWidth: "sm", sx: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4
      }, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box_default, { component: "img", src: logoSrc, alt: "Magnifit Logo", sx: {
          width: 400,
          height: "auto",
          transition: "filter 0.3s ease"
        } }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 85,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box_default, { sx: {
          position: "relative",
          width: "100%"
        }, children: [
          focused && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box_default, { sx: {
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
            pointerEvents: "none"
          } }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 96,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Paper_default, { elevation: focused ? 6 : 3, sx: {
            position: "relative",
            zIndex: 1,
            width: "100%",
            px: 2,
            py: 0.5,
            display: "flex",
            alignItems: "center",
            borderRadius: "999px",
            border: focused ? `2px solid ${borderColor}` : "2px solid transparent",
            transition: "all 0.4s ease"
          }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextField_default, { variant: "standard", placeholder: "Search...", fullWidth: true, value: query, onChange: (e) => setQuery(e.target.value), onFocus: () => setFocused(true), onBlur: () => setFocused(false), onKeyDown: handleKeyDown, InputProps: {
            disableUnderline: true,
            sx: {
              position: "relative",
              zIndex: 2,
              backgroundColor: "transparent"
            },
            endAdornment: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(InputAdornment_default, { position: "end", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(IconButton_default, { onClick: handleSearch, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search_default, {}, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 131,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 130,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 129,
              columnNumber: 29
            }, this)
          } }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 122,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 110,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 92,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 76,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box_default, { sx: {
        position: "absolute",
        bottom: 24,
        width: "100%",
        display: "flex",
        justifyContent: "center"
      }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Box_default, { component: "a", href: "/imprint", sx: {
        textDecoration: "none",
        color: theme.palette.text.secondary,
        fontSize: "0.9rem",
        fontWeight: 500,
        transition: "color 0.3s ease",
        "&:hover": {
          color: darkMode ? "#5fdde0" : "#005f6b"
        }
      }, children: "Imprint" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 147,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 140,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 57,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("style", { children: `
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
        ` }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 163,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 55,
    columnNumber: 10
  }, this);
}
_s(Index, "Q8nOlnlQ96fxdg4OU74rbsQGHWA=", false, function() {
  return [useNavigate];
});
_c = Index;
var _c;
$RefreshReg$(_c, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default
};
//# sourceMappingURL=/build/routes/_index-QZQBVFCN.js.map
