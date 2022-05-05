import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as api from '../api';
import { useStore } from '../store';
import Profile from '../components/Profile';
import { useQuery } from 'react-query';
import Head from 'next/head';

const Dashboard: NextPage = () => {
    const { profile, isAuth, setProfile } = useStore(state => state);
    const router = useRouter();

    useEffect(() => {
        if (!isAuth) {
            router.push('/login');
        }
    }, []);

    const { data, isLoading } = useQuery('user', api.getUser, {
        onError: () => {
            router.push('/login');
        },
        retry: 1
    });

    return (
        <div>
            <Head>
                <title>Dashboard</title>
            </Head>
            <h1 className="text-5xl mb-5">Dashboard</h1>
            {!isLoading && <Profile profile={data!.user} />}
        </div>
    );
};

export default Dashboard;
