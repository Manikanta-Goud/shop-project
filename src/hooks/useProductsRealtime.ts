import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook to subscribe to real-time changes in the products table.
 * Only opens a WebSocket when `enabled` is true (opt-in).
 */
export const useProductsRealtime = (enabled: boolean = false) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!enabled) return;

        // Subscribe to all changes in the products table
        const channel = supabase
            .channel("products-changes")
            .on(
                "postgres_changes",
                {
                    event: "*", // Listen to INSERT, UPDATE, and DELETE
                    schema: "public",
                    table: "products",
                },
                (payload) => {
                    console.log("Real-time update received:", payload);

                    // Invalidate all product-related queries to trigger refetch
                    queryClient.invalidateQueries({ queryKey: ["products"] });
                    queryClient.invalidateQueries({ queryKey: ["sarees"] });
                }
            )
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient, enabled]);
};
