import React from 'react';
import * as api from '../api';
import { useQuery } from 'react-query';
import { useStore } from '../store';

interface Props {
    children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
    const { setProfile, setIsAuth } = useStore();

    const { isLoading } = useQuery('user', api.getUser, {
        onSuccess: data => {
            setProfile(data.user);
            setIsAuth(true);
        },
        onError: () => {
            setProfile(null);
            setIsAuth(false);
        },
        retry: 1
    });

    if (isLoading) {
        return <p>...Loading</p>;
    }

    return <>{children}</>;
};

export default Layout;
