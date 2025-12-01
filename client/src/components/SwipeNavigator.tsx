import { useState, ReactNode } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";

interface SwipeNavigatorProps {
  pages: ReactNode[];
  pageNames: string[];
}

export default function SwipeNavigator({ pages, pageNames }: SwipeNavigatorProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const swipeThreshold = 50;
  const swipeVelocityThreshold = 500;

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    
    if (offset.x > swipeThreshold || velocity.x > swipeVelocityThreshold) {
      if (currentPage > 0) {
        setDirection(-1);
        setCurrentPage(currentPage - 1);
      }
    } else if (offset.x < -swipeThreshold || velocity.x < -swipeVelocityThreshold) {
      if (currentPage < pages.length - 1) {
        setDirection(1);
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const goToPage = (index: number) => {
    setDirection(index > currentPage ? 1 : -1);
    setCurrentPage(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0
    })
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-border">
        {pageNames.map((name, index) => (
          <button
            key={index}
            onClick={() => goToPage(index)}
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium transition-all",
              currentPage === index
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            )}
            data-testid={`nav-${name}`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentPage === index
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            data-testid={`dot-${index}`}
          />
        ))}
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentPage}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          {pages[currentPage]}
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-40 text-xs text-muted-foreground bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full">
        ← 스와이프하여 페이지 전환 →
      </div>
    </div>
  );
}
