import { Request, Response } from 'express';
import { User } from '../models';
import { hash, verify } from 'argon2';
import { validationResult } from 'express-validator';

// -- REGISTER
export const postRegister = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array().map(error => {
                return {
                    field: error.param,
                    message: error.msg
                };
            })
        });
    }

    try {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        field: 'email',
                        message: 'User already exists with this email'
                    }
                ]
            });
        }

        const hashedPassword = await hash(password);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        }).save();

        req.session.userId = newUser.id;

        return res.status(201).json({
            ok: true,
            errors: null
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    field: 'Server',
                    messsage: 'Internal Server Error'
                }
            ]
        });
    }
};

// -- LOGIN
export const postLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array().map(error => {
                return {
                    field: error.param,
                    message: error.msg
                };
            })
        });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        field: 'email',
                        message: 'User does not exists with this email'
                    }
                ]
            });
        }

        const isMatch = await verify(user.password, password);

        if (!isMatch) {
            return res.status(400).json({
                ok: false,
                errors: [
                    {
                        field: 'password',
                        message: 'Passwords do not match'
                    }
                ]
            });
        }

        req.session.userId = user.id;

        return res.status(200).json({
            ok: true,
            errors: null
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    field: 'Server',
                    messsage: 'Internal Server Error'
                }
            ]
        });
    }
};

// -- LOGOUT
export const postLogout = async (req: Request, res: Response) => {
    req.session.destroy(error => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: 'Something went wrong'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'logged out'
        });
    });
};

// -- GET USER
export const getUser = async (req: Request, res: Response) => {
    try {
        const { password, ...result } = (await User.findOne({
            where: { id: req.session.userId }
        })) as User;

        return res.status(200).json({ user: result, errors: null });
    } catch (error) {
        return res.status(500).json({
            user: null,
            errors: [
                {
                    field: 'Server',
                    messsage: 'Internal Server Error'
                }
            ]
        });
    }
};

// -- GET USERS
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            users: users.map(user => {
                const { password, ...result } = user;
                return {
                    ...result
                };
            }),
            errors: null
        });
    } catch (error) {
        return res.status(500).json({
            users: null,
            errors: [
                {
                    field: 'Server',
                    messsage: 'Internal Server Error'
                }
            ]
        });
    }
};

// -- CHANGE PASSWORD
export const changePassword = async (req: Request, res: Response) => {
    const { newPassword } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array().map(error => {
                return {
                    field: error.param,
                    message: error.msg
                };
            })
        });
    }

    try {
        const hashedPassword = await hash(newPassword);
        await User.update(
            { id: req.session.userId },
            { password: hashedPassword }
        );

        // logging out the user
        req.session.destroy(error => {
            if (error) {
                return res.status(401).json({
                    ok: false,
                    errors: [
                        {
                            field: 'authentication',
                            message: 'Something went wrong'
                        }
                    ]
                });
            }

            return res.status(200).json({
                ok: true,
                errors: null
            });
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    field: 'Server',
                    messsage: 'Internal Server Error'
                }
            ]
        });
    }
};

// -- DELETE ACCOUNT
export const deleteAccount = async (req: Request, res: Response) => {
    console.log('delete');
    try {
        await User.delete({ id: req.session.userId });

        // logging out the user
        req.session.destroy(error => {
            if (error) {
                return res.status(401).json({
                    ok: false,
                    errors: [
                        {
                            field: 'authentication',
                            message: 'Something went wrong'
                        }
                    ]
                });
            }

            return res.status(200).json({
                ok: true,
                errors: null
            });
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            errors: [
                {
                    field: 'Server',
                    messsage: 'Internal Server Error'
                }
            ]
        });
    }
};
