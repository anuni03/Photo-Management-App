import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadPage from "./components/UploadPage";
import GalleryPage from "./components/GalleryPage";
import PhotoDetailsPage from "./components/PhotoDetailsPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/photo/:id" element={<PhotoDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
