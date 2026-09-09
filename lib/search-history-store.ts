"use client";

import { useState, useEffect } from "react";

const SEARCH_HISTORY_KEY = "gacks_leads_search_history_v2";

export interface SearchHistoryItem {
  id: string;
  mode: "physical" | "online";
  query: string;
  location: string;
  provider: string;
  totalFetched: number;
  qualifiedCount: number;
  createdAt: string;
}

const DEFAULT_HISTORY: SearchHistoryItem[] = [
  {
    id: "hist-1",
    mode: "physical",
    query: "Plumbers",
    location: "Nairobi, Kenya",
    provider: "OpenStreetMap",
    totalFetched: 32,
    qualifiedCount: 14,
    createdAt: new Date().toISOString(),
  },
  {
    id: "hist-2",
    mode: "online",
    query: "Next.js Developer",
    location: "Worldwide Remote",
    provider: "Remotive Public API",
    totalFetched: 24,
    qualifiedCount: 19,
    createdAt: new Date().toISOString(),
  },
  {
    id: "hist-3",
    mode: "physical",
    query: "Auto Repair",
    location: "Austin, TX, United States",
    provider: "OpenStreetMap",
    totalFetched: 45,
    qualifiedCount: 22,
    createdAt: new Date().toISOString(),
  },
];

export function getStoredSearchHistory(): SearchHistoryItem[] {
  if (typeof window === "undefined") return DEFAULT_HISTORY;
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!raw) return DEFAULT_HISTORY;
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_HISTORY;
  }
}

export function logSearchHistory(item: Omit<SearchHistoryItem, "id" | "createdAt">): void {
  if (typeof window === "undefined") return;
  try {
    const prev = getStoredSearchHistory();
    const newItem: SearchHistoryItem = {
      ...item,
      id: `hist_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newItem, ...prev.filter((p) => p.id !== item.query)].slice(0, 30);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error(err);
  }
}
