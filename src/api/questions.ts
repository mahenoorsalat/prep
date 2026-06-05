import apiClient from './client';
import type { Question, CreateQuestionRequest } from '../types';

export const questionsApi = {
  getByTestId: async (testId: string): Promise<Question[]> => {
    const response = await apiClient.get(`/tests/${testId}/questions`);
    return response.data?.data || response.data || [];
  },

  create: async (testId: string, data: CreateQuestionRequest): Promise<Question> => {
    const response = await apiClient.post(`/tests/${testId}/questions`, data);
    return response.data?.data || response.data;
  },

  update: async (questionId: string, data: Partial<CreateQuestionRequest>): Promise<Question> => {
    const response = await apiClient.put(`/questions/${questionId}`, data);
    return response.data?.data || response.data;
  },

  delete: async (questionId: string): Promise<void> => {
    await apiClient.delete(`/questions/${questionId}`);
  },
};
