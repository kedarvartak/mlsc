import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Marketplace from './components/Marketplace';
import Footer from './components/Footer';
import { Web3Provider } from './context/Web3Context';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-[#0A0A0F]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/marketplace" element={<Marketplace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
