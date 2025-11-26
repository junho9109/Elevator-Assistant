import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ELEVATOR_DATA, type SectionData } from "@/lib/elevator-data";
import structureImg from "@assets/structure_1764142259144.png";
import { cn } from "@/lib/utils";
import { 
  Info, 
  ChevronRight, 
  FileText, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
};

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

  const currentData = ELEVATOR_DATA[activeSection];

  // Handle section change
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

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

            {/* Interactive Structure Diagram */}
            <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-inner mb-6 group">
              <img 
                src={structureImg} 
                alt="Elevator Structure" 
                className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              {/* Hotspots */}
              <Hotspot 
                label="기계실" 
                top="10%" 
                left="50%" 
                isActive={activeSection === 'machine'}
                onClick={() => handleSectionChange('machine')} 
              />
              <Hotspot 
                label="카 상부" 
                top="35%" 
                left="55%" 
                isActive={activeSection === 'car'}
                onClick={() => handleSectionChange('car')} 
              />
              <Hotspot 
                label="승강로" 
                top="40%" 
                left="20%" 
                isActive={activeSection === 'shaft'}
                onClick={() => handleSectionChange('shaft')} 
              />
              <Hotspot 
                label="카 내" 
                top="55%" 
                left="55%" 
                isActive={activeSection === 'car'}
                onClick={() => handleSectionChange('car')} 
              />
              <Hotspot 
                label="피트" 
                top="80%" 
                left="50%" 
                isActive={activeSection === 'pit'}
                onClick={() => handleSectionChange('pit')} 
              />
            </div>

            {/* Quick Access Buttons */}
            <div className="mt-auto">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Access</h3>
              <div className="flex flex-wrap gap-2">
                {Object.values(ELEVATOR_DATA).map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25 transform scale-105"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Content Details */}
          <div className="lg:col-span-7 p-6 lg:p-10 bg-white flex flex-col">
            {/* Tabs Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
              <div>
                <motion.h2 
                  key={currentData.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-bold text-slate-900 flex items-center gap-3"
                >
                  {currentData.title}
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-mono font-medium tracking-wide">
                    SECTION {currentData.id.toUpperCase()}
                  </span>
                </motion.h2>
                <motion.p 
                  key={currentData.desc}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-slate-500 mt-2 leading-relaxed max-w-2xl"
                >
                  {currentData.desc}
                </motion.p>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="grid gap-4"
                >
                  {currentData.items.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={cardVariants}
                      custom={index}
                      layout
                      className="group p-5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-300"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <h3 className="font-semibold text-slate-900 text-lg leading-snug">
                            {item.title}
                          </h3>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-500 text-xs font-mono font-bold shadow-sm group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                          {item.std}
                        </span>
                      </div>
                      
                      <p className="text-slate-600 text-sm leading-relaxed pl-8 border-l-2 border-slate-200 group-hover:border-blue-200 transition-colors">
                        {item.body}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {currentData.items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Info className="w-12 h-12 mb-4 opacity-20" />
                  <p>No inspection items available for this section.</p>
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
        </div>
      </div>
    </div>
  );
}

// Subcomponent for Hotspots
function Hotspot({ 
  label, 
  top, 
  left, 
  isActive,
  onClick 
}: { 
  label: string; 
  top: string; 
  left: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border transition-all duration-300 shadow-lg z-10 flex items-center gap-1.5 group/hotspot",
        isActive 
          ? "bg-primary text-white border-primary scale-110 z-20 ring-4 ring-primary/20" 
          : "bg-white/90 text-slate-700 border-white/50 hover:bg-primary hover:text-white hover:scale-105"
      )}
      style={{ top, left }}
    >
      <span className={cn(
        "w-2 h-2 rounded-full animate-pulse",
        isActive ? "bg-white" : "bg-blue-500 group-hover/hotspot:bg-white"
      )} />
      {label}
    </button>
  );
}
