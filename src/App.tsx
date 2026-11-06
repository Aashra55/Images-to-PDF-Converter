import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ConversionPage } from './pages/ConversionPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <div className="app-container">
          <Routes>
            {/* Main Homepage: Images to PDF */}
            <Route path="/" element={<ConversionPage />} />

            {/* Dedicated route for JPG / JPEG files */}
            <Route path="/jpg-to-pdf" element={<ConversionPage />} />

            {/* Dedicated route for PNG files */}
            <Route path="/png-to-pdf" element={<ConversionPage />} />

            {/* Dedicated route for iPhone HEIC / HEIF files */}
            <Route path="/heic-to-pdf" element={<ConversionPage />} />

            {/* Dedicated route for WEBP files */}
            <Route path="/webp-to-pdf" element={<ConversionPage />} />

            {/* Fallback to homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
