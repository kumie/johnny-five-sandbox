// const five = require('johnny-five') ;
const temporal = require('temporal');
const repl = require('repl');
// const board = new five.Board();
// const led = new five.Led();


class MotorStepper {
  constructor() {
    // board.on('ready', () => {
    //   this.stop();
    //   this.start(nTimesToRun);
    // });
    this.promptForSteps();
  }

  promptForSteps() {
    // direction
    repl.start({ prompt: '> Number of times to step: ', eval: this.start.bind(this) });
  }

  start(nTimesToStep) {
    console.log(nTimesToStep);
    temporal.loop(10, (temporal) => {
      if (temporal.called <= nTimesToStep) {
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
