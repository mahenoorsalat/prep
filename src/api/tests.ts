import apiClient from './client';
import type { Test, CreateTestRequest, PublishRequest } from '../types';

const subjectMap: Record<string, string> = {
  '1': 'Physics',
  '2': 'Chemistry',
  '3': 'Mathematics',
  '4': 'English',
  '5': 'Biology'
};

const topicMap: Record<string, string> = {
  't1': 'Mechanics',
  't2': 'Thermodynamics',
  't3': 'Optics',
  't4': 'Organic Chemistry',
  't5': 'Inorganic Chemistry',
  't6': 'Calculus',
  't7': 'Algebra',
  't8': 'Grammar',
  't9': 'Writing',
  't10': 'Cell Biology',
  't11': 'Genetics'
};

const subTopicMap: Record<string, string> = {
  'st1': 'Newton Laws',
  'st2': 'Motion',
  'st3': 'Hydrocarbons',
  'st4': 'Derivatives',
  'st5': 'Integration',
  'st6': 'Tenses',
  'st7': 'Application'
};

const mapLocalTest = (raw: any): Test => {
  const subjectId = typeof raw.subject === 'string' ? raw.subject : (raw.subject?._id || '');
  const topicId = typeof raw.topic === 'string' ? raw.topic : (raw.topic?._id || '');
  const subTopicId = typeof raw.subTopic === 'string' ? raw.subTopic : (raw.subTopic?._id || '');

  return {
    ...raw,
    subject: {
      _id: subjectId,
      name: subjectMap[subjectId] || subjectId || 'General'
    },
    topic: {
      _id: topicId,
      name: topicMap[topicId] || topicId || 'General',
      subjectId
    },
    subTopic: {
      _id: subTopicId,
      name: subTopicMap[subTopicId] || subTopicId || 'General',
      topicId
    }
  };
};

export const testsApi = {
  getAll: async (): Promise<Test[]> => {
    const localTests: Test[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('test_')) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            localTests.push(mapLocalTest(JSON.parse(stored)));
          }
        } catch (e) {
          console.error('Error parsing stored test:', e);
        }
      }
    }

    try {
      const response = await apiClient.get('/tests');
      const serverTests = response.data?.data || response.data || [];
      const merged = [...serverTests];
      localTests.forEach((local) => {
        if (!merged.some((t) => t._id === local._id)) {
          merged.push(local);
        }
      });
      return merged;
    } catch {
      return localTests;
    }
  },

  getById: async (id: string): Promise<Test> => {
    try {
      const response = await apiClient.get(`/tests/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      const stored = localStorage.getItem(`test_${id}`);
      if (stored) {
        return mapLocalTest(JSON.parse(stored));
      }
      throw error;
    }
  },

  create: async (data: CreateTestRequest): Promise<Test> => {
    try {
      const response = await apiClient.post('/tests', data);
      return response.data?.data || response.data;
    } catch (error) {
      const mockId = Date.now().toString();
      const newTest = {
        ...data,
        _id: mockId,
        totalMarks: data.numberOfQuestions * data.markingScheme.correctAnswer,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`test_${mockId}`, JSON.stringify(newTest));
      return mapLocalTest(newTest);
    }
  },

  update: async (id: string, data: Partial<CreateTestRequest>): Promise<Test> => {
    try {
      const response = await apiClient.put(`/tests/${id}`, data);
      return response.data?.data || response.data;
    } catch (error) {
      const stored = localStorage.getItem(`test_${id}`);
      if (stored) {
        const updated = { ...JSON.parse(stored), ...data, updatedAt: new Date().toISOString() };
        localStorage.setItem(`test_${id}`, JSON.stringify(updated));
        return mapLocalTest(updated);
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/tests/${id}`);
    } finally {
      localStorage.removeItem(`test_${id}`);
    }
  },

  publish: async (id: string, data: PublishRequest): Promise<Test> => {
    try {
      const response = await apiClient.post(`/tests/${id}/publish`, data);
      return response.data?.data || response.data;
    } catch (error) {
      const stored = localStorage.getItem(`test_${id}`);
      if (stored) {
        const updated = { ...JSON.parse(stored), status: 'published', updatedAt: new Date().toISOString() };
        localStorage.setItem(`test_${id}`, JSON.stringify(updated));
        return mapLocalTest(updated);
      }
      throw error;
    }
  },
};
