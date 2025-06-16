declare module 'web-vitals' {
  export type Metric = {
    name: string;
    value: number;
    id: string;
    delta?: number;
    entries?: PerformanceEntry[];
  };
  
  export type ReportHandler = (metric: Metric) => void;
  
  export function onCLS(reportHandler: ReportHandler): void;
  export function onFID(reportHandler: ReportHandler): void;
  export function onFCP(reportHandler: ReportHandler): void;
  export function onLCP(reportHandler: ReportHandler): void;
  export function onTTFB(reportHandler: ReportHandler): void;
} 