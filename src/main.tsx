import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';



createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <GoogleOAuthProvider clientId="453736165925-22b7ej5al8ptmseajcjblmt2nn70nijb.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </AuthProvider>
);
