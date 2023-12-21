import { expect, jest, test } from '@jest/globals';
import Access from '../lib/access';
import Config from '../lib/config';

jest.unstable_mockModule('axios', () => ({
  default: jest.fn(),
  request: jest.fn()
}));

// Modules that are tested with mocks must be imported dynamically to give Jest a
// chance to mock them first, see https://jestjs.io/docs/ecmascript-modules.
const axios  = await import ('axios');
const {default: Client, serialise} = await import('../lib/client');

const key = '123';
const secretKey = 'xyz';
const access = new Access(key, secretKey);
const config = new Config(access);
const client = new Client(config);
const testEndpoint = 'post_endpoint'
const testPayload = { a: 1, b: 'two/2🍍', c: null }
const addHeader = {'X-Geniza-Custom-Header': 'FooBar'}

test('Serialises a null payload to the empty string', () => {
  const ser = serialise(null);
  expect(ser).toEqual('');
});

test('Does not escape extended chars or slashes', () => {
  const ser = serialise(testPayload);
  expect(ser.includes('\\')).toBeFalsy();
});

test('Makes a service request using HTTP POST', async () => {
  axios.request.mockImplementationOnce((args) => {
    const payload = JSON.parse(args.data);
    expect(payload).toEqual(testPayload);
    return {
      status: 200,
      data: testPayload
    }
  });

  const respPayload = await client.post(testEndpoint, testPayload);
  expect(respPayload).toEqual(testPayload);
});

test('Transmits user provided headers', async () => {
  axios.request.mockImplementationOnce((args) => {
    expect(args.headers['X-Geniza-Custom-Header']).toEqual(addHeader['X-Geniza-Custom-Header']);
    return {
      status: 200,
      data: {}
    }
  });

  await client.post(testEndpoint, null, addHeader);
});

test('Transmits standard Geniza headers', async () => {
  axios.request.mockImplementationOnce((args) => {
    expect(args.headers['Accept']).toEqual('application/json');
    expect(args.headers['Content-Type']).toEqual('application/json');
    expect(args.headers['User-Agent']).toMatch(/Geniza.ai-SDK-Node.js\/.+, Node.js\/.+/);
    return {
      status: 200,
      data: {}
    }
  });

  await client.post(testEndpoint, null, addHeader);
});

test('Transmits the Geniza authentication header', async () => {
  axios.request.mockImplementationOnce((args) => {
    const hmacHeader = args.headers['Authorization'];
    const result = hmacHeader.match(/^HMAC-SHA256 (\w+):(\w+)$/m);
    expect(result[1]).toEqual(key);
    const hmacExpected = access.hmac(args.data);
    expect(result[2]).toEqual(hmacExpected);
    return {
      status: 200,
      data: {}
    }
  });

  await client.post(testEndpoint, testPayload);
});

