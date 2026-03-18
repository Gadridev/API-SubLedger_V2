function sendErrorDev(err, req, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
}
function sendErrorProd(err, req, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}

function ErrorMiddleware(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    sendErrorProd(err, req, res);
  }
}

export default ErrorMiddleware;