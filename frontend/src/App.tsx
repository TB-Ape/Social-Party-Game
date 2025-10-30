import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import PlayerJoin from "./PlayerJoin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/p" element={<PlayerJoin />} />
      </Routes>
    </BrowserRouter>
  );
}
