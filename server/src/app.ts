import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import ExpressMysqlSession from 'express-mysql-session';
import { __prod__ } from './global/constants';

// SETUP UP DOTENV
import dotenv from 'dotenv';
dotenv.config();

// DB CONNECTION
import './db/connection';

// IMPORTING ROUTES
import { authRoutes } from './routes';

declare module 'express-session' {
    interface SessionData {
        userId: number;
    }
}

const app: Application = express();
const PORT = process.env.PORT ?? 5000;
const MySQLStore = ExpressMysqlSession(session as any);
const sessionStore = new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);
app.use(cookieParser());
app.use(
    session({
        name: 'sid',
        secret: process.env.SESSION_SECRET!,
        resave: false,
        cookie: {
            sameSite: 'lax',
            httpOnly: true,
            secure: __prod__,
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10
        },
        store: sessionStore,
        saveUninitialized: false
    })
);

// ROUTES
app.use('/auth', authRoutes);

// STARTING THE SERVER
app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});
