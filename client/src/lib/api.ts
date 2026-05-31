import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category, Standard, Hotspot, InsertCategory, InsertStandard, InsertHotspot, StandardComment, InsertStandardComment } from "@shared/schema";

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}

async function fetchStandards(categoryId?: number): Promise<Standard[]> {
  const url = categoryId ? `/api/standards?categoryId=${categoryId}` : "/api/standards";
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch standards");
  return response.json();
}

async function fetchHotspots(): Promise<Hotspot[]> {
  const response = await fetch("/api/hotspots");
  if (!response.ok) throw new Error("Failed to fetch hotspots");
  return response.json();
}

async function createCategory(category: InsertCategory): Promise<Category> {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error("Failed to create category");
  return response.json();
}

async function updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category> {
  const response = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error("Failed to update category");
  return response.json();
}

async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete category");
}

async function createStandard(standard: InsertStandard): Promise<Standard> {
  const response = await fetch("/api/standards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(standard),
  });
  if (!response.ok) throw new Error("Failed to create standard");
  return response.json();
}

async function updateStandard(id: number, standard: Partial<InsertStandard>): Promise<Standard> {
  const response = await fetch(`/api/standards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(standard),
  });
  if (!response.ok) throw new Error("Failed to update standard");
  return response.json();
}

async function deleteStandard(id: number): Promise<void> {
  const response = await fetch(`/api/standards/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete standard");
}

async function createHotspot(hotspot: InsertHotspot): Promise<Hotspot> {
  const response = await fetch("/api/hotspots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hotspot),
  });
  if (!response.ok) throw new Error("Failed to create hotspot");
  return response.json();
}

async function updateHotspot(id: number, hotspot: Partial<InsertHotspot>): Promise<Hotspot> {
  const response = await fetch(`/api/hotspots/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hotspot),
  });
  if (!response.ok) throw new Error("Failed to update hotspot");
  return response.json();
}

async function deleteHotspot(id: number): Promise<void> {
  const response = await fetch(`/api/hotspots/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete hotspot");
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}

export function useStandards(categoryId?: number) {
  return useQuery({
    queryKey: categoryId ? ["standards", categoryId] : ["standards"],
    queryFn: () => fetchStandards(categoryId),
  });
}

export function useHotspots() {
  return useQuery({
    queryKey: ["hotspots"],
    queryFn: fetchHotspots,
    staleTime: 5 * 60 * 1000,
    initialData: () => {
      try {
        const raw = localStorage.getItem("hotspots_cache");
        if (raw) return JSON.parse(raw) as Hotspot[];
      } catch {}
      return undefined;
    },
    initialDataUpdatedAt: () => {
      try {
        const ts = localStorage.getItem("hotspots_cache_ts");
        return ts ? Number(ts) : 0;
      } catch {}
      return 0;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      queryClient.setQueryData<Category[]>(["categories"], (old) => 
        old ? [...old, newCategory] : [newCategory]
      );
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, category }: { id: number; category: Partial<InsertCategory> }) =>
      updateCategory(id, category),
    onSuccess: (updated) => {
      queryClient.setQueryData<Category[]>(["categories"], (old) =>
        old?.map(c => c.id === updated.id ? updated : c) || []
      );
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const prev = queryClient.getQueryData<Category[]>(["categories"]);
      queryClient.setQueryData<Category[]>(["categories"], (old) =>
        old?.filter(c => c.id !== id) || []
      );
      return { prev };
    },
    onError: (_, __, context) => {
      if (context?.prev) queryClient.setQueryData(["categories"], context.prev);
    },
  });
}

export function useCreateStandard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStandard,
    onSuccess: (newStandard) => {
      queryClient.setQueryData<Standard[]>(["standards"], (old) =>
        old ? [...old, newStandard] : [newStandard]
      );
    },
  });
}

export function useUpdateStandard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, standard }: { id: number; standard: Partial<InsertStandard> }) =>
      updateStandard(id, standard),
    onMutate: async ({ id, standard }) => {
      await queryClient.cancelQueries({ queryKey: ["standards"] });
      const prev = queryClient.getQueryData<Standard[]>(["standards"]);
      queryClient.setQueryData<Standard[]>(["standards"], (old) =>
        old?.map(s => s.id === id ? { ...s, ...standard } as Standard : s) || []
      );
      return { prev };
    },
    onError: (_, __, context) => {
      if (context?.prev) queryClient.setQueryData(["standards"], context.prev);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Standard[]>(["standards"], (old) =>
        old?.map(s => s.id === updated.id ? updated : s) || []
      );
    },
  });
}

export function useDeleteStandard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStandard,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["standards"] });
      const prev = queryClient.getQueryData<Standard[]>(["standards"]);
      queryClient.setQueryData<Standard[]>(["standards"], (old) =>
        old?.filter(s => s.id !== id) || []
      );
      return { prev };
    },
    onError: (_, __, context) => {
      if (context?.prev) queryClient.setQueryData(["standards"], context.prev);
    },
  });
}

export function useCreateHotspot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHotspot,
    onSuccess: (newHotspot) => {
      queryClient.setQueryData<Hotspot[]>(["hotspots"], (old) =>
        old ? [...old, newHotspot] : [newHotspot]
      );
    },
  });
}

export function useUpdateHotspot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, hotspot }: { id: number; hotspot: Partial<InsertHotspot> }) =>
      updateHotspot(id, hotspot),
    onMutate: async ({ id, hotspot }) => {
      await queryClient.cancelQueries({ queryKey: ["hotspots"] });
      const prev = queryClient.getQueryData<Hotspot[]>(["hotspots"]);
      queryClient.setQueryData<Hotspot[]>(["hotspots"], (old) =>
        old?.map(h => h.id === id ? { ...h, ...hotspot } as Hotspot : h) || []
      );
      return { prev };
    },
    onError: (_, __, context) => {
      if (context?.prev) queryClient.setQueryData(["hotspots"], context.prev);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Hotspot[]>(["hotspots"], (old) =>
        old?.map(h => h.id === updated.id ? updated : h) || []
      );
    },
  });
}

export function useDeleteHotspot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHotspot,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["hotspots"] });
      const prev = queryClient.getQueryData<Hotspot[]>(["hotspots"]);
      queryClient.setQueryData<Hotspot[]>(["hotspots"], (old) =>
        old?.filter(h => h.id !== id) || []
      );
      return { prev };
    },
    onError: (_, __, context) => {
      if (context?.prev) queryClient.setQueryData(["hotspots"], context.prev);
    },
  });
}

// Comment API functions
async function fetchComments(standardId: number): Promise<StandardComment[]> {
  const response = await fetch(`/api/standards/${standardId}/comments`);
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
}

async function createComment(data: { standardId: number; author: string; content: string }): Promise<StandardComment> {
  const response = await fetch(`/api/standards/${data.standardId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author: data.author, content: data.content }),
  });
  if (!response.ok) throw new Error("Failed to create comment");
  return response.json();
}

async function deleteComment(id: number): Promise<void> {
  const response = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete comment");
}

// Comment hooks
export function useComments(standardId: number | null) {
  return useQuery({
    queryKey: ["comments", standardId],
    queryFn: () => fetchComments(standardId!),
    enabled: !!standardId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.standardId] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}
