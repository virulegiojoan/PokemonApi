import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Index from './views/Index';
import Detalle from './views/Detalle';

const App = () => {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/pokemon/:id' element={<Detalle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
