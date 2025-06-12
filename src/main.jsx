import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./home.jsx";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import BattleBoard from "./battle-board.jsx";

export const Layout = () => {
  return (
    <div className="layout">
      <Outlet />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<App />} />
        <Route path="battle" element={<BattleBoard />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Route>
    </Routes>
  </BrowserRouter>
);
