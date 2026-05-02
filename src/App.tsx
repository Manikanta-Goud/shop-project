import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ClerkProvider, useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { supabase } from "./integrations/supabase/client";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Sarees from "./pages/Sarees";
import Bridal from "./pages/Bridal";
import Jewelry from "./pages/Jewelry";
import Festival from "./pages/Festival";
import VirtualTryOn from "./pages/VirtualTryOn";
import Community from "./pages/Community";
import Bangles from "./pages/Bangles";
import Offers from "./pages/Offers";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import AuthModal from "./components/AuthModal";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

// Checks Supabase profile after login — if phone & address are both empty,
// the user hasn't completed their profile yet → redirect to /profile.
// Uses a ref so it only runs once per session (not on every navigation).
const NewUserRedirect = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only run once, skip if already checked or user not loaded
    if (!isLoaded || !user || hasChecked.current) return;
    // Never redirect away from profile or admin pages
    if (location.pathname === "/profile" || location.pathname.startsWith("/admin")) return;

    hasChecked.current = true;

    const checkProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("phone, address")
        .eq("id", user.id)
        .single();

      // If no profile row at all, OR both phone & address are empty → incomplete
      const isIncomplete = !data || (!data.phone && !data.address);
      if (isIncomplete) {
        navigate("/profile", { replace: true });
      }
    };

    checkProfile();
  }, [isLoaded, user]);

  return null;
};

const AppContent = () => {
  return (
    <>
      <AuthModal />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <NewUserRedirect />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/sarees" element={<Sarees />} />
            <Route path="/bangles" element={<Bangles />} />
            <Route path="/bridal" element={<Bridal />} />
            <Route path="/jewelry" element={<Jewelry />} />
            <Route path="/festival" element={<Festival />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/virtual-tryon" element={<VirtualTryOn />} />
            <Route path="/community" element={<Community />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </>
  );
};

const App = () => (
  <ClerkProvider
    publishableKey={clerkPubKey}
    afterSignInUrl="/profile"
    afterSignUpUrl="/profile"
  >
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
