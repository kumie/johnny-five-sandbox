import _ from 'lodash';
import mockery from 'mockery';
import temporalMock from '../helpers/temporalMock';

describe('Stepper Motor', () => {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
    useCleanCache: true
  });

  mockery.registerMock('temporal', temporalMock);

  const Stepper = require('../../modules/StepperMotor');

  let stepper;

  beforeEach(() => {
    stepper = new Stepper();
  });

  afterEach(() => {
    stepper.stop();
  });

  afterAll(() => {
    mockery.disable();
  });

  it('Should run the doStep method twice every 10ms using the temporal plugin', () => {
    spyOn(stepper, 'doStep').and.callFake(_.noop);

    stepper.start({
      pins: [{}, {}],
      direction: 'ccw',
      numberOfSteps: 2
    });

    expect(stepper.doStep.calls.count()).toEqual(2);
  });
});
