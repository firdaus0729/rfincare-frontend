import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { applyRuntimeToApiClient, loadRuntimeConfig } from "./lib/runtimeConfig";
import { apiClient } from "./lib/apiClient";
import "./styles/tailwind.css";
import "./styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container);

async function bootstrap() {
  await loadRuntimeConfig();
  applyRuntimeToApiClient(apiClient);

  root.render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

bootstrap();
