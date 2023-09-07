import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tutor from './Tutor';
import Pets from './Pets';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pets />} />
        <Route path="/tutores" element={<Tutor />} />
      </Routes>
    </Router>
  );
}

export default App;