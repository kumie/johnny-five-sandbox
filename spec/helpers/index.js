import mockery from 'mockery';
import johnnyFiveMock from './johnnyFiveMock';

beforeAll(() => {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
    useCleanCache: true
  });

  mockery.registerMock('johnny-five', johnnyFiveMock);
});

afterAll(() => {
  mockery.disable();
});
