import api from '@/lib/api';

export async function fetchCompetitions() {
  const response = await api.get('/competitions');
  return response.data;
}
