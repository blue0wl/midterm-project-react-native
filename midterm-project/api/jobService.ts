import axios from 'axios';
import { Job } from '../src/types';
import { v4 as uuidv4 } from 'uuid';



export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await axios.get('https://empllo.com/api/v1');
    console.log('RAW API RESPONSE:', JSON.stringify(response.data, null, 2));

    let jobsData: any[] = [];

    // Handle different response structures
    if (response.data?.jobs && Array.isArray(response.data.jobs)) {
      jobsData = response.data.jobs;
    } else if (Array.isArray(response.data)) {
      jobsData = response.data;
    } else {
      jobsData = [response.data];
    }

    // Transform and validate jobs
    const transformedJobs = transformJobs(jobsData);

    // Check for duplicates after transformation
    checkForDuplicateIds(transformedJobs);

    return transformedJobs;

  } catch (error) {
    console.error('API Error:', {
      url: 'https://empllo.com/api/v1',
      status: axios.isAxiosError(error) ? error.response?.status : null,
      message: error.message,
      responseData: axios.isAxiosError(error) ? error.response?.data : null
    });
    
    throw error; // Re-throw to let the UI handle it properly
  }
};

const checkForDuplicateIds = (jobs: Job[]): void => {
  const ids = jobs.map(j => j.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  
  if (duplicates.length > 0) {
    console.error('Duplicate Job IDs Found:', duplicates);
    throw new Error(`Duplicate job IDs detected: ${duplicates.join(', ')}`);
  }
};

const transformJobs = (jobs: any[]): Job[] => {
  return jobs.map(job => {
    // Validate required fields
    if (!job.title) {
      console.warn('Job missing title:', job);
      throw new Error('Job data is missing required title field');
    }

    // Create salary string
    let salary = 'Not specified';
    if (job.minSalary !== undefined) {
      const min = job.minSalary?.toLocaleString() || '0';
      const max = job.maxSalary?.toLocaleString() || min;
      salary = `$${min} - $${max}`;
    }

    return {
      id: job.id || uuidv4(),
      title: job.title,
      company: job.company || 'Unknown Company',
      jobType: job.jobType || 'Not specified',
      workModel: job.workModel || 'Not specified',
      seniorityLevel: job.seniorityLevel || 'Not specified',
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      locations: Array.isArray(job.locations) ? job.locations : [],
      tags: Array.isArray(job.tags) ? job.tags : [],
      salary: salary
    };
  });
};