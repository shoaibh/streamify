import React, { useState, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PersistentTooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
}

export const PersistentTooltip: React.FC<PersistentTooltipProps> = ({ children, content, className }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleTriggerClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100} open={isOpen} onOpenChange={setIsOpen}>
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
