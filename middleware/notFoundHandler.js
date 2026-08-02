// Runs when no route matched. Registered after all routes, before errorHandler.
const notFoundHandler = (req, res, next) => {
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
};

module.exports = notFoundHandler;
