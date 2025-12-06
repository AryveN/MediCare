// import { useEffect, useState } from 'react';
//
// type Health = { status: 'ok' } | { status: 'down' };
//
// export default function App() {
//   const [health, setHealth] = useState<Health>({ status: 'down' });
//
//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_BASE}/health`)
//       .then((r) => r.json())
//       .then(setHealth)
//       .catch(() => setHealth({ status: 'down' }));
//   }, []);
//
//   return (
//     <main style={{ fontFamily: 'system-ui', padding: 24 }}>
//       <h1>MediCare – frontend</h1>
//       <p>
//         API base: <code>{import.meta.env.VITE_API_BASE}</code>
//       </p>
//       <p>
//         Health: <b>{health.status}</b>
//       </p>
//       <p>
//         Swagger:{' '}
//         <a href={`${import.meta.env.VITE_API_BASE}/api-docs`} target="_blank" rel="noreferrer">
//           /api-docs
//         </a>
//       </p>
//     </main>
//   );
// }


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ManReservations from "./components/ManReservation";
import Calendar from "./modul/calendar";
import AppointmentForm from "./modul/rezervovat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/moje-rezervace" element={<ManReservations />} />
          <Route path="/rezervovat" element={<AppointmentForm />} />
          <Route path="/calendar" element={<Calendar />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

