import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Services } from './pages/Services';
import { SLAs } from './pages/SLAs';
import { Incidents } from './pages/Incidents';
import { Audits } from './pages/Audits';
import { NonConformities } from './pages/NonConformities';
import { Reports } from './pages/Reports';
import { Risks } from './pages/Risks';
import { Assets } from './pages/Assets';
import { Problems } from './pages/Problems';
import { ISO20000 } from './pages/ISO20000';
import { ISO9001 } from './pages/ISO9001';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/slas" element={<SLAs />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/audits" element={<Audits />} />
          <Route path="/non-conformities" element={<NonConformities />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/risks" element={<Risks />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/iso-20000" element={<ISO20000 />} />
          <Route path="/iso-9001" element={<ISO9001 />} />
        </Routes>
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;