import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Header from '../components/Header';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Layout from '../components/Layout';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="bg-gray-800 min-h-screen text-white px-5 md:px-10 lg:px-40 pt-5 flex flex-col items-center font-Nunito">
                <Layout>
                    <Header />
                    <Component {...pageProps} />
                </Layout>
            </div>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}

export default MyApp;
