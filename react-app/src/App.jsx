import React from 'react';
import HomePage from './components/HomePage';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PlanTrip from './pages/PlanTrip';
import SearchResultsPage from './pages/SearchResultsPage';

const qc = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plan-trip" element={<PlanTrip />} />
          <Route path="/results" element={<SearchResultsPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;