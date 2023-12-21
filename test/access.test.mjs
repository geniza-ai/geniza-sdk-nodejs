import Access from '../lib/access';

const key = '123';
const secretKey = 'xyz';
const access = new Access(key, secretKey);

test('Computes an HMAC for a test message', () => {
  const hmac = access.hmac('Ask not for whom the bell tolls');
  const expectedHex = '63A73C45F3908562051EB74FBBC9B90F97FAB8A6F64748B4E1E5F7F38A0EFF79';
  expect(hmac).toEqual(expectedHex);
});
