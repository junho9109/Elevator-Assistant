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
  Upload
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
  const [isAddHotspotOpen, setIsAddHotspotOpen] = useState(false);
  const [pendingHotspot, setPendingHotspot] = useState<{top: string, left: string} | null>(null);
  
  // Form States
  const [newItem, setNewItem] = useState<InspectionItem & { sectionId: string }>({
    title: "",
    std: "",
    body: "",
    sectionId: "machine",
    imageUrl: ""
  });
  const [newHotspotLabel, setNewHotspotLabel] = useState("");
  const [newHotspotSection, setNewHotspotSection] = useState("machine");

  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle section change
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setSearchTerm(""); 
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Adding New Standard
  const handleAddStandard = () => {
    if (!newItem.title || !newItem.body) return;

    setData(prev => {
      const newData = { ...prev };
      const targetSection = newData[newItem.sectionId];
      
      const updatedItems = [{
        title: newItem.title,
        std: newItem.std,
        body: newItem.body,
        imageUrl: newItem.imageUrl
      }, ...targetSection.items];

      newData[newItem.sectionId] = {
        ...targetSection,
        items: updatedItems
      };

      return newData;
    });

    setIsAddStandardOpen(false);
    setNewItem({ title: "", std: "", body: "", sectionId: "machine", imageUrl: "" });
    
    // Switch to the section where item was added
    setActiveSection(newItem.sectionId);
  };

  // Handle Image Click for New Hotspot
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const left = `${(x / rect.width) * 100}%`;
    const top = `${(y / rect.height) * 100}%`;

    setPendingHotspot({ top, left });
    setIsAddHotspotOpen(true);
  };

  // Handle Confirm Add Hotspot
  const handleAddHotspot = () => {
    if (!pendingHotspot || !newHotspotLabel) return;

    const newHotspot: HotspotItem = {
      id: `h-${Date.now()}`,
      label: newHotspotLabel,
      top: pendingHotspot.top,
      left: pendingHotspot.left,
      sectionId: newHotspotSection
    };

    setHotspots(prev => [...prev, newHotspot]);
    setIsAddHotspotOpen(false);
    setNewHotspotLabel("");
    setPendingHotspot(null);
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
                <h1 className="text-2xl font-bold tracking-tight">엘리베이터 구조도 뷰어</h1>
              </div>
              <p className="text-muted-foreground text-sm pl-[52px]">
                구조도나 버튼을 눌러 기계실, 승강로, 카 내, 피트 관련 기준을 확인하세요.
              </p>
            </div>

            {/* Edit Mode Toggle */}
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Settings2 className="w-4 h-4 text-slate-400" />
                <span>구조도 편집 모드</span>
              </div>
              <Switch 
                checked={isEditMode}
                onCheckedChange={setIsEditMode}
              />
            </div>

            {/* Interactive Structure Diagram */}
            <div 
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
                <div
                  key={hotspot.id}
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 z-10",
                    isEditMode ? "pointer-events-auto" : ""
                  )}
                  style={{ top: hotspot.top, left: hotspot.left }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSectionChange(hotspot.sectionId);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border transition-all duration-300 shadow-lg flex items-center gap-1.5 group/hotspot",
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
                      <div 
                        onClick={(e) => handleDeleteHotspot(hotspot.id, e)}
                        className="ml-1 p-0.5 rounded-full hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                </div>
              ))}

              {isEditMode && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs px-3 py-1 rounded-full backdrop-blur pointer-events-none">
                  이미지를 클릭하여 버튼 추가
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
                  </div>
                )}
              </div>

              {/* Add Standard Button */}
              <Dialog open={isAddStandardOpen} onOpenChange={setIsAddStandardOpen}>
                <DialogTrigger asChild>
                  <Button className="shrink-0 gap-2 shadow-md hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4" />
                    기준 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>새 검사 기준 추가</DialogTitle>
                    <DialogDescription>
                      새로운 검사 기준 항목을 추가합니다. 사진을 첨부할 수 있습니다.
                    </DialogDescription>
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
                    <div className="grid gap-2">
                      <Label htmlFor="std">기준 번호 (Standard No.)</Label>
                      <Input 
                        id="std" 
                        placeholder="예: 14.2.3" 
                        value={newItem.std}
                        onChange={(e) => setNewItem({...newItem, std: e.target.value})}
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
                          onChange={handleFileChange}
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
                      className="group p-5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 relative"
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
                        
                        {/* Display Image if exists */}
                        {item.imageUrl && (
                          <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 max-w-xs shadow-sm">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover" />
                          </div>
                        )}
                      </div>

                      {/* Move Item Dropdown */}
                      <div className="absolute top-4 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
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

          {/* Add Hotspot Dialog */}
          <Dialog open={isAddHotspotOpen} onOpenChange={setIsAddHotspotOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>새 버튼 추가</DialogTitle>
                <DialogDescription>
                  구조도에 새로운 바로가기 버튼을 추가합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="hotspot-label">버튼 이름</Label>
                  <Input 
                    id="hotspot-label" 
                    placeholder="예: 제어반" 
                    value={newHotspotLabel}
                    onChange={(e) => setNewHotspotLabel(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hotspot-section">연결할 카테고리</Label>
                  <Select 
                    value={newHotspotSection} 
                    onValueChange={setNewHotspotSection}
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
                <Button variant="outline" onClick={() => setIsAddHotspotOpen(false)}>취소</Button>
                <Button onClick={handleAddHotspot}>추가하기</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>
  );
}
