import api from './api';

export const trainingService = {
  getAllTrainings: async () => {
    const response = await api.get('/trainings');
    return response.data;
  },

  getTrainingById: async (id) => {
    const response = await api.get(`/trainings/${id}`);
    return response.data;
  },

  createTraining: async (trainingData) => {
    const response = await api.post('/trainings', trainingData);
    return response.data;
  },

  getMyTrainings: async () => {
    const response = await api.get('/trainings/trainer/my-trainings');
    return response.data;
  },

  updateTraining: async (id, trainingData) => {
    const response = await api.put(`/trainings/${id}`, trainingData);
    return response.data;
  },

  deleteTraining: async (id) => {
    const response = await api.delete(`/trainings/${id}`);
    return response.data;
  }
};