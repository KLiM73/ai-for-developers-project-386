import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { GuestLayout } from './layouts/GuestLayout';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminEventTypesPage } from './pages/admin/AdminEventTypesPage';
import { BookingPage } from './pages/guest/BookingPage';
import { BookingSuccessPage } from './pages/guest/BookingSuccessPage';
import { EventTypesPage } from './pages/guest/EventTypesPage';
import { NotFoundPage } from './pages/NotFoundPage';

const router = createBrowserRouter([
  {
    element: <GuestLayout />,
    children: [
      { index: true, element: <EventTypesPage /> },
      { path: 'book/:eventTypeId', element: <BookingPage /> },
      { path: 'book/:eventTypeId/success', element: <BookingSuccessPage /> },
    ],
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/event-types" replace /> },
      { path: 'event-types', element: <AdminEventTypesPage /> },
      { path: 'bookings', element: <AdminBookingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
