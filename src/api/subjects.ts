import apiClient from './client';
import type { Subject, Topic, SubTopic } from '../types';

export const subjectsApi = {
  getAll: async (): Promise<Subject[]> => {
    const response = await apiClient.get('/subjects');
    return response.data?.data || response.data || [];
  },

  getTopics: async (subjectId: string): Promise<Topic[]> => {
    const response = await apiClient.get(`/subjects/${subjectId}/topics`);
    return response.data?.data || response.data || [];
  },

  getSubTopics: async (topicId: string): Promise<SubTopic[]> => {
    const response = await apiClient.get(`/topics/${topicId}/subtopics`);
    return response.data?.data || response.data || [];
  },
};
