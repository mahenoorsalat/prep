import apiClient from './client';
import type { Question, CreateQuestionRequest } from '../types';

export const questionsApi = {
  getByTestId: async (testId: string): Promise<Question[]> => {
    try {
      const response = await apiClient.get(`/tests/${testId}/questions`);
      return response.data?.data || response.data || [];
    } catch (error) {
      const stored = localStorage.getItem(`test_${testId}_questions`);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    }
  },

  create: async (testId: string, data: CreateQuestionRequest): Promise<Question> => {
    try {
      const response = await apiClient.post(`/tests/${testId}/questions`, data);
      return response.data?.data || response.data;
    } catch (error) {
      const stored = localStorage.getItem(`test_${testId}_questions`);
      const questions: Question[] = stored ? JSON.parse(stored) : [];
      const newQuestion: Question = {
        ...data,
        _id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        testId,
        questionNumber: questions.length + 1,
        marks: 5,
        options: data.options.map((opt, index) => ({
          id: `opt-${index}-${Math.floor(Math.random() * 1000)}`,
          text: opt.text,
          isCorrect: opt.isCorrect
        }))
      };
      questions.push(newQuestion);
      localStorage.setItem(`test_${testId}_questions`, JSON.stringify(questions));
      return newQuestion;
    }
  },

  update: async (questionId: string, data: Partial<CreateQuestionRequest>): Promise<Question> => {
    try {
      const response = await apiClient.put(`/questions/${questionId}`, data);
      return response.data?.data || response.data;
    } catch (error) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('test_') && key.endsWith('_questions')) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const questions: Question[] = JSON.parse(stored);
            const index = questions.findIndex(q => q._id === questionId);
            if (index !== -1) {
              const updatedQuestion = {
                ...questions[index],
                ...data,
                options: data.options 
                  ? data.options.map((opt, optIdx) => ({
                      id: questions[index].options[optIdx]?.id || `opt-${optIdx}-${Math.floor(Math.random() * 1000)}`,
                      text: opt.text,
                      isCorrect: opt.isCorrect
                    }))
                  : questions[index].options
              } as Question;
              questions[index] = updatedQuestion;
              localStorage.setItem(key, JSON.stringify(questions));
              return updatedQuestion;
            }
          }
        }
      }
      throw error;
    }
  },

  delete: async (questionId: string): Promise<void> => {
    try {
      await apiClient.delete(`/questions/${questionId}`);
    } catch (error) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('test_') && key.endsWith('_questions')) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const questions: Question[] = JSON.parse(stored);
            const filtered = questions.filter(q => q._id !== questionId);
            localStorage.setItem(key, JSON.stringify(filtered));
            break;
          }
        }
      }
    }
  },
};
