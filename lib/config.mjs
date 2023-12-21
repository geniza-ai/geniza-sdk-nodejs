const SB_BASE_URI = 'https://sandbox.geniza.ai/';
const PROD_BASE_URI = 'https://api.geniza.ai/';
const BASE_PATH = 'v1/';
export const VERSION = '0.1.2';

class Config {
  constructor(access, requestTimeoutSecs) {
    this.baseUri = null;
    this.access = access;
    this.requestTimeoutSecs = requestTimeoutSecs || 10;
    this.setAsProduction();
  }

  setAsSandbox() {
    this.baseUri = SB_BASE_URI + BASE_PATH;
  }

  setAsProduction() {
    this.baseUri = PROD_BASE_URI + BASE_PATH;
  }
}

export default Config;
