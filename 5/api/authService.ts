import apiClient from './apiClient';
import { LoginResponse } from '../types';

export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  const response = await apiClient.post<LoginResponse>('/login', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
