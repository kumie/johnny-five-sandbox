const five = require('johnny-five') ;
const temporal = require('temporal');
// const board = new five.Board();
// const led = new five.Led();

/**
 * @class MotorStepper
 * @param {Number} nTimesToRun
 */
class MotorStepper {
  constructor(nTimesToRun = 100) {
    // board.on('ready', () => {
    //   this.stop();
    //   this.start();
    // });
    this.nTimesToRun = nTimesToRun;
    this.start();
  }

  start() {
    temporal.loop(10, (temporal) => {
      if (temporal.called <= this.nTimesToRun) {
        this.doStep(temporal.called);
      }
    });
  }

  stop() {
    led.stop();
  }

  doStep(nTimesRun) {
    console.log(nTimesRun);
    // led.start();
  }
}

module.exports = MotorStepper;
