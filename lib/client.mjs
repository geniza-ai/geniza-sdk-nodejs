import { VERSION } from './config';

// Modules that are tested with mocks must be imported dynamically to give Jest a
// chance to mock them first, see https://jestjs.io/docs/ecmascript-modules.
const axios = await import('axios');

// JSON payload formatting convention:
// - Slashes should not be escaped
// - Non-ASCII chars should not be escaped
// - A null payload becomes the empty string
export function serialise(payload) {
  if (payload === null) {
    return '';
  }
  return JSON.stringify(payload);
}

class Client {
  constructor(config) {
    this.config = config;
  }

  async post(url, payload, addHeaders = null) {
    return this.request('POST', url, payload, addHeaders);
  }

  async request(method, url, payload, addHeaders = null) {
    const message = serialise(payload);
    const hmac = this.config.access.hmac(message);

    const stdHeaders = {
      Accept: 'application/json',
      Authorization: `HMAC-SHA256 ${this.config.access.key}:${hmac}`,
      'Content-Type': 'application/json',
      'User-Agent': `Geniza.ai-SDK-Node.js/${VERSION}, Node.js/${process.version}`,
    };

    // The user's additional headers come first in the object union that
    // follows so that we overwrite any Geniza standard headers they may
    // have set with our own values.
    const headers = { ...addHeaders, ...stdHeaders };

    const response = await axios.request({
      method,
      url,
      headers,
      data: message,
      timeout: this.config.requestTimeoutSecs,
    });
    if (response.status !== 200) {
      throw new Error(`HTTP Status ${response.status}: ${response.data}`);
    }
    return response.data;
  }
}

export default Client;
