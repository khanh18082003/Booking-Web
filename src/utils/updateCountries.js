// Script to update countries.js from restcountries API
// Usage: node updateCountries.js
import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.join(__dirname, "countries.js");
const API_URL = "https://restcountries.com/v3.1/all";

(async () => {
  try {
    const { data } = await axios.get(API_URL);
    const countries = data
      .map((c) => {
        // Get common name
        const name = c.name?.common || "";
        // Get ISO 3166-1 alpha-2 code
        const code = c.cca2 || "";
        // Get dial code (callingCodes is now in idd.root + idd.suffixes)
        let dialCode = "";
        if (
          c.idd &&
          c.idd.root &&
          Array.isArray(c.idd.suffixes) &&
          c.idd.suffixes.length > 0
        ) {
          dialCode = c.idd.suffixes.map((s) => `${c.idd.root}${s}`).join(", ");
        } else if (c.idd && c.idd.root) {
          dialCode = c.idd.root;
        }
        // Get flag svg from flagcdn
        const flag = code
          ? `https://flagcdn.com/${code.toLowerCase()}.svg`
          : "";
        return { name, code, dialCode, flag };
      })
      .filter((c) => c.name && c.code && c.dialCode && c.flag);

    // Sort by name
    countries.sort((a, b) => a.name.localeCompare(b.name));

    // Write to file
    const fileContent = `// Country data auto-generated from restcountries API\nconst countries = ${JSON.stringify(countries, null, 2)};\n\nexport default countries;\n`;
    fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");
    console.log("countries.js updated successfully!");
  } catch (err) {
    console.error("Failed to update countries.js:", err);
  }
})();
