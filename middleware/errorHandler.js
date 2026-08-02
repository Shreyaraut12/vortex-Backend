// Centralized error handler. Must be registered LAST, after all routes.
// Any error passed to next(err), or thrown inside an async route handler
// (Express 5 auto-forwards these), ends up here instead of crashing the
// process or leaking a raw stack trace to the client.
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`[${req.method}] ${req.originalUrl} -> ${statusCode}: ${message}`);

    const response = { message };

    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
