import { Level } from './level';

export interface LearningModule {
    id: number;
    title: string;
    description: string;
    resources: string[];
    estimatedTime: string;
  }
  
  export interface LearningPlan {
    subject: string;
    level: Level;
    modules: LearningModule[];
  }