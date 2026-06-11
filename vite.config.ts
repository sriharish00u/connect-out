import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "secret", "VITE_");

  return {
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths(),
      {
        name: "inject-firebase-config",
        transform(code, id) {
          if (id.endsWith("public/firebase-config.js")) {
            let result = code;
            for (const [key, val] of Object.entries(env)) {
              const token = `__${key}__`;
              if (val && result.includes(token)) {
                result = result.replaceAll(token, val);
              }
            }
            return result;
          }
        },
      },
    ],
    envDir: "secret",
    server: {
      proxy: {
        "/api": "http://localhost:3001",
      },
    },
  };
});
