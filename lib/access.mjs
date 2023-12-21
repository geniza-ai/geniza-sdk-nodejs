import crypto from 'crypto';

class Access {
  constructor(key, secretKey) {
    this.key = key;
    this.secretKey = secretKey;
  }

  hmac(message) {
    return crypto.createHmac('sha256', this.secretKey)
      .update(message)
      .digest('hex')
      .toUpperCase();
  }
}

export default Access;
