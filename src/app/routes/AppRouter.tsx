import { Route, Routes } from "react-router-dom";
import { AboutPage } from "@/pages/about/AboutPage";
import { HomePage } from "@/pages/home/HomePage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

