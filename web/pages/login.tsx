import { NextPage } from 'next';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import * as api from '../api';
import { useStore } from '../store';
import { useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';
import { Errors, AuthResponse } from '../types';
import styles from '../styles/form.module.scss';
import Head from 'next/head';

const Login: NextPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Errors>(null);

    const router = useRouter();
    const { setIsAuth } = useStore(state => state);

    const { mutate, isLoading } = useMutation({
        mutationKey: 'user',
        mutationFn: () => api.postLogin(email, password),
        onSuccess: data => {
            if (data.ok) {
                setIsAuth(true);
                router.push('/dashboard');
            }
        },
        onError: (error: AxiosError | Error) => {
            if (axios.isAxiosError(error)) {
                const data = error.response?.data as AuthResponse;
                setErrors(data.errors);
            } else {
                setErrors([
                    {
                        field: 'network',
                        message: 'Something went wrong'
                    }
                ]);
            }
        }
    });

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate();
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Login</title>
            </Head>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <div>
                    <div>
                        {errors?.map(error => (
                            <p
                                key={error.field}
                                className="text-red-600 my-2 text-lg"
                            >
                                {error.message}
                            </p>
                        ))}
                    </div>
                    <div className={styles.field}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <button type="submit">{isLoading ? 'loading' : 'Login'}</button>
            </form>
        </div>
    );
};

export default Login;
