import { ErrorHandler } from '../utils/errorHandle.js';

export const errorMiddleware = (err, req, res, next) => {
    // Check if the error is an instance of ErrorHandler
    if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // For any other error, return a generic message
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
};