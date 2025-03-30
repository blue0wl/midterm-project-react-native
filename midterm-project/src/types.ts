// src/types.ts
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  JobFinder: { shouldRefresh?: boolean };
  SavedJobs: undefined;
  ApplicationForm: { 
    job: Job;
    saveJob?: (job: Job) => void; };
};

export type Job = {
  id: string;
  title: string;
  company: string;
  salary?: string;
  jobType?: string;
  workModel?: string;
  seniorityLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  locations?: string[];
  tags?: string[];
};

// src/types.ts
export type ApplicationData = {
  name: string;
  email: string;
  contact: string;
  reason: string;
};

export type ApplicationResponse = {
  applicationId: string;
  jobId: string;
  status: 'submitted' | 'review' | 'rejected';
  message?: string;
};

// Navigation prop types for each screen
export type ThemeMode = 'light' | 'dark';
export type JobFinderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'JobFinder'>;
export type SavedJobsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SavedJobs'>;
export type ApplicationFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ApplicationForm'>;