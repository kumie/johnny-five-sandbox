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
    const pins = [this.createPin(4), this.createPin(5)];

    this.stop(pins);
    this.promptForSteps(pins);
  }

  createPin(position) {
    return new five.Pin(position);
  }

  promptForSteps(pins) {
    repl.start({
      prompt: '> Direction and number of steps e.g. STEPCW 5\n',
      eval: (userStepsInput) => {
        this.evalUserStepsInput({ userStepsInput, pins });
      }
    });
  }

  evalUserStepsInput({ userStepsInput, pins }) {
    const direction = this.getDirection(userStepsInput);
    const numberOfSteps = this.getNumberOfSteps(userStepsInput);

    if (direction && numberOfSteps) {
      this.start({ pins, direction, numberOfSteps });
    }
  }

  /**
   * Determines whether the direction is clock wise or counter clock wise
   * @param {String} userStepsInput - e.g. 'STEPCW 5'
   * @returns {String}
   */
  getDirection(userStepsInput) {
    const directionPattern = /c(c|w)+/i;
    const directionMatch = userStepsInput.match(directionPattern);

    if (_.isArray(directionMatch)) {
      return _.chain(directionMatch)
        .head()
        .toLower()
        .value();
    }

    return '';
  }

  getNumberOfSteps(userStepsInput) {
    const numberOfStepsMatch = userStepsInput.match(/\d/g);

    if (_.isArray(numberOfStepsMatch)) return numberOfStepsMatch.join('');
  }

  start({ pins, direction, numberOfSteps }) {
    temporal.loop(100, (temporal) => {
      if (temporal.called <= numberOfSteps) {
        const lowOrHigh = temporal.called % 2 === 0 ? 'high' : 'low';
        this.doStep({ pins, lowOrHigh, direction });
      }
    });
  }

  stop(pins) {
    _.invokeMap(pins, 'low');
  }

  doStep({ pins, direction, lowOrHigh }) {
    const [pin1, pin2] = pins;

    pin1[lowOrHigh]();

    if (direction === MotorStepper.DIRECTION.CCW) {
      pin2[lowOrHigh]();
    }
  }
}

MotorStepper.DIRECTION = {
  CW: 'cw',
  CCW: 'ccw'
};

module.exports = MotorStepper;
