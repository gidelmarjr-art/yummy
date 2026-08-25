import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importando a sua página landing
import LandingPage from './apps/web/pages/landing/landing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota principal que abre a Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Exemplo de outra rota caso precise no futuro */}
        {/* <Route path="/sobre" element={<Sobre />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;