import axios from 'axios';
import {
    AuthResponse,
    LogoutResponse,
    UserResponse,
    UsersResponse
} from '../types';

const API = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
});

export const getUsers = async () => {
    const res = await API.get<UsersResponse>('/auth/users');
    return res.data;
};

export const getUser = async () =>
    (await API.get<UserResponse>('/auth/user')).data;

export const postLogin = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    const res = await API.post('/auth/login', {
        email,
        password
    });

    return res.data;
};

export const postRegister = async (
    name: string,
    email: string,
    password: string
): Promise<AuthResponse> => {
    const res = await API.post('/auth/register', {
        name,
        email,
        password
    });

    return res.data;
};

export const postLogout = async (): Promise<LogoutResponse> => {
    const res = await API.post('/auth/logout');
    return res.data;
};

export const changePassword = async (
    newPassword: string
): Promise<AuthResponse> => {
    const res = await API.patch('/auth/change-password', { newPassword });
    return res.data;
};

export const deleteAccount = async (): Promise<AuthResponse> => {
    const res = await API.delete('/auth/delete-account');
    return res.data;
};

export default API;
