// const five = require('johnny-five') ;
const temporal = require('temporal');
// const board = new five.Board();
// const led = new five.Led();

/**
 * @class MotorStepper
 * @param {Object} opts - Configuration options
 * @param {Number} [opts.nTimesToRun = 100] - The number of times to have the stepper pulse.
 */
class MotorStepper {
  constructor({ nTimesToRun = 100 } = {}) {
    // board.on('ready', () => {
    //   this.stop();
    //   this.start(nTimesToRun);
    // });
    this.start(nTimesToRun);
  }

  start(nTimesToRun) {
    temporal.loop(10, (temporal) => {
      if (temporal.called <= nTimesToRun) {
        this.doStep(temporal.called);
      }
    });
  }

  stop() {
    // led.stop().off();
  }

  doStep(nTimesRun) {
    console.log(nTimesRun);
    // led.pulse();
  }
}

module.exports = MotorStepper;
