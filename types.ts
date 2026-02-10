
export enum EvaluationStatus {
  COMPLETED = 'Completed',
  DRAFT = 'Draft',
  IN_PROGRESS = 'In Progress'
}

export enum FitmentType {
  AGENTIC_AI = 'Agentic AI',
  AUGMENT_AI = 'Augment AI',
  RPA = 'RPA',
  TRANSFORMATION = 'Transformation'
}

export interface Evaluation {
  id: string;
  processName: string;
  createdOn: string;
  automationScore: number | null;
  feasibilityScore: number | null;
  fitmentType: FitmentType;
  llmType: string;
  status: EvaluationStatus;
}

export interface PricingPlan {
  name: string;
  subtitle: string;
  price: string;
  duration: string;
  validity: string;
  runs: string;
  users: string;
  features: string[];
  footerNote?: string;
}
