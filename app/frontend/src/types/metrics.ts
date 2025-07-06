export type QualityMetrics = {
  name: string;
  completeness: number;
  correctness?: number;
  fieldsFilled: number;
  fieldsTotal: number;
  warnings?: string[];
};
