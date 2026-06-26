import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FleetDashboard from './pages/FleetDashboard';
import AircraftDetail from './pages/AircraftDetail';
import AlertsPage from './pages/AlertsPage';
import MaintenancePage from './pages/MaintenancePage';
import MethodologyPage from './pages/MethodologyPage';
import WorkedExamplePage from './pages/WorkedExamplePage';
import PortfolioPage from './pages/PortfolioPage';
import ValidationPage from './pages/ValidationPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0e1a]">
        <Navbar />
        <main className="pt-14">
          <Routes>
            <Route path="/" element={<FleetDashboard />} />
            <Route path="/aircraft/:id" element={<AircraftDetail />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
            <Route path="/worked-example" element={<WorkedExamplePage />} />
            <Route path="/validation" element={<ValidationPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
