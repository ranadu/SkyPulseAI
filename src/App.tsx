import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FleetProvider } from './store/fleetContext';
import Navbar from './components/Navbar';
import FleetDashboard from './pages/FleetDashboard';
import AircraftDetail from './pages/AircraftDetail';
import AlertsPage from './pages/AlertsPage';
import MaintenancePage from './pages/MaintenancePage';
import MethodologyPage from './pages/MethodologyPage';
import WorkedExamplePage from './pages/WorkedExamplePage';
import ValidationPage from './pages/ValidationPage';

export default function App() {
  return (
    <FleetProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', background: '#070a10' }}>
          <Navbar />
          <main style={{ paddingTop: 56 }}>
            <Routes>
              <Route path="/"                element={<FleetDashboard />} />
              <Route path="/aircraft/:id"    element={<AircraftDetail />} />
              <Route path="/alerts"          element={<AlertsPage />} />
              <Route path="/maintenance"     element={<MaintenancePage />} />
              <Route path="/methodology"     element={<MethodologyPage />} />
              <Route path="/worked-example"  element={<WorkedExamplePage />} />
              <Route path="/validation"      element={<ValidationPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </FleetProvider>
  );
}
