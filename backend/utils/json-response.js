/**
 * Utility to standardize API responses
 */
const jsonResponse = {
  success: (res, data = {}, message = 'Success') => {
    return res.status(200).json({
      ok: true,
      ...data,
      message
    });
  },

  error: (res, error = 'Internal Server Error', details = null, status = 500) => {
    return res.status(status).json({
      ok: false,
      error,
      details
    });
  },

  unauthorized: (res, error = 'Unauthorized') => {
    return res.status(401).json({ ok: false, error });
  },

  notFound: (res, error = 'Not Found') => {
    return res.status(404).json({ ok: false, error });
  },

  badRequest: (res, error = 'Bad Request', details = null) => {
    return res.status(400).json({ ok: false, error, details });
  },

  unprocessable: (res, error = 'Unprocessable Entity', details = null) => {
    return res.status(422).json({ ok: false, error, details });
  }
};

module.exports = jsonResponse;
