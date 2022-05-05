import { Request, Response, NextFunction } from 'express';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        res.status(401).json({
            ok: false,
            errors: [
                {
                    field: 'authentication',
                    message: 'not authenticated'
                }
            ]
        });
        return;
    }

    next();
};

export default isAuth;
