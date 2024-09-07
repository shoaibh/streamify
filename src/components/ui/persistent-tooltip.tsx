import React, { useState, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useIsMobile from "@/hooks/useIsMobile";

interface PersistentTooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
}

export const PersistentTooltip: React.FC<PersistentTooltipProps> = ({ children, content, className }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isMobile = useIsMobile();

  const handleTriggerClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100} open={isOpen} onOpenChange={!isMobile ? setIsOpen : () => {}}>
        <TooltipTrigger onClick={handleTriggerClick} asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="bottom" className={className}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
