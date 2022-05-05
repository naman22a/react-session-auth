import { Router } from 'express';
import {
    postRegister,
    postLogin,
    getUser,
    getUsers,
    postLogout,
    changePassword,
    deleteAccount
} from '../controllers/auth';
import { isAuth } from '../middleware';
import { body } from 'express-validator';

const router = Router();

router.get('/', (_req, res) => {
    res.send('auth');
});

router.post(
    '/register',
    body('name').not().isEmpty().withMessage('Please enter a name'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('email').isEmail().withMessage('Invalid email'),
    postRegister
);
router.post(
    '/login',
    body('password').not().isEmpty().withMessage('Please enter a password'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    postLogin
);
router.post('/logout', isAuth, postLogout);
router.get('/user', isAuth, getUser);
router.get('/users', getUsers);
router.patch(
    '/change-password',
    body('newPassword')
        .not()
        .isEmpty()
        .withMessage('Please enter a new Password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    isAuth,
    changePassword
);
router.delete('/delete-account', isAuth, deleteAccount);

export default router;
