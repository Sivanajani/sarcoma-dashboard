export type QualityMetrics = {
  name: string;
  completeness: number;
  correctness?: number;
  consistency?: number;
  actuality?: number;
  fieldsFilled: number;
  fieldsTotal: number;
  warnings?: string[];
};
