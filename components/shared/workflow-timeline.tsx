import React from 'react';
import { cn } from '@/lib/utils';
import { Check, CircleDot, Activity, ClipboardList, Target, Truck, Calculator } from 'lucide-react';

export enum WorkflowStage {
  RFQ_ENTRY = 'RFQ Entry',
  AI_PARSING = 'AI Parsing',
  PROCUREMENT = 'Procurement',
  SUPPLIER_QUOTE = 'Supplier Quote',
  CLIENT_QUOTE = 'Client Quote',
  CLIENT_PO = 'Client PO',
  SUPPLIER_PO = 'Supplier PO',
  GOODS_RECEIPT = 'Goods Receipt',
  DELIVERY = 'Delivery',
  FINANCE = 'Finance',
}

export enum WorkflowPhase {
  INTAKE = 'Intake',
  SOURCING = 'Sourcing',
  ORDERING = 'Ordering',
  FULFILLMENT = 'Fulfillment',
}

const STAGES = Object.values(WorkflowStage);

const PHASE_MAP: Record<WorkflowPhase, WorkflowStage[]> = {
  [WorkflowPhase.INTAKE]: [WorkflowStage.RFQ_ENTRY, WorkflowStage.AI_PARSING],
  [WorkflowPhase.SOURCING]: [WorkflowStage.PROCUREMENT, WorkflowStage.SUPPLIER_QUOTE],
  [WorkflowPhase.ORDERING]: [WorkflowStage.CLIENT_QUOTE, WorkflowStage.CLIENT_PO, WorkflowStage.SUPPLIER_PO],
  [WorkflowPhase.FULFILLMENT]: [WorkflowStage.GOODS_RECEIPT, WorkflowStage.DELIVERY, WorkflowStage.FINANCE],
};

const PHASE_ICONS: Record<WorkflowPhase, React.ElementType> = {
  [WorkflowPhase.INTAKE]: ClipboardList,
  [WorkflowPhase.SOURCING]: Target,
  [WorkflowPhase.ORDERING]: Calculator,
  [WorkflowPhase.FULFILLMENT]: Truck,
};

interface WorkflowTimelineProps {
  currentStage: WorkflowStage;
  completedStages?: WorkflowStage[];
  className?: string;
  isCompact?: boolean;
}

export function WorkflowTimeline({
  currentStage,
  completedStages = [],
  className,
  isCompact = false,
}: WorkflowTimelineProps) {
  const currentIndex = STAGES.indexOf(currentStage);

  // Determine current phase
  const currentPhase = (Object.entries(PHASE_MAP).find(([_, stages]) => 
    stages.includes(currentStage)
  )?.[0] as WorkflowPhase) || WorkflowPhase.INTAKE;

  const phases = Object.values(WorkflowPhase);
  const currentPhaseIndex = phases.indexOf(currentPhase);

  if (isCompact) {
    return (
      <div className={cn("w-full py-6", className)}>
        <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
          {phases.map((phase, idx) => {
            const Icon = PHASE_ICONS[phase];
            const isCompleted = idx < currentPhaseIndex;
            const isCurrent = idx === currentPhaseIndex;
            const isPending = idx > currentPhaseIndex;

            return (
              <React.Fragment key={phase}>
                <div className="flex flex-col items-center gap-3 relative flex-1">
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10",
                      isCompleted ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : 
                      isCurrent ? "bg-background border-2 border-primary text-primary shadow-xl ring-4 ring-primary/5 scale-110" : 
                      "bg-muted/50 border border-border text-muted-foreground/40"
                    )}
                  >
                    {isCompleted ? <Check size={20} className="stroke-[3px]" /> : <Icon size={20} />}
                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest transition-colors mb-0.5",
                      isCurrent ? "text-primary" : "text-muted-foreground/60"
                    )}>
                      Phase {idx + 1}
                    </p>
                    <p className={cn(
                      "text-xs font-bold transition-colors",
                      isCurrent ? "text-foreground" : "text-muted-foreground/80"
                    )}>
                      {phase}
                    </p>
                  </div>
                </div>
                {idx < phases.length - 1 && (
                  <div className={cn(
                    "h-[2px] flex-1 mt-[-32px] transition-all duration-700",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full overflow-x-auto pb-6 pt-2 scrollbar-hide", className)}>
      <div className="min-w-[1200px] flex items-center justify-between px-8 relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-12 right-12 h-[2px] bg-muted/40 -z-0" />
        <div 
          className="absolute top-5 left-12 h-[2px] bg-primary transition-all duration-1000 ease-in-out -z-0 shadow-[0_0_8px_rgba(var(--primary),0.5)]" 
          style={{ width: `${(currentIndex / (STAGES.length - 1)) * 92}%` }}
        />

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex || completedStages.includes(stage);
          const isCurrent = idx === currentIndex;
          
          return (
            <div key={stage} className="flex flex-col items-center gap-3 relative z-10">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                  isCompleted ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-90" : 
                  isCurrent ? "bg-background border-2 border-primary text-primary shadow-xl ring-8 ring-primary/5 scale-110" : 
                  "bg-background border border-muted-foreground/20 text-muted-foreground/40"
                )}
              >
                {isCompleted ? <Check size={18} className="stroke-[3px]" /> : 
                 isCurrent ? <CircleDot size={18} className="animate-pulse" /> : 
                 <span className="text-xs font-bold">{idx + 1}</span>}
              </div>
              <div className="flex flex-col items-center">
                <span 
                  className={cn(
                    "text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-colors mb-1",
                    isCurrent ? "text-primary" : "text-muted-foreground/40"
                  )}
                >
                  Step {idx + 1}
                </span>
                <span 
                  className={cn(
                    "text-[11px] font-bold whitespace-nowrap transition-colors",
                    isCurrent ? "text-foreground" : isCompleted ? "text-foreground/60" : "text-muted-foreground/40"
                  )}
                >
                  {stage}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
