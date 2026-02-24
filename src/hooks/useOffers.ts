import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Offer {
  id?: number;
  title: string;
  description: string;
  image: string;
  price: string;
  original_price: string;
  discount_percentage?: number;
  category: string;
  tag: string;
  is_active: boolean;
  is_featured: boolean;
  stock_count: number;
  countdown_end?: string;
  product_id?: number;
  created_at?: string;
  updated_at?: string;
}

// Hook to fetch all offers
export const useOffers = () => {
  return useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Offer[];
    },
  });
};

// Hook to fetch featured offers (for Limited Edition Drops)
export const useFeaturedOffers = () => {
  return useQuery({
    queryKey: ["offers", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Offer[];
    },
  });
};

// Hook to fetch offers by category
export const useOffersByCategory = (category: string) => {
  return useQuery({
    queryKey: ["offers", "category", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Offer[];
    },
  });
};

// Hook to add a new offer
export const useAddOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOffer: Offer) => {
      const { data, error } = await supabase
        .from("offers")
        .insert([newOffer])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Offer added successfully! ✦");
    },
    onError: (error: any) => {
      toast.error("Error adding offer: " + error.message);
    },
  });
};

// Hook to update an offer
export const useUpdateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Offer> & { id: number }) => {
      const { data, error } = await supabase
        .from("offers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Offer updated successfully! ✦");
    },
    onError: (error: any) => {
      toast.error("Error updating offer: " + error.message);
    },
  });
};

// Hook to delete an offer
export const useDeleteOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("offers")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Offer deleted successfully!");
    },
    onError: (error: any) => {
      toast.error("Error deleting offer: " + error.message);
    },
  });
};

// Hook to toggle offer active status
export const useToggleOfferStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      const { data, error } = await supabase
        .from("offers")
        .update({ is_active })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Offer status updated!");
    },
    onError: (error: any) => {
      toast.error("Error updating status: " + error.message);
    },
  });
};
