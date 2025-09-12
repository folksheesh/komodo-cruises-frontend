import React from 'react';
import HomePage from './components/HomePage';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BoatList from './pages/BoatList';
import BoatDetail from './pages/BoatDetail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PlanTrip from './pages/PlanTrip';

const qc = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/boats" element={<BoatList />} />
          <Route path="/boats/:id" element={<BoatDetail />} />
          <Route path="/plan-trip" element={<PlanTrip />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;