import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSarees = (category?: string) => {
    return useQuery({
        queryKey: ["sarees", category],
        queryFn: async () => {
            let query = supabase.from("products").select("*");

            if (category && category !== "All") {
                query = query.eq("category", category);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data || [];
        },
        // Automatically refetch when window regains focus
        refetchOnWindowFocus: true,
        // Keep data fresh for 30 seconds before considering it stale
        staleTime: 30 * 1000,
    });
};
