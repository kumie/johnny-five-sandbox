import mockery from 'mockery';
import { SpecReporter } from 'jasmine-spec-reporter';
import johnnyFiveMock from './johnnyFiveMock';

// add a more detailed Jasmine spec reporter
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
  spec: {
    displayPending: true
  }
}));

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false,
  useCleanCache: true
});

mockery.registerMock('johnny-five', johnnyFiveMock);

afterAll(() => {
  mockery.disable();
});
