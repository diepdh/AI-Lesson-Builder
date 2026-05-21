/**
 * Base API client for fetch requests
 */

export const client = async (endpoint, { body, ...customConfig } = {}) => {
  const headers = { 'Content-Type': 'application/json' };

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await window.fetch(endpoint, config);
    const responseText = await response.text();
    let data = {};

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        data = {
          ok: false,
          error: responseText || parseError.message
        };
      }
    }

    if (response.ok) {
      return data;
    }
    return {
      ok: false,
      error: data.error || response.statusText || 'Request failed',
      details: data.details,
      status: response.status
    };
  } catch (err) {
    return { ok: false, error: err.message || 'Network error' };
  }
};

client.get = (endpoint, config) => client(endpoint, { ...config, method: 'GET' });
client.post = (endpoint, body, config) => client(endpoint, { ...config, body, method: 'POST' });
client.put = (endpoint, body, config) => client(endpoint, { ...config, body, method: 'PUT' });
client.delete = (endpoint, config) => client(endpoint, { ...config, method: 'DELETE' });
