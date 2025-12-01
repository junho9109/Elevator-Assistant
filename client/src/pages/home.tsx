import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import structureImg from "@assets/structure_1764142259144.png";
import { cn } from "@/lib/utils";
import { 
  Info, 
  CheckCircle2,
  Search,
  Plus,
  Pencil,
  Trash2,
  Settings2,
  X,
  Upload,
  List
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  useCategories, 
  useStandards, 
  useHotspots,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateStandard,
  useUpdateStandard,
  useDeleteStandard,
  useCreateHotspot,
  useUpdateHotspot,
  useDeleteHotspot
} from "@/lib/api";
import type { Standard, Category, Hotspot } from "@shared/schema";

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 }
  })
};

export default function Home() {
  // Fetch data from API
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: standards = [], isLoading: standardsLoading } = useStandards();
  const { data: hotspots = [], isLoading: hotspotsLoading } = useHotspots();

  // Mutations
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const createStandard = useCreateStandard();
  const updateStandard = useUpdateStandard();
  const deleteStandard = useDeleteStandard();
  const createHotspot = useCreateHotspot();
  const updateHotspot = useUpdateHotspot();
  const deleteHotspot = useDeleteHotspot();

  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Dialog States
  const [isAddStandardOpen, setIsAddStandardOpen] = useState(false);
  const [isViewStandardOpen, setIsViewStandardOpen] = useState(false);
  const [isEditStandardOpen, setIsEditStandardOpen] = useState(false);
  const [isHotspotDialogOpen, setIsHotspotDialogOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  
  const [editingHotspotId, setEditingHotspotId] = useState<number | null>(null);
  const [pendingHotspotPos, setPendingHotspotPos] = useState<{top: string, left: string} | null>(null);
  
  // Form States
  const [newItem, setNewItem] = useState({
    title: "",
    standardNumber: "",
    body: "",
    categoryId: categories[0]?.id || 1,
    imageUrl: "",
    inspectionDate: "",
    permitDate: ""
  });

  const [editingItem, setEditingItem] = useState<Standard & { categoryId: number } | null>(null);
  
  const [hotspotForm, setHotspotForm] = useState({
    label: "",
    categoryId: categories[0]?.id || 1
  });

  const [newCategoryForm, setNewCategoryForm] = useState({
    key: "",
    title: "",
    description: ""
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Set initial active section when categories load
  useState(() => {
    if (categories.length > 0 && activeSection === null) {
      setActiveSection(categories[0].id);
    }
  });

  // Handle section change
  const handleSectionChange = (categoryId: number) => {
    setActiveSection(categoryId);
    setSearchTerm(""); 
  };

  // Handle moving an item
  const handleMoveItem = (standardId: number, toCategoryId: number) => {
    updateStandard.mutate({ id: standardId, standard: { categoryId: toCategoryId } });
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit && editingItem) {
          setEditingItem({ ...editingItem, imageUrl: reader.result as string || null });
        } else {
          setNewItem(prev => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Adding New Standard
  const handleAddStandard = () => {
    if (!newItem.title || !newItem.body) return;

    createStandard.mutate({
      categoryId: newItem.categoryId,
      title: newItem.title,
      standardNumber: newItem.standardNumber || null,
      body: newItem.body,
      imageUrl: newItem.imageUrl || null,
      permitDate: newItem.permitDate || null,
      inspectionDate: newItem.inspectionDate || null,
    }, {
      onSuccess: () => {
        setIsAddStandardOpen(false);
        setNewItem({ 
          title: "", 
          standardNumber: "", 
          body: "", 
          categoryId: newItem.categoryId, 
          imageUrl: "",
          inspectionDate: "",
          permitDate: ""
        });
        setActiveSection(newItem.categoryId);
      }
    });
  };

  // Handle View Standard
  const handleOpenViewStandard = (standard: Standard) => {
    setEditingItem({ ...standard, categoryId: standard.categoryId });
    setIsViewStandardOpen(true);
  };

  // Switch to Edit Mode from View Mode
  const handleSwitchToEditMode = () => {
    setIsViewStandardOpen(false);
    setIsEditStandardOpen(true);
  };

  // Handle Update Standard
  const handleUpdateStandard = () => {
    if (!editingItem || !editingItem.title || !editingItem.body) return;

    updateStandard.mutate({
      id: editingItem.id,
      standard: {
        title: editingItem.title,
        standardNumber: editingItem.standardNumber || null,
        body: editingItem.body,
        imageUrl: editingItem.imageUrl || null,
        permitDate: editingItem.permitDate || null,
        inspectionDate: editingItem.inspectionDate || null,
        categoryId: editingItem.categoryId
      }
    }, {
      onSuccess: () => {
        setIsEditStandardOpen(false);
        setEditingItem(null);
      }
    });
  };

  const handleDeleteStandard = () => {
    if (!editingItem) return;
    
    const confirmDelete = window.confirm("정말 이 항목을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    deleteStandard.mutate(editingItem.id, {
      onSuccess: () => {
        setIsEditStandardOpen(false);
        setEditingItem(null);
      }
    });
  };

  // Handle Category Management
  const handleAddCategory = () => {
    if (!newCategoryForm.title) return;
    
    const key = newCategoryForm.key || `cat_${Date.now()}`;
    
    createCategory.mutate({
      key,
      title: newCategoryForm.title,
      description: newCategoryForm.description || "설명이 없습니다.",
    }, {
      onSuccess: () => {
        setNewCategoryForm({ key: "", title: "", description: "" });
      }
    });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.title) return;

    updateCategory.mutate({
      id: editingCategory.id,
      category: {
        title: editingCategory.title,
        description: editingCategory.description
      }
    }, {
      onSuccess: () => {
        setIsEditCategoryDialogOpen(false);
        setEditingCategory(null);
      }
    });
  };

  const handleDeleteCategory = (catId: number) => {
    if (categories.length <= 1) {
      alert("최소 하나의 카테고리는 존재해야 합니다.");
      return;
    }
    
    const confirmDelete = window.confirm("정말 이 카테고리를 삭제하시겠습니까? 포함된 모든 기준 항목이 삭제됩니다.");
    if (!confirmDelete) return;

    deleteCategory.mutate(catId, {
      onSuccess: () => {
        if (activeSection === catId) {
          const remainingCategories = categories.filter(c => c.id !== catId);
          if (remainingCategories.length > 0) {
            setActiveSection(remainingCategories[0].id);
          }
        }
      }
    });
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsEditCategoryDialogOpen(true);
  };

  // Handle Image Click (Add Hotspot)
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode || !containerRef.current) return;
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const left = `${(x / rect.width) * 100}%`;
    const top = `${(y / rect.height) * 100}%`;

    setPendingHotspotPos({ top, left });
    setEditingHotspotId(null);
    setHotspotForm({ label: "", categoryId: activeSection || categories[0]?.id || 1 });
    setIsHotspotDialogOpen(true);
  };

  // Handle Edit Hotspot Click
  const handleEditHotspotClick = (hotspot: Hotspot, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingHotspotId(hotspot.id);
    setHotspotForm({ label: hotspot.label, categoryId: hotspot.categoryId });
    setPendingHotspotPos(null);
    setIsHotspotDialogOpen(true);
  };

  // Handle Save Hotspot (Add or Update)
  const handleSaveHotspot = () => {
    if (!hotspotForm.label) return;

    if (editingHotspotId) {
      updateHotspot.mutate({
        id: editingHotspotId,
        hotspot: {
          label: hotspotForm.label,
          categoryId: hotspotForm.categoryId
        }
      }, {
        onSuccess: () => {
          setIsHotspotDialogOpen(false);
          setHotspotForm({ label: "", categoryId: activeSection || categories[0]?.id || 1 });
          setEditingHotspotId(null);
        }
      });
    } else if (pendingHotspotPos) {
      createHotspot.mutate({
        label: hotspotForm.label,
        top: pendingHotspotPos.top,
        left: pendingHotspotPos.left,
        categoryId: hotspotForm.categoryId
      }, {
        onSuccess: () => {
          setIsHotspotDialogOpen(false);
          setHotspotForm({ label: "", categoryId: activeSection || categories[0]?.id || 1 });
          setPendingHotspotPos(null);
        }
      });
    }
  };

  // Handle Drag End
  const handleDragEnd = (id: number, info: any) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = info.point.x - rect.left;
    const y = info.point.y - rect.top;

    const leftVal = (x / rect.width) * 100;
    const topVal = (y / rect.height) * 100;
    
    const clampedLeft = Math.max(0, Math.min(100, leftVal));
    const clampedTop = Math.max(0, Math.min(100, topVal));

    updateHotspot.mutate({
      id,
      hotspot: {
        left: `${clampedLeft}%`,
        top: `${clampedTop}%`
      }
    });
  };

  // Handle Delete Hotspot
  const handleDeleteHotspot = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHotspot.mutate(id);
  };

  // Derived state for display
  const isSearching = searchTerm.length > 0;

  const displayItems = useMemo(() => {
    if (isSearching) {
      return standards.filter(standard => 
        standard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        standard.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (standard.standardNumber && standard.standardNumber.includes(searchTerm))
      );
    } else {
      if (!activeSection) return [];
      return standards.filter(s => s.categoryId === activeSection);
    }
  }, [standards, activeSection, searchTerm, isSearching]);

  const currentCategory = categories.find(c => c.id === activeSection);
  const standardsByCategoryCount = useMemo(() => {
    const counts: Record<number, number> = {};
    standards.forEach(s => {
      counts[s.categoryId] = (counts[s.categoryId] || 0) + 1;
    });
    return counts;
  }, [standards]);

  if (categoriesLoading || standardsLoading || hotspotsLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans text-foreground">
      <div className="mx-auto max-w-7xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[800px]">
          
          {/* Left Panel: Structure & Navigation */}
          <div className="lg:col-span-5 bg-slate-50/50 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-border flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
                  E
                </div>
                <h1 className="text-2xl font-bold tracking-tight">기술자료조회</h1>
              </div>
              <p className="text-muted-foreground text-sm pl-[52px]">
                버튼을 눌러 관련 표준화를 확인하세요
              </p>
            </div>

            {/* Edit Mode Toggle & Category Manager */}
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Settings2 className="w-4 h-4 text-slate-400" />
                  <span>구조도 편집 모드</span>
                </div>
                <Switch 
                  checked={isEditMode}
                  onCheckedChange={setIsEditMode}
                />
              </div>

              <Dialog open={isCategoryManagerOpen} onOpenChange={setIsCategoryManagerOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-white border-slate-200 hover:bg-slate-50" data-testid="button-category-manager">
                    <span className="flex items-center gap-2 text-slate-600">
                      <List className="w-4 h-4" />
                      카테고리 관리
                    </span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-mono">
                      {categories.length}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>카테고리 관리</DialogTitle>
                  </DialogHeader>

                  <div className="py-4 space-y-6">
                    {/* Create New */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                      <h4 className="text-sm font-medium text-slate-700">새 카테고리 생성</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Input 
                          placeholder="카테고리명 (예: 로프)" 
                          className="sm:col-span-1 bg-white"
                          value={newCategoryForm.title}
                          onChange={(e) => setNewCategoryForm({...newCategoryForm, title: e.target.value})}
                          data-testid="input-new-category-title"
                        />
                        <Input 
                          placeholder="설명 (선택사항)" 
                          className="sm:col-span-2 bg-white"
                          value={newCategoryForm.description}
                          onChange={(e) => setNewCategoryForm({...newCategoryForm, description: e.target.value})}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddCategory();
                          }}
                          data-testid="input-new-category-description"
                        />
                      </div>
                      <Button size="sm" onClick={handleAddCategory} className="w-full sm:w-auto" data-testid="button-add-category">
                        <Plus className="w-4 h-4 mr-1" /> 추가하기
                      </Button>
                    </div>

                    {/* List */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {categories.map(category => (
                        <div key={category.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors" data-testid={`category-item-${category.id}`}>
                          <div className="min-w-0 flex-1 mr-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900 truncate">
                                {category.title}
                              </span>
                              <Badge variant="secondary" className="text-[10px] h-5 font-mono text-slate-400">
                                Items: {standardsByCategoryCount[category.id] || 0}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {category.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-slate-400 hover:text-blue-600"
                              onClick={() => openEditCategory(category)}
                              data-testid={`button-edit-category-${category.id}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-slate-400 hover:text-red-600"
                              onClick={() => handleDeleteCategory(category.id)}
                              data-testid={`button-delete-category-${category.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setIsCategoryManagerOpen(false)}>닫기</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Interactive Structure Diagram */}
            <div 
              ref={containerRef}
              className={cn(
                "relative w-full aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-inner mb-6 group select-none",
                isEditMode && "cursor-crosshair ring-2 ring-offset-2 ring-primary/50"
              )}
              onClick={handleImageClick}
            >
              <img 
                ref={imageRef}
                src={structureImg} 
                alt="Elevator Structure" 
                className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              />
              
              {/* Hotspots */}
              {hotspots.map(hotspot => (
                <motion.div
                  key={`${hotspot.id}-${hotspot.top}-${hotspot.left}`}
                  drag={isEditMode}
                  dragMomentum={false}
                  onDragEnd={(_, info) => handleDragEnd(hotspot.id, info)}
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 z-10",
                    isEditMode ? "cursor-move" : "cursor-pointer"
                  )}
                  style={{ top: hotspot.top, left: hotspot.left }}
                  onClick={() => !isEditMode && handleSectionChange(hotspot.categoryId)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`hotspot-${hotspot.id}`}
                >
                  <div className={cn(
                    "relative px-3 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm border-2 transition-all duration-300",
                    activeSection === hotspot.categoryId
                      ? "bg-primary text-primary-foreground border-white scale-110"
                      : "bg-slate-900/70 text-white border-slate-700 hover:bg-primary/90 hover:border-white"
                  )}>
                    {hotspot.label}
                    {isEditMode && (
                      <div className="absolute -top-2 -right-2 flex gap-1">
                        <button
                          onClick={(e) => handleEditHotspotClick(hotspot, e)}
                          className="w-5 h-5 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-md"
                          data-testid={`button-edit-hotspot-${hotspot.id}`}
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteHotspot(hotspot.id, e)}
                          className="w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md"
                          data-testid={`button-delete-hotspot-${hotspot.id}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isEditMode && (
                <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium shadow-lg border border-white/20">
                  클릭하여 핫스팟 추가
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="mt-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input 
                  placeholder="검사 기준 검색 (예: 조명, 틈새)..." 
                  className="pl-9 bg-white border-slate-200 focus-visible:ring-primary h-11 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              {isSearching && (
                <p className="text-xs text-slate-500 mt-2 pl-1 flex items-center gap-1.5">
                  <Info className="w-3 h-3" />
                  "{searchTerm}" 검색 결과: {displayItems.length}건
                </p>
              )}
            </div>
          </div>

          {/* Right Panel: Content Details */}
          <div className="lg:col-span-7 p-6 lg:p-10 bg-white flex flex-col">
            {/* Header & Actions */}
            <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-100">
              <div className="flex-1">
                {isSearching ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                      검색 결과
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-mono font-medium tracking-wide">
                        SEARCH
                      </span>
                    </h2>
                    <p className="text-slate-500 mt-2">
                       전체 섹션에서 "{searchTerm}" 검색 결과입니다.
                    </p>
                  </motion.div>
                ) : (
                  <div>
                    {currentCategory ? (
                      <>
                        <motion.h2 
                          key={currentCategory.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-3xl font-bold text-slate-900 flex items-center gap-3"
                        >
                          {currentCategory.title}
                          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-mono font-medium tracking-wide">
                            {currentCategory.key.toUpperCase()}
                          </span>
                        </motion.h2>
                        <motion.p 
                          key={currentCategory.description}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-slate-500 mt-2 leading-relaxed max-w-2xl"
                        >
                          {currentCategory.description}
                        </motion.p>
                      </>
                    ) : (
                      <div className="text-slate-400 italic">카테고리를 선택하세요</div>
                    )}
                  </div>
                )}
              </div>

              {/* Add Standard Button */}
              <Dialog open={isAddStandardOpen} onOpenChange={setIsAddStandardOpen}>
                <DialogTrigger asChild>
                  <Button className="shrink-0 gap-2 shadow-md hover:shadow-lg transition-all" data-testid="button-add-standard">
                    <Plus className="w-4 h-4" />
                    표준화 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>새 표준화 기준 추가</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="section">카테고리</Label>
                      <Select 
                        value={String(newItem.categoryId)} 
                        onValueChange={(val) => setNewItem({...newItem, categoryId: parseInt(val)})}
                      >
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={String(category.id)}>
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="title">항목명 (Title)</Label>
                      <Input 
                        id="title" 
                        placeholder="예: 비상통화장치 작동시험" 
                        value={newItem.title}
                        onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                        data-testid="input-standard-title"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="std">기준 번호</Label>
                        <Input 
                          id="std" 
                          placeholder="예: 14.2.3" 
                          value={newItem.standardNumber}
                          onChange={(e) => setNewItem({...newItem, standardNumber: e.target.value})}
                          data-testid="input-standard-number"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="permitDate">건축허가일 (선택)</Label>
                        <Input 
                          id="permitDate" 
                          type="date"
                          value={newItem.permitDate}
                          onChange={(e) => setNewItem({...newItem, permitDate: e.target.value})}
                          data-testid="input-permit-date"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="inspectionDate">검사기준적용일 (선택)</Label>
                      <Input 
                        id="inspectionDate" 
                        type="date"
                        value={newItem.inspectionDate}
                        onChange={(e) => setNewItem({...newItem, inspectionDate: e.target.value})}
                        data-testid="input-inspection-date"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="body">세부 내용</Label>
                      <Textarea 
                        id="body" 
                        placeholder="검사 기준 상세 내용을 입력하세요..." 
                        className="h-24 resize-none"
                        value={newItem.body}
                        onChange={(e) => setNewItem({...newItem, body: e.target.value})}
                        data-testid="input-standard-body"
                      />
                    </div>
                    
                    {/* Image Upload Field */}
                    <div className="grid gap-2">
                      <Label htmlFor="image">사진 첨부 (선택사항)</Label>
                      <div className="flex items-center gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-dashed border-2 h-12 text-slate-500 hover:text-primary hover:border-primary hover:bg-blue-50"
                          data-testid="button-upload-image"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {newItem.imageUrl ? "사진 변경하기" : "이미지 업로드"}
                        </Button>
                        <input 
                          ref={fileInputRef}
                          id="image" 
                          type="file" 
                          accept="image/*" 
                          className="hidden"
                          onChange={(e) => handleFileChange(e, false)}
                        />
                      </div>
                      {newItem.imageUrl && (
                        <div className="mt-2 relative w-full h-32 bg-slate-100 rounded-md overflow-hidden border border-slate-200">
                          <img src={newItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 h-6 w-6 rounded-full"
                            onClick={() => setNewItem(prev => ({ ...prev, imageUrl: "" }))}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddStandardOpen(false)}>취소</Button>
                    <Button onClick={handleAddStandard} data-testid="button-submit-standard">추가하기</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSearching ? "search" : activeSection}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                  }}
                  className="grid gap-4"
                >
                  {displayItems.map((standard, index) => (
                    <motion.div
                      key={`${standard.id}-${index}`}
                      variants={cardVariants}
                      custom={index}
                      layout
                      onClick={() => handleOpenViewStandard(standard)}
                      className="group p-5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 relative cursor-pointer hover:shadow-md"
                      data-testid={`standard-card-${standard.id}`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3 pr-8">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <h3 className="font-semibold text-slate-900 text-lg leading-snug">
                            {standard.title}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-500 text-xs font-mono font-bold shadow-sm group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                            {standard.standardNumber || "N/A"}
                          </span>
                          {isSearching && (
                            <Badge variant="outline" className="text-[10px] font-normal text-slate-400">
                              {categories.find(c => c.id === standard.categoryId)?.title}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="pl-8 border-l-2 border-slate-200 group-hover:border-blue-200 transition-colors">
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">
                          {standard.body}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          {!isSearching && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                  data-testid={`button-move-standard-${standard.id}`}
                                >
                                  다른 카테고리로 이동
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {categories.filter(c => c.id !== standard.categoryId).map(cat => (
                                  <DropdownMenuItem 
                                    key={cat.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveItem(standard.id, cat.id);
                                    }}
                                  >
                                    {cat.title}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* View Standard Dialog */}
      <Dialog open={isViewStandardOpen} onOpenChange={setIsViewStandardOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-8">
              <span>{editingItem?.title}</span>
              <Badge variant="outline" className="font-mono">
                {editingItem?.standardNumber || "N/A"}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {editingItem?.imageUrl && (
              <div className="w-full rounded-lg overflow-hidden border border-slate-200">
                <img src={editingItem.imageUrl} alt={editingItem.title} className="w-full object-cover max-h-64" />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-slate-500 text-xs">세부 내용</Label>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {editingItem?.body}
              </p>
            </div>
            {(editingItem?.permitDate || editingItem?.inspectionDate) && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                {editingItem?.permitDate && (
                  <div className="space-y-1">
                    <Label className="text-slate-500 text-xs">건축허가일</Label>
                    <p className="text-slate-700 text-sm font-mono">{editingItem.permitDate}</p>
                  </div>
                )}
                {editingItem?.inspectionDate && (
                  <div className="space-y-1">
                    <Label className="text-slate-500 text-xs">검사기준적용일</Label>
                    <p className="text-slate-700 text-sm font-mono">{editingItem.inspectionDate}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewStandardOpen(false)}>닫기</Button>
            <Button onClick={handleSwitchToEditMode} data-testid="button-edit-from-view">
              <Pencil className="w-4 h-4 mr-2" />
              수정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Standard Dialog */}
      <Dialog open={isEditStandardOpen} onOpenChange={setIsEditStandardOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>표준화 기준 수정</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">항목명</Label>
                <Input 
                  id="edit-title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  data-testid="input-edit-title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-std">기준 번호</Label>
                  <Input 
                    id="edit-std"
                    value={editingItem.standardNumber || ""}
                    onChange={(e) => setEditingItem({...editingItem, standardNumber: e.target.value})}
                    data-testid="input-edit-std"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-permitDate">건축허가일</Label>
                  <Input 
                    id="edit-permitDate"
                    type="date"
                    value={editingItem.permitDate || ""}
                    onChange={(e) => setEditingItem({...editingItem, permitDate: e.target.value})}
                    data-testid="input-edit-permit-date"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-inspectionDate">검사기준적용일</Label>
                <Input 
                  id="edit-inspectionDate"
                  type="date"
                  value={editingItem.inspectionDate || ""}
                  onChange={(e) => setEditingItem({...editingItem, inspectionDate: e.target.value})}
                  data-testid="input-edit-inspection-date"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-body">세부 내용</Label>
                <Textarea 
                  id="edit-body"
                  className="h-24 resize-none"
                  value={editingItem.body}
                  onChange={(e) => setEditingItem({...editingItem, body: e.target.value})}
                  data-testid="input-edit-body"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">사진</Label>
                <div className="flex items-center gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => editFileInputRef.current?.click()}
                    className="w-full border-dashed border-2 h-12"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {editingItem.imageUrl ? "사진 변경하기" : "이미지 업로드"}
                  </Button>
                  <input 
                    ref={editFileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={(e) => handleFileChange(e, true)}
                  />
                </div>
                {editingItem.imageUrl && (
                  <div className="mt-2 relative w-full h-32 bg-slate-100 rounded-md overflow-hidden border border-slate-200">
                    <img src={editingItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => setEditingItem({...editingItem, imageUrl: null})}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteStandard} data-testid="button-delete-standard">
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </Button>
            <Button variant="outline" onClick={() => setIsEditStandardOpen(false)}>취소</Button>
            <Button onClick={handleUpdateStandard} data-testid="button-update-standard">저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hotspot Dialog */}
      <Dialog open={isHotspotDialogOpen} onOpenChange={setIsHotspotDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHotspotId ? "핫스팟 수정" : "새 핫스팟 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>라벨</Label>
              <Input 
                placeholder="예: 기계실"
                value={hotspotForm.label}
                onChange={(e) => setHotspotForm({...hotspotForm, label: e.target.value})}
                data-testid="input-hotspot-label"
              />
            </div>
            <div className="grid gap-2">
              <Label>연결된 카테고리</Label>
              <Select 
                value={String(hotspotForm.categoryId)} 
                onValueChange={(val) => setHotspotForm({...hotspotForm, categoryId: parseInt(val)})}
              >
                <SelectTrigger data-testid="select-hotspot-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHotspotDialogOpen(false)}>취소</Button>
            <Button onClick={handleSaveHotspot} data-testid="button-save-hotspot">저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>카테고리 수정</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>카테고리명</Label>
                <Input 
                  value={editingCategory.title}
                  onChange={(e) => setEditingCategory({...editingCategory, title: e.target.value})}
                  data-testid="input-edit-category-title"
                />
              </div>
              <div className="grid gap-2">
                <Label>설명</Label>
                <Textarea 
                  className="h-20 resize-none"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  data-testid="input-edit-category-description"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>취소</Button>
            <Button onClick={handleUpdateCategory} data-testid="button-update-category">저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
