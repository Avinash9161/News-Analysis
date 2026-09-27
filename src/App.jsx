import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import NewsFeedPage from "./pages/NewsFeedPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<NewsFeedPage />} />
          <Route path="/category/:categoryId" element={<NewsFeedPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}