import Access from './access';
import Config from './config';
import Client from './client';

class Geniza {
  constructor(key, secretKey, sandboxMode) {
    const access = new Access(key, secretKey);
    this.config = new Config(access);
    this.client = new Client(this.config);

    if (sandboxMode) {
      this.config.setAsSandbox();
    }
  }

  async askSapientSquirrel(question) {
    const payload = { question };
    const response = await this.client.post('sapientSquirrel', payload);
    return response.answer;
  }

  async provideFeedback(uuid, rating, feedback) {
    if (rating < 0 || rating > 1) {
      throw Error('Rating must be between 0 and 1');
    }
    const payload = { uuid, rating, feedback };
    return this.client.post('feedback', payload);
  }

  async extractStockSymbols(text) {
    if (text === null || text.length === 0) {
      throw new Error('You must supply text from which to extract stocks');
    }
    const payload = { text };
    return this.client.post('extractors/stock_symbols', payload);
  }
}

export default Geniza;
