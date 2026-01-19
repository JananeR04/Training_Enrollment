import api from './api';

export const enrollmentService = {
  enrollInTraining: async (trainingId) => {
    const response = await api.post('/enrollments', { trainingId });
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my-enrollments');
    return response.data;
  },

  cancelEnrollment: async (enrollmentId) => {
    const response = await api.delete(`/enrollments/${enrollmentId}`);
    return response.data;
  },

  getTrainingEnrollments: async (trainingId) => {
    const response = await api.get(`/enrollments/training/${trainingId}`);
    return response.data;
  }
};