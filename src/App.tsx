import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Sarees from "./pages/Sarees";
import Bridal from "./pages/Bridal";
import Jewelry from "./pages/Jewelry";
import Festival from "./pages/Festival";
import VirtualTryOn from "./pages/VirtualTryOn";
import Community from "./pages/Community";
import Gajulu from "./pages/Gajulu";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import AuthModal from "./components/AuthModal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AuthModal />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sarees" element={<Sarees />} />
            <Route path="/gajulu" element={<Gajulu />} />
            <Route path="/bridal" element={<Bridal />} />
            <Route path="/jewelry" element={<Jewelry />} />
            <Route path="/festival" element={<Festival />} />
            <Route path="/virtual-tryon" element={<VirtualTryOn />} />
            <Route path="/community" element={<Community />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
