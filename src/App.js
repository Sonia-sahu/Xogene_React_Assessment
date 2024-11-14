// import logo from './logo.svg';
import React from 'react';
import DrugDetail from './components/DrugDetail';
import DrugSearch from './components/DrugSearch';
import './App.css';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';

function App() {
  return(
  <BrowserRouter>
    <Routes>
    <Route path="/" element={<Navigate to="/drugs/search" />} />
      <Route path='/drugs/search' element={<DrugSearch/>}/>
      <Route path='/drugs/:drugName' element={<DrugDetail/>}/>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
