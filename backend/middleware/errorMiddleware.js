// Catches errors passed via next(err) and any uncaught throws inside routes.
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Something went wrong on the server.",
  });
}

// Catches requests to routes that don't exist.
function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
