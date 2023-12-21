import { expect, jest, test } from '@jest/globals';

jest.unstable_mockModule('axios', () => ({
  default: jest.fn(),
  request: jest.fn()
}));

// Modules that are tested with mocks must be imported dynamically to give Jest a
// chance to mock them first, see https://jestjs.io/docs/ecmascript-modules.
const axios  = await import ('axios');
const {default: Geniza} = await import('../lib/geniza');

const key = '123';
const secretKey = 'xyz';
const geniza = new Geniza(key, secretKey, true);

test('asks questions of the Sapient Squirrel', async () => {
  axios.request.mockImplementationOnce((args) => {
    const payload = JSON.parse(args.data);
    expect(payload).toEqual({ question: '1234567890' });
    return {
      status: 200,
      data: { answer: 'qwerty' }
    }
  });
  const answer = await geniza.askSapientSquirrel('1234567890');
  expect(answer).toEqual('qwerty');
});

test('provides feedback to Geniza AI', async () => {
  axios.request.mockImplementationOnce((args) => {
    const payload = JSON.parse(args.data);
    expect(payload).toEqual({ uuid: '123', rating: 0.99999, feedback: 'Fee fi fo fum' });
    return {
      status: 200,
      data: {}
    }
  });
  await geniza.provideFeedback('123', 0.99999, 'Fee fi fo fum');
});

test('extracts stock symbols', async () => {
  axios.request.mockImplementationOnce((args) => {
    const payload = JSON.parse(args.data);
    const stockSymbols = Array.from(
      payload.text.matchAll(/(MSFT)/g),
      (match) => match[0]
    );
    return {
      status: 200,
      data: stockSymbols
    }
  });
  const stockSymbols = await geniza.extractStockSymbols('MSFT has bought all of its employees Macbooks');
  expect(stockSymbols).toEqual(['MSFT']);
});

