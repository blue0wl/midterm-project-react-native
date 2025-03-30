import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { Job } from '../src/types';
import { Alert } from 'react-native';

type JobsContextType = {
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  removeJob: (jobId: string) => void;
  applyForJob: (job: Job, applicationData: any) => Promise<void>;
  isJobSaved: (jobId: string) => boolean;
};

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const savedJobsRef = useRef(savedJobs);
    // Initialize state with a function to prevent recreation

  // Sync ref with state
  useEffect(() => {
    savedJobsRef.current = savedJobs;
  }, [savedJobs]);


  // Memoize these functions to prevent unnecessary re-renders
  const saveJob = useCallback((job: Job) => {
    setSavedJobs(prev => {
      if (!prev.some(j => j.id === job.id)) {
        return [...prev, job];
      }
      Alert.alert('Info', 'Job already saved');
      return prev;
    });
  }, []);

  

  const removeJob = useCallback((jobId: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  }, []);

  const isJobSaved = useCallback((jobId: string) => {
    return savedJobs.some(job => job.id === jobId);
  }, [savedJobs]);

  const applyForJob = useCallback(async (job: Job, applicationData: any) => {
    try {
      // Simulate API call
      console.log('Submitting application:', { job, applicationData });
      
     
      

      // Remove the job from saved jobs after successful application
    setSavedJobs(prev => prev.filter(j => j.id !== job.id));
    
      Alert.alert('Success', `Application submitted for ${job.title}!`);
    } catch (error) {
      console.error('Application failed:', error);
      Alert.alert('Error', 'Failed to submit application');
      throw error; // Re-throw to let the calling component handle it
    }
  }, []);

  return (
    <JobsContext.Provider value={{ 
      savedJobs, 
      saveJob, 
      removeJob, 
      applyForJob,
      isJobSaved 
    }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};