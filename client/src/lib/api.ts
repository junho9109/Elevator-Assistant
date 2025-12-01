import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Category, Standard, Hotspot, InsertCategory, InsertStandard, InsertHotspot } from "@shared/schema";

// API client functions
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

// React Query hooks
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
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, category }: { id: number; category: Partial<InsertCategory> }) =>
      updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["standards"] });
      queryClient.invalidateQueries({ queryKey: ["hotspots"] });
    },
  });
}

export function useCreateStandard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStandard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["standards"] });
    },
  });
}

export function useUpdateStandard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, standard }: { id: number; standard: Partial<InsertStandard> }) =>
      updateStandard(id, standard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["standards"] });
    },
  });
}

export function useDeleteStandard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStandard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["standards"] });
    },
  });
}

export function useCreateHotspot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHotspot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotspots"] });
    },
  });
}

export function useUpdateHotspot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, hotspot }: { id: number; hotspot: Partial<InsertHotspot> }) =>
      updateHotspot(id, hotspot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotspots"] });
    },
  });
}

export function useDeleteHotspot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHotspot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotspots"] });
    },
  });
}
