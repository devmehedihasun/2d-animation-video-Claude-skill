import { staticFile, continueRender, delayRender } from "remotion";

// Load local Bengali + Latin font files via @font-face (no network).
// Bengali and Latin are split by unicode-range under the same family so
// mixed Bengali/English text (e.g. "EMI", "status", "Salary") renders cleanly.

const BENGALI_RANGE =
  "U+0964-0965, U+0980-09FF, U+200C-200D, U+20B9, U+25CC";
const LATIN_RANGE =
  "U+0000-00FF, U+0131, U+0152-0153, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";

const face = (
  family: string,
  weight: number,
  file: string,
  range: string
) =>
  `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:block;src:url('${staticFile(
    file
  )}') format('woff2');unicode-range:${range};}`;

const CSS = [
  // Hind Siliguri — Bengali + Latin, weights 400/500/600/700
  face("Hind Siliguri", 400, "fonts/HindSiliguri-400.woff2", BENGALI_RANGE),
  face("Hind Siliguri", 400, "fonts/HindSiliguriLatin-400.woff2", LATIN_RANGE),
  face("Hind Siliguri", 500, "fonts/HindSiliguri-500.woff2", BENGALI_RANGE),
  face("Hind Siliguri", 500, "fonts/HindSiliguriLatin-500.woff2", LATIN_RANGE),
  face("Hind Siliguri", 600, "fonts/HindSiliguri-600.woff2", BENGALI_RANGE),
  face("Hind Siliguri", 600, "fonts/HindSiliguriLatin-600.woff2", LATIN_RANGE),
  face("Hind Siliguri", 700, "fonts/HindSiliguri-700.woff2", BENGALI_RANGE),
  face("Hind Siliguri", 700, "fonts/HindSiliguriLatin-700.woff2", LATIN_RANGE),
  // Noto Serif Bengali — moral / book cards
  face("Noto Serif Bengali", 600, "fonts/NotoSerifBengali-600.woff2", BENGALI_RANGE),
  face("Noto Serif Bengali", 700, "fonts/NotoSerifBengali-700.woff2", BENGALI_RANGE),
  // Latin fallback INSIDE the Bengali family, so mixed "বাবা + B.Tech" renders
  face("Noto Serif Bengali", 600, "fonts/HindSiliguriLatin-600.woff2", LATIN_RANGE),
  face("Noto Serif Bengali", 700, "fonts/HindSiliguriLatin-700.woff2", LATIN_RANGE),
  // Playfair Display — Latin titles
  face("Playfair Display", 600, "fonts/PlayfairDisplay-600.woff2", LATIN_RANGE),
  face("Playfair Display", 700, "fonts/PlayfairDisplay-700.woff2", LATIN_RANGE),
].join("\n");

let injected = false;
export const ensureFonts = () => {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const style = document.createElement("style");
  style.setAttribute("data-fonts", "realmhdhasan");
  style.textContent = CSS;
  document.head.appendChild(style);

  const handle = delayRender("load-fonts");
  const families: Array<[string, string]> = [
    ["400 48px 'Hind Siliguri'", "অর্ণব EMI"],
    ["600 48px 'Hind Siliguri'", "সঞ্চয় status"],
    ["700 48px 'Hind Siliguri'", "টাকা ১০০"],
    ["600 48px 'Noto Serif Bengali'", "ভালোবাসি"],
    ["700 48px 'Noto Serif Bengali'", "বাবা কোনোদিন"],
    ["700 48px 'Playfair Display'", "MONEY"],
  ];
  Promise.all(
    families.map(([f, t]) =>
      (document as Document).fonts.load(f, t).catch(() => undefined)
    )
  )
    .then(() => (document as Document).fonts.ready)
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};
