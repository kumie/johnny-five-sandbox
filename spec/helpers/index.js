import mockery from 'mockery';

beforeAll(() => {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
    useCleanCache: true
  });

  mockery.registerMock('johnny-five', {
    Board: {
      on: jasmine.createSpy()
    },
    Led: {
      pulse: jasmine.createSpy()
    }
  });
});

afterAll(() => {
  mockery.disable();
});
