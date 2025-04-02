import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Model from './pages/Model';
import NotFound from './pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/model" element={<Model />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
