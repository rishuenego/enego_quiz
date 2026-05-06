import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import translations from "./translations";

const LanguageContext = createContext({ lang: "en", setLang: () => {}, t: (k) => k });

const STORAGE_KEY = "quiz.lang";

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, [lang]);

  const value = useMemo(() => {
    const dict = translations[lang] || translations.en;
    const t = (key, vars) => {
      let s = dict[key] != null ? dict[key] : (translations.en[key] != null ? translations.en[key] : key);
      if (vars && typeof s === "string") {
        Object.keys(vars).forEach((k) => {
          s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(vars[k]));
        });
      }
      return s;
    };
    return { lang, setLang: setLangState, t };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useT() {
  return useContext(LanguageContext);
}

export function LanguageSelect({ style }) {
  const { lang, setLang, t } = useT();
  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      style={{
        padding: "4px 8px",
        borderRadius: 4,
        border: "1px solid #ddd",
        background: "#fff",
        ...style,
      }}
      aria-label={t("lang.label")}
    >
      <option value="en">{t("lang.english")}</option>
      <option value="hi">{t("lang.hindi")}</option>
      <option value="hinglish">{t("lang.hinglish")}</option>
    </select>
  );
}
