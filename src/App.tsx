import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Sarees from "./pages/Sarees";
import Bridal from "./pages/Bridal";
import Jewelry from "./pages/Jewelry";
import Festival from "./pages/Festival";
import VirtualTryOn from "./pages/VirtualTryOn";
import Community from "./pages/Community";
import Gajulu from "./pages/Gajulu";
import Offers from "./pages/Offers";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import AuthModal from "./components/AuthModal";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

const AppContent = () => {
  return (
    <>
      <AuthModal />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
            <Route path="/sarees" element={<ProtectedRoute><Sarees /></ProtectedRoute>} />
            <Route path="/gajulu" element={<ProtectedRoute><Gajulu /></ProtectedRoute>} />
            <Route path="/bridal" element={<ProtectedRoute><Bridal /></ProtectedRoute>} />
            <Route path="/jewelry" element={<ProtectedRoute><Jewelry /></ProtectedRoute>} />
            <Route path="/festival" element={<ProtectedRoute><Festival /></ProtectedRoute>} />
            <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
            <Route path="/virtual-tryon" element={<ProtectedRoute><VirtualTryOn /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </>
  );
};

const App = () => (
  <ClerkProvider publishableKey={clerkPubKey}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
