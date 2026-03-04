import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProducts = (type: string = "Saree", category?: string) => {
    return useQuery({
        queryKey: ["products", type, category],
        queryFn: async () => {
            let query = supabase.from("products").select("*").eq("type", type);

            if (category && category !== "All") {
                query = query.eq("category", category);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data || [];
        },
        // Realtime subscriptions handle live updates — no need to refetch on every focus/reconnect
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        // Cache products for 5 minutes
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};
