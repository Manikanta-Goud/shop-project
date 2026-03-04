import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
    full_name: string | null;
    phone: string | null;
    address: string | null;
    loyalty_points: number;
    avatar_url: string | null;
};

type AuthContextType = {
    user: any;
    profile: Profile | null;
    setProfile: (profile: Profile | null) => void;
    loading: boolean;
    signOut: () => Promise<void>;
    showLoginModal: boolean;
    setShowLoginModal: (show: boolean) => void;
    isProfileComplete: boolean;
};

// Create context with default values to prevent undefined errors
const defaultAuthContext: AuthContextType = {
    user: null,
    profile: null,
    setProfile: () => {},
    loading: true,
    signOut: async () => {},
    showLoginModal: false,
    setShowLoginModal: () => {},
    isProfileComplete: false,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { user: clerkUser, isLoaded } = useUser();
    const { signOut: clerkSignOut } = useClerk();
    const [profile, setProfileState] = useState<Profile | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Check if profile is complete (has at least the full name)
    const isProfileComplete = !!(profile?.full_name && profile.full_name.trim() !== "");

    const fetchProfile = async (uid: string) => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", uid)
            .single();

        if (data && !error) {
            setProfileState(data);
        }
    };

    const createOrUpdateProfile = async (clerkUser: any) => {
        if (!clerkUser) return;

        const { data, error } = await supabase
            .from("profiles")
            .upsert({
                id: clerkUser.id,
                full_name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
                email: clerkUser.primaryEmailAddress?.emailAddress || '',
                phone: clerkUser.primaryPhoneNumber?.phoneNumber || '',
                avatar_url: clerkUser.imageUrl,
                loyalty_points: 0,
            }, { onConflict: 'id' })
            .select()
            .single();

        if (data && !error) {
            setProfileState(data);
        }
    };

    useEffect(() => {
        if (isLoaded && clerkUser) {
            createOrUpdateProfile(clerkUser);
            setShowLoginModal(false);
        } else if (isLoaded && !clerkUser) {
            setProfileState(null);
        }
    }, [clerkUser, isLoaded]);

    const signOut = async () => {
        await clerkSignOut();
        setProfileState(null);
    };

    const setProfile = (newProfile: Profile | null) => {
        setProfileState(newProfile);
    };

    return (
        <AuthContext.Provider value={{ 
            user: clerkUser, 
            profile, 
            setProfile, 
            loading: !isLoaded, 
            signOut, 
            showLoginModal, 
            setShowLoginModal,
            isProfileComplete
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
};
