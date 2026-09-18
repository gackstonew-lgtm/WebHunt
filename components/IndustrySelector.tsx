"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { 
  Search, 
  X, 
  ChevronDown, 
  Check, 
  Layers,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal
} from "lucide-react";
import { LeadMode } from "@/lib/types";
import { 
  IndustryDefinition, 
  searchTaxonomy, 
  getCategoriesWithIndustries, 
  getIndustryById 
} from "@/lib/taxonomy";

interface IndustrySelectorProps {
  mode: LeadMode;
  value: string;
  selectedIndustryIds: string[];
  onChange: (nicheText: string, industryIds: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function IndustrySelector({
  mode,
  value,
  selectedIndustryIds,
  onChange,
  placeholder,
  disabled = false,
}: IndustrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "categories">("search");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  const triggerInputRef = useRef<HTMLInputElement>(null);
  const modalSearchInputRef = useRef<HTMLInputElement>(null);

  // Mount state for SSR safe Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Category hierarchy for current mode
  const categoryGroups = useMemo(() => {
    return getCategoriesWithIndustries(mode);
  }, [mode]);

  // Set default category tab if not set
  useEffect(() => {
    if (categoryGroups.length > 0 && !selectedCategoryTab) {
      setSelectedCategoryTab(categoryGroups[0].category.id);
    }
  }, [categoryGroups, selectedCategoryTab]);

  // Search results based on live typing in modal
  const searchResults = useMemo(() => {
    return searchTaxonomy(searchQuery, mode, 30);
  }, [searchQuery, mode]);

  // Selected industry objects
  const selectedIndustries = useMemo(() => {
    return selectedIndustryIds
      .map((id) => getIndustryById(id))
      .filter((ind): ind is IndustryDefinition => Boolean(ind));
  }, [selectedIndustryIds]);

  // Body scroll locking when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Auto-focus modal search input when opening
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        modalSearchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle closing modal and restoring focus
  const handleClose = () => {
    setIsOpen(false);
    triggerInputRef.current?.focus();
  };

  // Keyboard navigation (Escape key to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Handle selecting / toggling an industry from taxonomy
  const handleToggleIndustry = (industry: IndustryDefinition) => {
    const isAlreadySelected = selectedIndustryIds.includes(industry.id);
    let newIds: string[];

    if (isAlreadySelected) {
      newIds = selectedIndustryIds.filter((id) => id !== industry.id);
    } else {
      newIds = [...selectedIndustryIds, industry.id];
    }

    const updatedIndustries = newIds
      .map((id) => getIndustryById(id))
      .filter((ind): ind is IndustryDefinition => Boolean(ind));

    const newNicheText = updatedIndustries.length > 0 
      ? updatedIndustries.map((ind) => ind.name).join(", ")
      : "";

    onChange(newNicheText, newIds);
  };

  // Handle removing a single tag
  const handleRemoveIndustry = (idToRemove: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newIds = selectedIndustryIds.filter((id) => id !== idToRemove);
    const updatedIndustries = newIds
      .map((id) => getIndustryById(id))
      .filter((ind): ind is IndustryDefinition => Boolean(ind));

    const newNicheText = updatedIndustries.length > 0 
      ? updatedIndustries.map((ind) => ind.name).join(", ")
      : "";

    onChange(newNicheText, newIds);
  };

  // Handle clearing all selections
  const handleClearAll = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onChange("", []);
    setSearchQuery("");
  };

  // Handle direct text typing in the form trigger input
  const handleTriggerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchQuery(text);
    onChange(text, selectedIndustryIds);
  };

  // Open modal handler
  const handleOpenModal = () => {
    if (disabled) return;
    setSearchQuery(value || "");
    setIsOpen(true);
  };

  // Render Modal Content via React Portal
  const renderModal = () => {
    if (!isOpen || !mounted) return null;

    const modalMarkup = (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="industry-modal-title"
      >
        {/* Centered Modal Card */}
        <div 
          className="relative w-full max-w-2xl sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] bg-surface border border-subtle/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-foreground animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="relative z-10 flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-subtle/50 bg-surface-elevated/80">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-surface border border-subtle/50 flex items-center justify-center text-foreground">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 id="industry-modal-title" className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
                  Target Industry / Business Type
                </h3>
                <p className="text-xs text-muted-foreground">
                  {mode === "physical"
                    ? "Select verified business niches or enter custom keywords for lead discovery"
                    : "Select verified job fields or enter custom search keywords"}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground hover:bg-white/[0.06] p-1.5 rounded-xl transition border border-transparent"
              aria-label="Close modal"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Search Bar */}
          <div className="relative z-10 px-5 sm:px-6 py-3 bg-surface-subtle border-b border-subtle/50">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
              <input
                ref={modalSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== "search") setActiveTab("search");
                }}
                placeholder={
                  mode === "physical"
                    ? "Search industries (e.g. Plumbers, Auto Repair, Dentists, Solar)..."
                    : "Search job fields (e.g. Software, AI Data, Writing, UI/UX)..."
                }
                className="w-full bg-surface border border-subtle/50 rounded-xl pl-10 pr-10 py-2 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground p-0.5"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation View Tabs */}
          <div className="relative z-10 flex items-center justify-between border-b border-subtle/50 bg-surface px-5 sm:px-6 py-2.5 text-xs">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab("search")}
                className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-xl font-semibold transition ${
                  activeTab === "search"
                    ? "bg-surface-elevated text-foreground border border-white/[0.14] shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Quick Search</span>
                {searchResults.length > 0 && searchQuery && (
                  <span className="text-[10px] bg-white/10 text-foreground px-1.5 py-0.2 rounded-full font-bold">
                    {searchResults.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("categories")}
                className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-xl font-semibold transition ${
                  activeTab === "categories"
                    ? "bg-surface-elevated text-foreground border border-white/[0.14] shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>All Global Sectors</span>
                <span className="text-[10px] bg-surface-elevated text-muted-foreground px-1.5 py-0.2 rounded-full">
                  {categoryGroups.length}
                </span>
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-medium text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Global Taxonomy Indexed</span>
            </div>
          </div>

          {/* Active Selections Bar inside modal */}
          {selectedIndustries.length > 0 && (
            <div className="relative z-10 px-5 sm:px-6 py-2 bg-surface-subtle border-b border-subtle/50 flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto">
              <span className="text-[11px] font-medium text-muted-foreground mr-1">Selected:</span>
              {selectedIndustries.map((ind) => (
                <span
                  key={ind.id}
                  className="inline-flex items-center space-x-1.5 bg-surface-elevated text-foreground border border-subtle/50 text-xs font-semibold px-2 py-0.5 rounded-xl transition"
                >
                  <span>{ind.name}</span>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveIndustry(ind.id, e)}
                    className="hover:text-white transition p-0.5 rounded"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={(e) => handleClearAll(e)}
                className="text-[11px] text-muted-foreground hover:text-foreground underline ml-1 transition"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Modal Body Content */}
          <div className="relative z-10 flex-1 overflow-hidden flex flex-col min-h-[260px] sm:min-h-[320px]">
            {/* View 1: Quick Search View */}
            {activeTab === "search" && (
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-white/[0.06]">
                {searchResults.length > 0 ? (
                  <div className="space-y-1.5">
                    <div className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                      <span>{searchQuery ? `Matching Niches (${searchResults.length})` : "Indexed Global Niches"}</span>
                      <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {searchResults.map((ind) => {
                        const isSelected = selectedIndustryIds.includes(ind.id);
                        return (
                          <button
                            type="button"
                            key={ind.id}
                            onClick={() => handleToggleIndustry(ind)}
                            className={`w-full text-left p-2.5 rounded-xl flex items-start justify-between transition group border ${
                              isSelected
                                ? "bg-white/[0.08] text-foreground border-white/[0.2] shadow-sm"
                                : "bg-surface hover:bg-surface-elevated text-foreground border-subtle hover:border-white/[0.14]"
                            }`}
                          >
                            <div className="flex flex-col pr-2 min-w-0">
                              <span className="text-xs font-semibold group-hover:text-white transition truncate">
                                {ind.name}
                              </span>
                              <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                {ind.aliases.slice(0, 3).join(" • ")}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0 mt-0.5">
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-md border border-subtle/50 group-hover:border-white/40 transition" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-subtle/50 flex items-center justify-center mx-auto text-muted-foreground">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        No exact taxonomy match for &quot;{searchQuery}&quot;
                      </p>
                      <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                        WebHunt will execute this keyword as a custom discovery query across all active providers.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* View 2: Categorized Global Sectors Explorer */}
            {activeTab === "categories" && (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
                {/* Category List Sidebar */}
                <div className="sm:col-span-5 max-h-[360px] sm:max-h-none overflow-y-auto p-2 space-y-1 bg-surface-subtle">
                  <div className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Global Sectors ({categoryGroups.length})
                  </div>
                  {categoryGroups.map((group) => {
                    const isSelectedCat = selectedCategoryTab === group.category.id;
                    const selectedCountInGroup = group.industries.filter((i) =>
                      selectedIndustryIds.includes(i.id)
                    ).length;

                    return (
                      <button
                        type="button"
                        key={group.category.id}
                        onClick={() => setSelectedCategoryTab(group.category.id)}
                        className={`w-full text-left px-5 py-3 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                          isSelectedCat
                            ? "bg-surface-elevated text-foreground font-bold border-l-2 border-white shadow-sm"
                            : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                        }`}
                      >
                        <span className="truncate">{group.category.name}</span>
                        <div className="flex items-center space-x-1.5 shrink-0 ml-1.5">
                          {selectedCountInGroup > 0 && (
                            <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.2 rounded-full font-bold">
                              {selectedCountInGroup}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground/60">
                            {group.industries.length}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-niches in active category */}
                <div className="sm:col-span-7 max-h-[360px] sm:max-h-none overflow-y-auto p-3 space-y-1.5 bg-surface">
                  <div className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                    <span>
                      {categoryGroups.find((g) => g.category.id === selectedCategoryTab)?.category.name || "Industries"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">Click to select</span>
                  </div>

                  <div className="space-y-1">
                    {categoryGroups
                      .find((g) => g.category.id === selectedCategoryTab)
                      ?.industries.map((ind) => {
                        const isSelected = selectedIndustryIds.includes(ind.id);
                        return (
                          <button
                            type="button"
                            key={ind.id}
                            onClick={() => handleToggleIndustry(ind)}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs transition border ${
                              isSelected
                                ? "bg-white/[0.08] text-foreground border-white/[0.2] font-semibold shadow-sm"
                                : "bg-surface hover:bg-surface-elevated text-foreground border-subtle hover:border-subtle/50"
                            }`}
                          >
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="truncate">{ind.name}</span>
                              <span className="text-[10px] text-muted-foreground truncate">
                                {ind.aliases.slice(0, 2).join(" • ")}
                              </span>
                            </div>
                            
                            <div className="shrink-0">
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-md border border-subtle/50" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-subtle/50 bg-surface-elevated/80 px-5 sm:px-6 py-3">
            <div className="text-xs text-muted-foreground">
              {selectedIndustryIds.length > 0 ? (
                <span className="font-medium text-foreground">
                  <strong className="text-white">{selectedIndustryIds.length}</strong> target industry niche(s) selected
                </span>
              ) : (
                <span>No niche selected (using free-text or general discovery)</span>
              )}
            </div>

            <div className="flex items-center space-x-2 justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/[0.06] rounded-xl transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 bg-primary hover:bg-white text-primary-foreground text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5"
              >
                <span>Done / Apply Selection</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    return createPortal(modalMarkup, document.body);
  };

  return (
    <div className="relative w-full">
      {/* Main Searchable Input Trigger (Opens Modal) */}
      <div 
        className="relative cursor-pointer group"
        onClick={handleOpenModal}
      >
        <input
          ref={triggerInputRef}
          type="text"
          value={value}
          onChange={handleTriggerInputChange}
          onClick={handleOpenModal}
          placeholder={
            placeholder ||
            (mode === "physical"
              ? "Search or select industries (e.g. Plumbers, Auto Repair, Dentists)..."
              : "Search or select job fields (e.g. Software, AI Data, Writing)...")
          }
          disabled={disabled}
          readOnly
          className="w-full bg-surface-subtle border border-subtle/50 rounded-xl pl-4 pr-10 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 cursor-pointer group-hover:border-subtle/50 transition"
        />

        <div className="absolute right-3 top-3 flex items-center space-x-1">
          {value ? (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-muted-foreground hover:text-foreground p-0.5 transition"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenModal}
              className="text-muted-foreground group-hover:text-foreground transition"
              title="Open taxonomy modal"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Render Portal Modal Overlay */}
      {renderModal()}
    </div>
  );
}

