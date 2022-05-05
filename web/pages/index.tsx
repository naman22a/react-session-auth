import type { NextPage } from 'next';
import * as api from '../api';
import { useQuery } from 'react-query';
import { capitalize } from '../utils';
import Head from 'next/head';

const Home: NextPage = () => {
    const { data, isLoading, isError } = useQuery('users', api.getUsers, {
        retry: 2
    });

    if (isLoading) {
        return <p className="text-lg">Loading...</p>;
    }

    if (isError) {
        return <p className="text-red-600 text-lg">Something went wrong</p>;
    }

    return (
        <div>
            <Head>
                <title>Home</title>
            </Head>
            <h1 className="text-5xl">Home Page</h1>
            <h3 className="my-3 text-xl">List of users: </h3>
            <ul>
                {data!.users?.map((user, index) => (
                    <li key={user.id}>
                        <span className="mr-2">{index + 1})</span>
                        <span> {capitalize(user.name)}</span>
                    </li>
                ))}
            </ul>

            {data!.errors?.map(error => (
                <p key={error.field} className="text-red-600 text-lg">
                    {error.message}
                </p>
            ))}
        </div>
    );
};

export default Home;
