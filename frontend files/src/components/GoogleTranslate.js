import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      // Check if script already exists
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.type = "text/javascript";
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }

      // Initialize if google is already defined
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
    };

    // Global init function for the callback
    window.googleTranslateElementInit = () => {
        if (!window.google || !window.google.translate) return;
        
        // Clear previous initialization if any to prevent duplicates
        const element = document.getElementById("google_translate_element");
        if (element) {
            element.innerHTML = "";
            new window.google.translate.TranslateElement(
                {
                  pageLanguage: "en",
                  includedLanguages: "hi,en,mr,gu,ta,te,bn,ml,kn,pa",
                  layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false,
                },
                "google_translate_element"
            );
        }
    };

    addGoogleTranslateScript();
  }, []);

  return <div id="google_translate_element" style={{ minWidth: "160px" }}></div>;
};

export default GoogleTranslate;
