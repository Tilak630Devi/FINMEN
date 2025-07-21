const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Handle specific Mongoose errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ success: false, error: messages.join(', ') });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid resource identifier' });
  }

  // Duplicate key error (e.g., email already exists)
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue);
    return res.status(400).json({ success: false, error: `${field} already exists` });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export { errorHandler };
