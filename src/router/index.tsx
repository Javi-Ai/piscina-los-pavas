import { Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout/AppLayout';
import Landing from '../pages/Landing/Landing';
import Reservations from '../pages/Reservations/Reservations';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>
      <Route path="/reservar" element={<Reservations />} />
    </Routes>
  );
}
