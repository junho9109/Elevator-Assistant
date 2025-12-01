import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ELEVATOR_DATA, type SectionData, type InspectionItem } from "@/lib/elevator-data";
import structureImg from "@assets/structure_1764142259144.png";
import { cn } from "@/lib/utils";
import { 
  Info, 
  CheckCircle2,
  AlertCircle,
  Search,
  MoreHorizontal,
  FolderInput,
  Plus,
  Pencil,
  Trash2,
  Settings2,
  MapPin,
  X,
  Image as ImageIcon,
  Upload,
  Calendar,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

// Types
interface HotspotItem {
  id: string;
  label: string;
  top: string;
  left: string;
  sectionId: string;
}

const INITIAL_HOTSPOTS: HotspotItem[] = [
  { id: 'h1', label: "기계실", top: "10%", left: "50%", sectionId: 'machine' },
  { id: 'h2', label: "카 상부", top: "35%", left: "55%", sectionId: 'car' },
  { id: 'h3', label: "승강로", top: "40%", left: "20%", sectionId: 'shaft' },
  { id: 'h4', label: "카 내", top: "55%", left: "55%", sectionId: 'car' },
  { id: 'h5', label: "피트", top: "80%", left: "50%", sectionId: 'pit' },
];

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
  const [activeSection, setActiveSection] = useState<string>("machine");
  const [data, setData] = useState<Record<string, SectionData>>(ELEVATOR_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Hotspot State
  const [hotspots, setHotspots] = useState<HotspotItem[]>(INITIAL_HOTSPOTS);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Dialog States
  const [isAddStandardOpen, setIsAddStandardOpen] = useState(false);
  const [isViewStandardOpen, setIsViewStandardOpen] = useState(false);
  const [isEditStandardOpen, setIsEditStandardOpen] = useState(false);
  const [isHotspotDialogOpen, setIsHotspotDialogOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  
  const [editingHotspotId, setEditingHotspotId] = useState<string | null>(null);
  const [pendingHotspotPos, setPendingHotspotPos] = useState<{top: string, left: string} | null>(null);
  
  // Form States
  const [newItem, setNewItem] = useState<InspectionItem & { sectionId: string }>({
    title: "",
    std: "",
    body: "",
    sectionId: "machine",
    imageUrl: "",
    inspectionDate: "",
    permitDate: ""
  });

  // Viewing/Editing Item State
  const [editingItem, setEditingItem] = useState<InspectionItem & { sectionId: string, originalTitle: string }>({
    title: "",
    std: "",
    body: "",
    sectionId: "machine",
    imageUrl: "",
    inspectionDate: "",
    permitDate: "",
    originalTitle: ""
  });
  
  const [hotspotForm, setHotspotForm] = useState({
    label: "",
    sectionId: "machine"
  });

  const [newCategoryForm, setNewCategoryForm] = useState({
    id: "",
    title: "",
    desc: ""
  });

  const [editingCategory, setEditingCategory] = useState<SectionData | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Handle section change
  const handleSectionChange = (sectionId: string) => {
    if (data[sectionId]) {
        setActiveSection(sectionId);
        setSearchTerm(""); 
    }
  };

  // Handle moving an item
  const handleMoveItem = (itemId: string, fromSectionId: string, toSectionId: string) => {
    setData(prev => {
      const newData = { ...prev };
      const sourceItems = [...newData[fromSectionId].items];
      const itemIndex = sourceItems.findIndex(item => item.title === itemId);
      
      if (itemIndex === -1) return prev;

      const [itemToMove] = sourceItems.splice(itemIndex, 1);
      const targetItems = [...newData[toSectionId].items];
      targetItems.push(itemToMove);

      newData[fromSectionId] = { ...newData[fromSectionId], items: sourceItems };
      newData[toSectionId] = { ...newData[toSectionId], items: targetItems };

      return newData;
    });
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
            setEditingItem(prev => ({ ...prev, imageUrl: reader.result as string }));
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

    // Ensure section exists, fallback to current active if not
    const targetSectionId = data[newItem.sectionId] ? newItem.sectionId : activeSection;

    setData(prev => {
      const newData = { ...prev };
      const targetSection = newData[targetSectionId];
      
      const updatedItems = [{
        title: newItem.title,
        std: newItem.std,
        body: newItem.body,
        imageUrl: newItem.imageUrl,
        inspectionDate: newItem.inspectionDate,
        permitDate: newItem.permitDate
      }, ...targetSection.items];

      newData[targetSectionId] = {
        ...targetSection,
        items: updatedItems
      };

      return newData;
    });

    setIsAddStandardOpen(false);
    setNewItem({ 
      title: "", 
      std: "", 
      body: "", 
      sectionId: targetSectionId, 
      imageUrl: "",
      inspectionDate: "",
      permitDate: ""
    });
    
    setActiveSection(targetSectionId);
  };

  // Handle View Standard
  const handleOpenViewStandard = (item: InspectionItem, sectionId: string) => {
    setEditingItem({
        ...item,
        sectionId,
        originalTitle: item.title
    });
    setIsViewStandardOpen(true);
  };

  // Switch to Edit Mode from View Mode
  const handleSwitchToEditMode = () => {
      setIsViewStandardOpen(false);
      setIsEditStandardOpen(true);
  };

  // Handle Update Standard
  const handleUpdateStandard = () => {
      if (!editingItem.title || !editingItem.body) return;

      setData(prev => {
          const newData = { ...prev };
          const section = newData[editingItem.sectionId];
          
          // Map items and update the matching one
          const updatedItems = section.items.map(item => {
              if (item.title === editingItem.originalTitle) {
                  return {
                      title: editingItem.title,
                      std: editingItem.std,
                      body: editingItem.body,
                      imageUrl: editingItem.imageUrl,
                      inspectionDate: editingItem.inspectionDate,
                      permitDate: editingItem.permitDate
                  };
              }
              return item;
          });

          newData[editingItem.sectionId] = {
              ...section,
              items: updatedItems
          };

          return newData;
      });

      setIsEditStandardOpen(false);
  };

  const handleDeleteStandard = () => {
      const confirmDelete = window.confirm("정말 이 항목을 삭제하시겠습니까?");
      if (!confirmDelete) return;

      setData(prev => {
          const newData = { ...prev };
          const section = newData[editingItem.sectionId];
          
          // Filter out the item
          const updatedItems = section.items.filter(item => item.title !== editingItem.originalTitle);

          newData[editingItem.sectionId] = {
              ...section,
              items: updatedItems
          };

          return newData;
      });

      setIsEditStandardOpen(false);
  };


  // Handle Category Management
  const handleAddCategory = () => {
    if (!newCategoryForm.title) return;
    
    const newId = `cat_${Date.now()}`;
    
    setData(prev => ({
        ...prev,
        [newId]: {
            id: newId,
            title: newCategoryForm.title,
            desc: newCategoryForm.desc || "설명이 없습니다.",
            items: []
        }
    }));
    
    setNewCategoryForm({ id: "", title: "", desc: "" });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.title) return;

    setData(prev => ({
        ...prev,
        [editingCategory.id]: {
            ...prev[editingCategory.id],
            title: editingCategory.title,
            desc: editingCategory.desc
        }
    }));

    setIsEditCategoryDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (catId: string) => {
    if (Object.keys(data).length <= 1) {
        alert("최소 하나의 카테고리는 존재해야 합니다.");
        return;
    }
    
    const confirmDelete = window.confirm("정말 이 카테고리를 삭제하시겠습니까? 포함된 모든 기준 항목이 삭제됩니다.");
    if (!confirmDelete) return;

    setData(prev => {
        const newData = { ...prev };
        delete newData[catId];
        return newData;
    });

    // If deleted active section, switch to another
    if (activeSection === catId) {
        const remainingIds = Object.keys(data).filter(id => id !== catId);
        if (remainingIds.length > 0) {
            setActiveSection(remainingIds[0]);
        }
    }
    
    setHotspots(prev => prev.filter(h => h.sectionId !== catId));
  };

  const openEditCategory = (cat: SectionData) => {
      setEditingCategory({ ...cat });
      setIsEditCategoryDialogOpen(true);
  };

  // Handle Image Click (Add Hotspot)
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode || !containerRef.current) return;
    // Only proceed if directly clicking the container (not a button)
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const left = `${(x / rect.width) * 100}%`;
    const top = `${(y / rect.height) * 100}%`;

    setPendingHotspotPos({ top, left });
    setEditingHotspotId(null); // New mode
    setHotspotForm({ label: "", sectionId: activeSection });
    setIsHotspotDialogOpen(true);
  };

  // Handle Edit Click
  const handleEditHotspotClick = (hotspot: HotspotItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingHotspotId(hotspot.id);
    setHotspotForm({ label: hotspot.label, sectionId: hotspot.sectionId });
    setPendingHotspotPos(null);
    setIsHotspotDialogOpen(true);
  };

  // Handle Save Hotspot (Add or Update)
  const handleSaveHotspot = () => {
    if (!hotspotForm.label) return;

    if (editingHotspotId) {
      // Update existing
      setHotspots(prev => prev.map(h => 
        h.id === editingHotspotId 
          ? { ...h, label: hotspotForm.label, sectionId: hotspotForm.sectionId }
          : h
      ));
    } else if (pendingHotspotPos) {
      // Add new
      const newHotspot: HotspotItem = {
        id: `h-${Date.now()}`,
        label: hotspotForm.label,
        top: pendingHotspotPos.top,
        left: pendingHotspotPos.left,
        sectionId: hotspotForm.sectionId
      };
      setHotspots(prev => [...prev, newHotspot]);
    }

    setIsHotspotDialogOpen(false);
    setHotspotForm({ label: "", sectionId: activeSection });
    setPendingHotspotPos(null);
    setEditingHotspotId(null);
  };

  // Handle Drag End
  const handleDragEnd = (id: string, info: any) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate new position relative to container
    // info.point is absolute, so subtract container offset
    const x = info.point.x - rect.left;
    const y = info.point.y - rect.top;

    // Convert to percentage
    const leftVal = (x / rect.width) * 100;
    const topVal = (y / rect.height) * 100;
    
    // Clamp values to 0-100
    const clampedLeft = Math.max(0, Math.min(100, leftVal));
    const clampedTop = Math.max(0, Math.min(100, topVal));

    setHotspots(prev => prev.map(h => 
      h.id === id 
        ? { ...h, left: `${clampedLeft}%`, top: `${clampedTop}%` }
        : h
    ));
  };

  // Handle Delete Hotspot
  const handleDeleteHotspot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHotspots(prev => prev.filter(h => h.id !== id));
  };

  // Derived state for display
  const isSearching = searchTerm.length > 0;

  const displayItems = useMemo(() => {
    if (isSearching) {
      const results: Array<{ item: InspectionItem; sectionId: string }> = [];
      Object.values(data).forEach(section => {
        section.items.forEach(item => {
          if (
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.std.includes(searchTerm)
          ) {
            results.push({ item, sectionId: section.id });
          }
        });
      });
      return results;
    } else {
        if (!data[activeSection]) return [];
      return data[activeSection].items.map(item => ({ item, sectionId: activeSection }));
    }
  }, [data, activeSection, searchTerm, isSearching]);

  const currentSectionInfo = data[activeSection];

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
                        <Button variant="outline" className="w-full justify-between bg-white border-slate-200 hover:bg-slate-50">
                            <span className="flex items-center gap-2 text-slate-600">
                                <List className="w-4 h-4" />
                                카테고리 관리
                            </span>
                            <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-mono">
                                {Object.keys(data).length}
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
                                    />
                                    <Input 
                                        placeholder="설명 (선택사항)" 
                                        className="sm:col-span-2 bg-white"
                                        value={newCategoryForm.desc}
                                        onChange={(e) => setNewCategoryForm({...newCategoryForm, desc: e.target.value})}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddCategory();
                                        }}
                                    />
                                </div>
                                <Button size="sm" onClick={handleAddCategory} className="w-full sm:w-auto">
                                    <Plus className="w-4 h-4 mr-1" /> 추가하기
                                </Button>
                            </div>

                            {/* List */}
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                                {Object.values(data).map(category => (
                                    <div key={category.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="min-w-0 flex-1 mr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-900 truncate">
                                                    {category.title}
                                                </span>
                                                <Badge variant="secondary" className="text-[10px] h-5 font-mono text-slate-400">
                                                    Items: {category.items.length}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                                {category.desc}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="h-8 w-8 text-slate-400 hover:text-blue-600"
                                                onClick={() => openEditCategory(category)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                onClick={() => handleDeleteCategory(category.id)}
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
                  key={`${hotspot.id}-${hotspot.top}-${hotspot.left}`} // Force remount on position change to reset drag transform
                  drag={isEditMode} // Enable drag only in edit mode
                  dragMomentum={false}
                  dragElastic={0}
                  onDragEnd={(e, info) => handleDragEnd(hotspot.id, info)}
                  className={cn(
                    "absolute z-10",
                    isEditMode ? "cursor-grab active:cursor-grabbing" : ""
                  )}
                  style={{ top: hotspot.top, left: hotspot.left, x: "-50%", y: "-50%" }}
                >
                  <button
                    onClick={(e) => {
                      if (isEditMode) return; // Disable nav in edit mode
                      handleSectionChange(hotspot.sectionId);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border transition-all duration-300 shadow-lg flex items-center gap-1.5 group/hotspot whitespace-nowrap",
                      (activeSection === hotspot.sectionId && !isSearching)
                        ? "bg-primary text-white border-primary scale-110 z-20 ring-4 ring-primary/20" 
                        : "bg-white/90 text-slate-700 border-white/50 hover:bg-primary hover:text-white hover:scale-105"
                    )}
                  >
                    <span className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      (activeSection === hotspot.sectionId && !isSearching) ? "bg-white" : "bg-blue-500 group-hover/hotspot:bg-white"
                    )} />
                    {hotspot.label}
                    
                    {isEditMode && (
                      <div className="flex items-center gap-1 ml-1 pl-1 border-l border-slate-300/50">
                        <div 
                          onClick={(e) => handleEditHotspotClick(hotspot, e)}
                          className="p-1 rounded-full hover:bg-blue-100 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                        </div>
                        <div 
                          onClick={(e) => handleDeleteHotspot(hotspot.id, e)}
                          className="p-1 rounded-full hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </div>
                      </div>
                    )}
                  </button>
                </motion.div>
              ))}

              {isEditMode && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-3 py-1 rounded-full backdrop-blur pointer-events-none whitespace-nowrap">
                  드래그하여 이동 • 클릭하여 추가
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
                    {currentSectionInfo ? (
                        <>
                        <motion.h2 
                          key={currentSectionInfo.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-3xl font-bold text-slate-900 flex items-center gap-3"
                        >
                          {currentSectionInfo.title}
                          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-mono font-medium tracking-wide">
                            {currentSectionInfo.id.toUpperCase()}
                          </span>
                        </motion.h2>
                        <motion.p 
                          key={currentSectionInfo.desc}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-slate-500 mt-2 leading-relaxed max-w-2xl"
                        >
                          {currentSectionInfo.desc}
                        </motion.p>
                        </>
                    ) : (
                        <div className="text-slate-400 italic">카테고리를 선택하세요</div>
                    )}
                  </div>
                )}
              </div>

              {/* Add Standardization Button */}
              <Dialog open={isAddStandardOpen} onOpenChange={setIsAddStandardOpen}>
                <DialogTrigger asChild>
                  <Button className="shrink-0 gap-2 shadow-md hover:shadow-lg transition-all">
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
                        value={newItem.sectionId} 
                        onValueChange={(val) => setNewItem({...newItem, sectionId: val})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(data).map(section => (
                            <SelectItem key={section.id} value={section.id}>
                              {section.title}
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
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="std">기준 번호</Label>
                        <Input 
                          id="std" 
                          placeholder="예: 14.2.3" 
                          value={newItem.std}
                          onChange={(e) => setNewItem({...newItem, std: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="permitDate">건축허가일 (선택)</Label>
                        <Input 
                          id="permitDate" 
                          type="date"
                          value={newItem.permitDate}
                          onChange={(e) => setNewItem({...newItem, permitDate: e.target.value})}
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
                    <Button onClick={handleAddStandard}>추가하기</Button>
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
                  {displayItems.map(({ item, sectionId }, index) => (
                    <motion.div
                      key={`${item.title}-${sectionId}-${index}`}
                      variants={cardVariants}
                      custom={index}
                      layout
                      onClick={() => handleOpenViewStandard(item, sectionId)}
                      className="group p-5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 relative cursor-pointer hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3 pr-8">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <h3 className="font-semibold text-slate-900 text-lg leading-snug">
                            {item.title}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-500 text-xs font-mono font-bold shadow-sm group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                            {item.std}
                          </span>
                          {isSearching && (
                            <Badge variant="outline" className="text-[10px] font-normal text-slate-400">
                              {data[sectionId].title}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="pl-8 border-l-2 border-slate-200 group-hover:border-blue-200 transition-colors">
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">
                          {item.body}
                        </p>
                        
                        {/* Dates Display */}
                        {(item.inspectionDate || item.permitDate) && (
                          <div className="flex gap-3 mb-3 text-xs text-slate-500 font-mono">
                            {item.permitDate && (
                              <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                                <Calendar className="w-3 h-3" />
                                <span>건축허가: {item.permitDate}</span>
                              </div>
                            )}
                            {item.inspectionDate && (
                              <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                <Calendar className="w-3 h-3" />
                                <span>검사기준: {item.inspectionDate}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Display Image if exists */}
                        {item.imageUrl && (
                          <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 max-w-xs shadow-sm">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover" />
                          </div>
                        )}
                      </div>

                      {/* Move Item Dropdown */}
                      <div className="absolute top-4 right-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white">
                              <MoreHorizontal className="w-4 h-4 text-slate-400 hover:text-slate-700" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-xs text-slate-500 flex items-center gap-2">
                              <FolderInput className="w-3 h-3" />
                              이동할 카테고리...
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {Object.values(data).map((section) => (
                              <DropdownMenuItem 
                                key={section.id}
                                disabled={section.id === sectionId}
                                onClick={() => handleMoveItem(item.title, sectionId, section.id)}
                                className="cursor-pointer"
                              >
                                <span>{section.title}</span>
                                {section.id === sectionId && <span className="ml-auto text-[10px] opacity-50">(Current)</span>}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {displayItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Info className="w-12 h-12 mb-4 opacity-20" />
                  <p>{isSearching ? "검색 결과가 없습니다." : "이 섹션에 등록된 기준이 없습니다."}</p>
                </div>
              )}
            </div>

            {/* Footer Note */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
              <AlertCircle className="w-3 h-3" />
              <p>
                ※ 기준 내용은 「엘리베이터 검사방법 표준화 모음」과 안내자료를 참고해 간략 요약한 예시입니다.
              </p>
            </div>
          </div>

          {/* Shared Hotspot Dialog (Add / Edit) */}
          <Dialog open={isHotspotDialogOpen} onOpenChange={setIsHotspotDialogOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>
                  {editingHotspotId ? "버튼 편집" : "새 버튼 추가"}
                </DialogTitle>
                <DialogDescription>
                  {editingHotspotId 
                    ? "버튼의 이름이나 연결할 카테고리를 수정합니다." 
                    : "구조도에 새로운 바로가기 버튼을 추가합니다."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="hotspot-label">버튼 이름</Label>
                  <Input 
                    id="hotspot-label" 
                    placeholder="예: 제어반" 
                    value={hotspotForm.label}
                    onChange={(e) => setHotspotForm({...hotspotForm, label: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hotspot-section">연결할 카테고리</Label>
                  <Select 
                    value={hotspotForm.sectionId} 
                    onValueChange={(val) => setHotspotForm({...hotspotForm, sectionId: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(data).map(section => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsHotspotDialogOpen(false)}>취소</Button>
                <Button onClick={handleSaveHotspot}>
                  {editingHotspotId ? "수정 저장" : "추가하기"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Category Dialog */}
          <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>카테고리 수정</DialogTitle>
                    <DialogDescription>
                        카테고리 이름과 설명을 수정합니다.
                    </DialogDescription>
                </DialogHeader>
                {editingCategory && (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="cat-title">카테고리명</Label>
                            <Input 
                                id="cat-title" 
                                value={editingCategory.title}
                                onChange={(e) => setEditingCategory({...editingCategory, title: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cat-desc">설명</Label>
                            <Input 
                                id="cat-desc" 
                                value={editingCategory.desc}
                                onChange={(e) => setEditingCategory({...editingCategory, desc: e.target.value})}
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>취소</Button>
                    <Button onClick={handleUpdateCategory}>저장</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View Standard Dialog (NEW) */}
          <Dialog open={isViewStandardOpen} onOpenChange={setIsViewStandardOpen}>
            <DialogContent className="sm:max-w-[600px] overflow-hidden">
                <DialogHeader>
                    <div className="flex items-center gap-2 mt-2">
                         <Badge variant="outline" className="text-slate-500 font-mono text-xs">
                            {editingItem.std}
                         </Badge>
                         <span className="text-xs text-slate-400">
                             {data[editingItem.sectionId]?.title}
                         </span>
                    </div>
                    <DialogTitle className="text-2xl font-bold mt-2 leading-tight">
                        {editingItem.title}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Dates */}
                    {(editingItem.inspectionDate || editingItem.permitDate) && (
                        <div className="flex flex-wrap gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            {editingItem.permitDate && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">건축허가일:</span>
                                    <span className="font-mono">{editingItem.permitDate}</span>
                                </div>
                            )}
                            {editingItem.inspectionDate && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium">검사기준적용일:</span>
                                    <span className="font-mono text-blue-600">{editingItem.inspectionDate}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Body Content */}
                    <div className="prose prose-slate max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
                            {editingItem.body}
                        </p>
                    </div>

                    {/* Image */}
                    {editingItem.imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                            <img 
                                src={editingItem.imageUrl} 
                                alt={editingItem.title} 
                                className="w-full h-auto object-contain bg-slate-50" 
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
                    <Button variant="outline" onClick={() => setIsViewStandardOpen(false)}>닫기</Button>
                    <Button onClick={handleSwitchToEditMode} className="gap-2">
                        <Pencil className="w-4 h-4" /> 수정
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
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">항목명 (Title)</Label>
                  <Input 
                    id="edit-title" 
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-std">기준 번호</Label>
                    <Input 
                      id="edit-std" 
                      value={editingItem.std}
                      onChange={(e) => setEditingItem({...editingItem, std: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-permitDate">건축허가일</Label>
                    <Input 
                      id="edit-permitDate" 
                      type="date"
                      value={editingItem.permitDate}
                      onChange={(e) => setEditingItem({...editingItem, permitDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-inspectionDate">검사기준적용일</Label>
                  <Input 
                    id="edit-inspectionDate" 
                    type="date"
                    value={editingItem.inspectionDate}
                    onChange={(e) => setEditingItem({...editingItem, inspectionDate: e.target.value})}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-body">세부 내용</Label>
                  <Textarea 
                    id="edit-body" 
                    className="h-24 resize-none"
                    value={editingItem.body}
                    onChange={(e) => setEditingItem({...editingItem, body: e.target.value})}
                  />
                </div>
                
                {/* Image Upload Field for Edit */}
                <div className="grid gap-2">
                  <Label htmlFor="edit-image">사진 첨부</Label>
                  <div className="flex items-center gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => editFileInputRef.current?.click()}
                      className="w-full border-dashed border-2 h-12 text-slate-500 hover:text-primary hover:border-primary hover:bg-blue-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {editingItem.imageUrl ? "사진 변경하기" : "이미지 업로드"}
                    </Button>
                    <input 
                      ref={editFileInputRef}
                      id="edit-image" 
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
                        onClick={() => setEditingItem(prev => ({ ...prev, imageUrl: "" }))}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <div className="flex-1 flex justify-start">
                    <Button variant="destructive" onClick={handleDeleteStandard}>
                        삭제
                    </Button>
                </div>
                <Button variant="outline" onClick={() => setIsEditStandardOpen(false)}>취소</Button>
                <Button onClick={handleUpdateStandard}>수정 완료</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>
  );
}
