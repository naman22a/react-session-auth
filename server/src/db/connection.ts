import { DataSource } from 'typeorm';
import { User } from '../models';
import { __prod__ } from '../global/constants';

const connection = new DataSource({
    type: 'mysql',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: !__prod__,
    entities: [User]
});

connection
    .initialize()
    .then(() => {
        console.log('connected');
    })
    .catch(error => {
        console.error(error);
    });
