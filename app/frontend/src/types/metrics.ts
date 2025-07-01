export type QualityMetrics = {
  name: string;
  completeness: number;
  fieldsFilled: number;
  fieldsTotal: number;
  warnings?: string[];
};
