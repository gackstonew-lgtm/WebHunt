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
  SlidersHorizontal,
  Plane,
  Building2,
  Wheat,
  Factory,
  Hammer,
  Car,
  HeartPulse,
  Cpu,
  Landmark,
  Anchor,
  Compass,
  Hotel,
  Shield,
  Briefcase,
  Trees,
  Fish,
  Pickaxe,
  Flame,
  Zap,
  Droplets,
  Boxes,
  ShoppingBag,
  Truck,
  Container,
  Radio,
  Film,
  Megaphone,
  Scale,
  Dna,
  GraduationCap,
  FlaskConical,
  Users,
  Scissors,
  Trophy,
  Palette,
  Calendar,
  Heart,
  Globe,
  Rocket,
  Construction,
  Leaf,
  Crown,
  Wrench,
  Key,
  BarChart3,
  ClipboardCheck,
  Navigation
} from "lucide-react";
import { LeadMode } from "@/lib/types";
import { 
  IndustryDefinition, 
  searchTaxonomy, 
  getCategoriesWithIndustries, 
  getIndustryById,
  getAllSectors
} from "@/lib/taxonomy";

// Map sector icons to Lucide components
function SectorIcon({ name, className = "w-4 h-4" }: { name?: string; className?: string }) {
  switch (name) {
    case "Plane": return <Plane className={className} />;
    case "Wheat": return <Wheat className={className} />;
    case "Trees": return <Trees className={className} />;
    case "Fish": return <Fish className={className} />;
    case "Pickaxe": return <Pickaxe className={className} />;
    case "Flame": return <Flame className={className} />;
    case "Zap": return <Zap className={className} />;
    case "Droplets": return <Droplets className={className} />;
    case "Factory": return <Factory className={className} />;
    case "Hammer": return <Hammer className={className} />;
    case "Building": return <Building2 className={className} />;
    case "Boxes": return <Boxes className={className} />;
    case "ShoppingBag": return <ShoppingBag className={className} />;
    case "Car": return <Car className={className} />;
    case "Truck": return <Truck className={className} />;
    case "Container": return <Container className={className} />;
    case "Anchor": return <Anchor className={className} />;
    case "Compass": return <Compass className={className} />;
    case "Hotel": return <Hotel className={className} />;
    case "Cpu": return <Cpu className={className} />;
    case "Radio": return <Radio className={className} />;
    case "Film": return <Film className={className} />;
    case "Megaphone": return <Megaphone className={className} />;
    case "Landmark": return <Landmark className={className} />;
    case "Shield": return <Shield className={className} />;
    case "Briefcase": return <Briefcase className={className} />;
    case "Scale": return <Scale className={className} />;
    case "HeartPulse": return <HeartPulse className={className} />;
    case "Dna": return <Dna className={className} />;
    case "GraduationCap": return <GraduationCap className={className} />;
    case "FlaskConical": return <FlaskConical className={className} />;
    case "Users": return <Users className={className} />;
    case "Scissors": return <Scissors className={className} />;
    case "Trophy": return <Trophy className={className} />;
    case "Palette": return <Palette className={className} />;
    case "Calendar": return <Calendar className={className} />;
    case "Heart": return <Heart className={className} />;
    case "Globe": return <Globe className={className} />;
    case "Rocket": return <Rocket className={className} />;
    case "Construction": return <Construction className={className} />;
    case "Leaf": return <Leaf className={className} />;
    case "Crown": return <Crown className={className} />;
    case "Wrench": return <Wrench className={className} />;
    case "Key": return <Key className={className} />;
    case "BarChart3": return <BarChart3 className={className} />;
    case "ClipboardCheck": return <ClipboardCheck className={className} />;
    case "Navigation": return <Navigation className={className} />;
    default: return <Layers className={className} />;
  }
}

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

  const allSectors = useMemo(() => {
    return getAllSectors(mode);
  }, [mode]);

  // Set default category tab if not set
  useEffect(() => {
    if (categoryGroups.length > 0 && !selectedCategoryTab) {
      setSelectedCategoryTab(categoryGroups[0].category.id);
    }
  }, [categoryGroups, selectedCategoryTab]);

  // Search results based on live typing in modal
  const searchResults = useMemo(() => {
    return searchTaxonomy(searchQuery, mode, 50);
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

  // Handle selecting all industries in current active category
  const handleSelectAllInSector = (sectorId: string) => {
    const sectorGroup = categoryGroups.find((g) => g.category.id === sectorId);
    if (!sectorGroup) return;

    const sectorIndustryIds = sectorGroup.industries.map((i) => i.id);
    const allSelected = sectorIndustryIds.every((id) => selectedIndustryIds.includes(id));

    let newIds: string[];
    if (allSelected) {
      newIds = selectedIndustryIds.filter((id) => !sectorIndustryIds.includes(id));
    } else {
      newIds = Array.from(new Set([...selectedIndustryIds, ...sectorIndustryIds]));
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

    const activeSectorGroup = categoryGroups.find((g) => g.category.id === selectedCategoryTab);

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
          className="relative w-full max-w-2xl sm:max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-surface border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden text-foreground animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="relative z-10 flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-border bg-surface-elevated">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-primary">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 id="industry-modal-title" className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
                  Target Industry / Business Type
                </h3>
                <p className="text-xs text-muted-foreground">
                  {mode === "physical"
                    ? "Select verified business sectors, categories, and niches for physical discovery"
                    : "Select verified industry fields or enter custom search keywords"}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground hover:bg-surface-subtle p-1.5 rounded-xl transition border border-transparent"
              aria-label="Close modal"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Search Bar */}
          <div className="relative z-10 px-5 sm:px-6 py-3 bg-surface-subtle border-b border-border">
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
                    ? "Search 55+ sectors (e.g. Airports, Agriculture, Mining, Hospitals, Plumbers, SaaS)..."
                    : "Search 55+ industry fields (e.g. Software, AI Data, Writing, Healthcare)..."
                }
                className="w-full bg-surface border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
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
          <div className="relative z-10 flex items-center justify-between border-b border-border bg-surface px-5 sm:px-6 py-2.5 text-xs">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab("search")}
                className={`flex items-center space-x-1.5 py-1.5 px-3.5 rounded-xl font-semibold transition ${
                  activeTab === "search"
                    ? "bg-surface-elevated text-foreground border border-border shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
                }`}
              >
                <Search className="w-3.5 h-3.5 text-primary" />
                <span>Quick Search</span>
                {searchResults.length > 0 && searchQuery && (
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 rounded-full font-bold">
                    {searchResults.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("categories")}
                className={`flex items-center space-x-1.5 py-1.5 px-3.5 rounded-xl font-semibold transition ${
                  activeTab === "categories"
                    ? "bg-surface-elevated text-foreground border border-border shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                <span>Global Sectors Explorer</span>
                <span className="text-[10px] bg-surface-elevated text-muted-foreground px-1.5 py-0.2 rounded-full border border-border">
                  {allSectors.length}
                </span>
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Global Economy Indexed</span>
            </div>
          </div>

          {/* Active Selections Bar inside modal */}
          {selectedIndustries.length > 0 && (
            <div className="relative z-10 px-5 sm:px-6 py-2 bg-surface-subtle border-b border-border flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto">
              <span className="text-[11px] font-medium text-muted-foreground mr-1">Selected:</span>
              {selectedIndustries.map((ind) => (
                <span
                  key={ind.id}
                  className="inline-flex items-center space-x-1.5 bg-surface text-foreground border border-border text-xs font-semibold px-2.5 py-0.5 rounded-xl shadow-xs transition"
                >
                  <span>{ind.name}</span>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveIndustry(ind.id, e)}
                    className="hover:text-primary transition p-0.5 rounded"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={(e) => handleClearAll(e)}
                className="text-[11px] text-primary hover:underline ml-1 font-semibold transition"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Modal Body Content */}
          <div className="relative z-10 flex-1 overflow-hidden flex flex-col min-h-[300px] sm:min-h-[360px]">
            {/* View 1: Quick Search View */}
            {activeTab === "search" && (
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 divide-y divide-border">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <div className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                      <span>{searchQuery ? `Matching Niches (${searchResults.length})` : "Indexed Global Business Niches"}</span>
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {searchResults.map((ind) => {
                        const isSelected = selectedIndustryIds.includes(ind.id);
                        const sector = allSectors.find((s) => s.id === ind.categoryId);

                        return (
                          <button
                            type="button"
                            key={ind.id}
                            onClick={() => handleToggleIndustry(ind)}
                            className={`w-full text-left p-3 rounded-xl flex items-start justify-between transition group border ${
                              isSelected
                                ? "bg-primary/10 text-foreground border-primary/40 shadow-xs"
                                : "bg-surface hover:bg-surface-elevated text-foreground border-border hover:border-border-strong"
                            }`}
                          >
                            <div className="flex flex-col pr-2 min-w-0">
                              <div className="flex items-center space-x-1.5 mb-1">
                                {sector && (
                                  <span className="text-[10px] uppercase font-bold text-primary px-1.5 py-0.2 rounded bg-primary/10 border border-primary/20 truncate">
                                    {sector.name}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-bold text-foreground group-hover:text-primary transition truncate">
                                {ind.name}
                              </span>
                              <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                {ind.aliases.slice(0, 3).join(" • ")}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0 mt-0.5">
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-md border border-border group-hover:border-primary transition" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mx-auto text-muted-foreground">
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
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-border">
                {/* Sector List Sidebar */}
                <div className="sm:col-span-5 max-h-[360px] sm:max-h-none overflow-y-auto p-2 space-y-1 bg-surface-subtle">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Global Sectors ({allSectors.length})
                  </div>
                  {allSectors.map((sector) => {
                    const isSelectedCat = selectedCategoryTab === sector.id;
                    const sectorGroup = categoryGroups.find((g) => g.category.id === sector.id);
                    const industryCount = sectorGroup ? sectorGroup.industries.length : 0;
                    const selectedCountInGroup = sectorGroup 
                      ? sectorGroup.industries.filter((i) => selectedIndustryIds.includes(i.id)).length
                      : 0;

                    return (
                      <button
                        type="button"
                        key={sector.id}
                        onClick={() => setSelectedCategoryTab(sector.id)}
                        className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                          isSelectedCat
                            ? "bg-surface text-foreground font-bold border border-primary/30 shadow-xs"
                            : "text-muted-foreground hover:bg-surface hover:text-foreground border border-transparent"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelectedCat ? "bg-primary text-primary-foreground" : "bg-surface-elevated text-muted-foreground"
                          }`}>
                            <SectorIcon name={sector.icon} className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate">{sector.name}</span>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0 ml-1.5">
                          {selectedCountInGroup > 0 && (
                            <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.2 rounded-full font-bold">
                              {selectedCountInGroup}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground">
                            {industryCount}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-niches in active sector */}
                <div className="sm:col-span-7 max-h-[360px] sm:max-h-none overflow-y-auto p-4 space-y-3 bg-surface">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {allSectors.find((s) => s.id === selectedCategoryTab)?.name || "Sector Categories"}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {allSectors.find((s) => s.id === selectedCategoryTab)?.description || "Verified targeting categories"}
                      </p>
                    </div>

                    {activeSectorGroup && activeSectorGroup.industries.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSelectAllInSector(selectedCategoryTab)}
                        className="text-[11px] font-semibold text-primary hover:underline shrink-0 ml-2"
                      >
                        {activeSectorGroup.industries.every((i) => selectedIndustryIds.includes(i.id))
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {activeSectorGroup && activeSectorGroup.industries.length > 0 ? (
                      activeSectorGroup.industries.map((ind) => {
                        const isSelected = selectedIndustryIds.includes(ind.id);
                        return (
                          <button
                            type="button"
                            key={ind.id}
                            onClick={() => handleToggleIndustry(ind)}
                            className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-xs transition border ${
                              isSelected
                                ? "bg-primary/10 text-foreground border-primary/40 font-semibold shadow-xs"
                                : "bg-surface hover:bg-surface-elevated text-foreground border-border hover:border-border-strong"
                            }`}
                          >
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="font-bold truncate text-foreground">{ind.name}</span>
                              <div className="flex items-center space-x-1.5 text-[10px] text-muted-foreground mt-0.5">
                                {ind.industryGroup && (
                                  <span className="text-primary font-medium">{ind.industryGroup}</span>
                                )}
                                {ind.industryGroup && ind.aliases.length > 0 && <span>•</span>}
                                <span className="truncate">{ind.aliases.slice(0, 2).join(" • ")}</span>
                              </div>
                            </div>
                            
                            <div className="shrink-0">
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-md border border-border group-hover:border-primary transition" />
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-xs text-muted-foreground">
                        No specific sub-niches configured for this sector yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border bg-surface-elevated px-5 sm:px-6 py-3">
            <div className="text-xs text-muted-foreground">
              {selectedIndustryIds.length > 0 ? (
                <span className="font-medium text-foreground">
                  <strong className="text-primary">{selectedIndustryIds.length}</strong> target industry niche(s) selected
                </span>
              ) : (
                <span>No niche selected (using free-text or general discovery)</span>
              )}
            </div>

            <div className="flex items-center space-x-2 justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-surface-subtle rounded-xl transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
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
              ? "Select or search 55+ sectors (e.g. Airports, Agriculture, Hospitals, Plumbers)..."
              : "Select or search 55+ industry fields (e.g. Software, Healthcare, Finance)...")
          }
          disabled={disabled}
          readOnly
          className="w-full bg-surface border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer group-hover:border-border-strong transition"
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
