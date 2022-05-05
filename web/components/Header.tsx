import React from 'react';
import Link from 'next/link';
import { useStore } from '../store';
import { capitalize } from '../utils';

const Header: React.FC = () => {
    const { profile, isAuth } = useStore();

    return (
        <header className="w-full bg-gray-900 p-3 rounded-lg shadow-md max-w-2xl mb-5">
            <nav className="flex justify-between items-center px-10">
                <Link href="/">
                    <a className="mx-5">Home</a>
                </Link>
                <Link href="/register">
                    <a className="mx-5">Register</a>
                </Link>
                <Link href="/login">
                    <a className="mx-5">Login</a>
                </Link>
                <Link href="/dashboard">
                    <a className="mx-5">DashBoard</a>
                </Link>

                {isAuth ? (
                    <h4 className="border-l-2 border-l-teal-700 pl-5">
                        Logged in as
                        <span className="text-teal-600 font-bold ml-1">
                            {profile && capitalize(profile.name)}
                        </span>
                    </h4>
                ) : null}
            </nav>
        </header>
    );
};

export default Header;
