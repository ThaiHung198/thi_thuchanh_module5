import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UpdateProductPage from "./pages/UpdateProductPage";
import "./App.css"; // Import file CSS đã chuẩn bị

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id/edit" element={<UpdateProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;
