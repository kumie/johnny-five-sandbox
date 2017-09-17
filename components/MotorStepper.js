const five = require('johnny-five') ;
const temporal = require('temporal');
const repl = require('repl');
const _ = require('lodash');
const board = new five.Board({ repl: false });

class MotorStepper {
  constructor() {
    board.on('ready', this.handleBoardReady.bind(this));
  }

  handleBoardReady() {
    const pin = this.createPin(4);

    this.stop(pin);
    this.promptForSteps(pin);
  }

  createPin(position) {
    return new five.Pin(position);
  }

  promptForSteps(pin) {
    repl.start({
      prompt: '> Please enter the direction and number of steps e.g. STEPCW 5\n',
      eval: (userInput) => {
        this.evalUserStepsInput(userInput, pin);
      }
    });
  }

  evalUserStepsInput(userStepsInput, pin) {
    const direction = this.getDirection(userStepsInput);
    const numberOfSteps = this.getNumberOfSteps(userStepsInput);

    if (direction && numberOfSteps) {
      this.start({ pin, direction, numberOfSteps });
    }
  }

  getDirection(userStepsInput) {
    const directionPattern = /c(c|w)+/i;
    const directionMatch = userStepsInput.match(directionPattern);

    if (_.isArray(directionMatch)) return directionMatch[0];

    return null;
  }

  getNumberOfSteps(userStepsInput) {
    const numberOfStepsMatch = userStepsInput.match(/\d/g);

    if (_.isArray(numberOfStepsMatch)) return numberOfStepsMatch.join('');
  }

  start({ pin, direction, numberOfSteps }) {
    temporal.loop(10, (temporal) => {
      if (temporal.called <= numberOfSteps) {
        const lowOrHigh = temporal.called % 2 === 0 ? 'high' : 'low';
        this.doStep({ pin, lowOrHigh });
      }
    });
  }

  stop(pin) {
    pin.low();
  }

  doStep({ pin, lowOrHigh }) {
    return pin[lowOrHigh]();
  }
}

module.exports = MotorStepper;
