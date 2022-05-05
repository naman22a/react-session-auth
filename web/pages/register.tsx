import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import * as api from '../api';
import axios, { AxiosError } from 'axios';
import { Errors, AuthResponse } from '../types';
import styles from '../styles/form.module.scss';
import Head from 'next/head';

const Register: NextPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Errors>(null);

    const router = useRouter();

    const { mutate } = useMutation({
        mutationKey: 'user',
        mutationFn: () => api.postRegister(name, email, password),
        onSuccess: data => {
            if (data.ok) {
                router.push('/login');
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

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate();
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Register</title>
            </Head>
            <h1>Register</h1>

            <form onSubmit={handleRegister}>
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
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
