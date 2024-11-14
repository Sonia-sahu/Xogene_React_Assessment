import React from 'react';
import DrugDetail from './components/DrugDetail';
import DrugSearch from './components/DrugSearch';
import './App.css';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import logo from './images/download.jpeg'; 

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
       
        <header className="app-header">
          <img src={logo} alt="XOGENE LOGO" className="logo" /> 
          <h1>Search Drugs</h1> 
        </header>

    
        <Routes>
          <Route path="/" element={<Navigate to="/drugs/search" />} />
          <Route path='/drugs/search' element={<DrugSearch />} />
          <Route path='/drugs/:drugName' element={<DrugDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
