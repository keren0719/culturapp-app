import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from '@/components/PublicRoute';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import Calendar from "./pages/Calendar";
import MapView from "./pages/MapView";
import NotFound from "./pages/NotFound";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import AdminDashboard from "./pages/AdminDashboard";
import EventDetail from "./pages/EventDetail";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
           <PublicRoute>
              <Index />
           </PublicRoute>
          } 
        />
        <Route 
          path="/event/:id" 
          element={         
            <ProtectedRoute allowedRoles={['ORGA','ADMIN','PARTI']}>
              <EventDetail />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
            
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
         <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>            
          }
        />
        <Route 
          path="/explore" 
          element={
            <ProtectedRoute allowedRoles={['ORGA','ADMIN','PARTI']}>
              <Explore />
            </ProtectedRoute>
          } 
        />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/map" element={<MapView />} />
        <Route
          path="/admin/dashboard"
          element={
             <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        
        />
        <Route 
          path="/organizer/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ORGA','ADMIN']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-event" 
          element={
            <ProtectedRoute allowedRoles={['ORGA','ADMIN']}>
                <CreateEvent/>
            </ProtectedRoute>
          }

        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
