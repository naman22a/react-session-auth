import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import * as api from '../api';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useStore } from '../store';
import { AuthResponse, Errors, User } from '../types';
import { capitalize } from '../utils';

interface Props {
    profile: User;
}

const Profile: React.FC<Props> = ({ profile }) => {
    const { setProfile, setIsAuth } = useStore(state => state);
    const router = useRouter();

    // logout
    const { mutate: handleLogout } = useMutation({
        mutationKey: 'user',
        mutationFn: () => api.postLogout(),
        onSuccess: data => {
            if (data.ok) {
                router.push('/');
                setProfile(null);
                setIsAuth(false);
            }
        },
        onError: () => {
            alert('Something went wrong');
        }
    });

    // changePassword
    const [newPassword, setNewPassword] = useState('');
    const [errors, setErrors] = useState<Errors | null>(null);

    const { mutate: handleChangePassword } = useMutation({
        mutationKey: 'user',
        mutationFn: () => api.changePassword(newPassword),
        onSuccess: data => {
            if (data.ok) {
                setIsAuth(false);
                setProfile(null);
                alert('Password has been updated');
                router.push('/login');
            }
        },
        onError: (error: AxiosError | Error) => {
            console.log('on error');
            if (axios.isAxiosError(error)) {
                const data = error.response?.data as AuthResponse;
                console.log(data.errors);
                setErrors(data.errors);
            } else {
                console.log('network error');
                setErrors([
                    {
                        field: 'network',
                        message: 'Something went wrong'
                    }
                ]);
            }
        }
    });

    // delete account
    const { mutate: handleDeleteAccount } = useMutation({
        mutationKey: 'user',
        mutationFn: api.deleteAccount,
        onSuccess: data => {
            console.log(data);
            if (data.ok) {
                alert('account deleted successfully');
                router.push('/');
                setProfile(null);
                setIsAuth(false);
            }
        },
        onError: () => {
            alert('Something went wrong');
        }
    });

    return (
        <div className="flex justify-between p-6">
            <div className="p-10">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-32 w-h-32 mb-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                    />
                </svg>
                <h2 className="text-2xl">{capitalize(profile.name)}</h2>
                <h2 className="text-lg">{profile.email}</h2>
            </div>
            <div className="p-10 flex flex-col">
                <section>
                    <button
                        className="my-3 bg-pink-600"
                        onClick={() => handleLogout()}
                    >
                        Logout
                    </button>
                </section>
                <section className="flex flex-col my-5">
                    <h3 className="text-xl font-bold">Change password</h3>
                    <form
                        className="flex flex-col"
                        onSubmit={e => {
                            e.preventDefault();
                            handleChangePassword();
                        }}
                    >
                        <label>New Password</label>
                        <input
                            type="text"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="rounded bg-gray-700 border-none outline-none px-3 py-1 mt-2"
                        />
                        <button className="my-3 bg-blue-600" type="submit">
                            Change Password
                        </button>
                    </form>

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
                </section>
                <section>
                    <button
                        className="my-3 bg-red-600"
                        onClick={() => {
                            const yes = confirm(
                                'Are you sure you want to delete the account'
                            );
                            if (yes) {
                                handleDeleteAccount();
                            }
                        }}
                    >
                        Delete Account
                    </button>
                </section>
            </div>
        </div>
    );
};

export default Profile;
