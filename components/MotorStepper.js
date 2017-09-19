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

  /**
   *
   * @param {Number} position
   * @returns {five.Pin}
   */
  createPin(position) {
    return new five.Pin(position);
  }

  promptForSteps(pins) {
    repl.start({
      prompt: '> Direction and number of steps e.g. STEPCW 5\n',
      eval: (userStepsInput) => {
        this.evalUserStepsInputAndStart({ userStepsInput, pins });
      }
    });
  }

  /**
   * Determines the direction and number of steps the user has requested and executes them.
   * @param {String} userStepsInput
   * @param {Array} pins
   */
  evalUserStepsInputAndStart({ userStepsInput, pins }) {
    const direction = this.getDirection(userStepsInput);
    const numberOfSteps = this.getNumberOfSteps(userStepsInput);

    if (direction && numberOfSteps) {
      this.start({ pins, direction, numberOfSteps });
    }
  }

  /**
   * Determines whether the direction is clock wise or counter clock wise
   * @example this.getDirection('STEPCCW') => 'ccw'
   * @param {String} userStepsInput - The step instructions the user has entered, e.g. 'STEPCW 5'
   * @returns {String} Returns 'cw', 'ccw', or an empty string
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

  /**
   *
   * @param userStepsInput - The step instructions the user has entered, e.g. 'STEPCW 5'
   * @returns {Number} Returns 0 if no steps are given
   */
  getNumberOfSteps(userStepsInput) {
    const numberOfStepsMatch = userStepsInput.match(/\d/g);

    if (_.isArray(numberOfStepsMatch)) {
      return Number(numberOfStepsMatch.join(''));
    }

    return 0;
  }

  /**
   *
   * @param {Array} pins
   * @param {String} direction
   * @param {Number} numberOfSteps
   */
  start({ pins, direction, numberOfSteps }) {
    temporal.loop(10, (temporal) => {
      if (temporal.called <= numberOfSteps) {
        const lowOrHigh = temporal.called % 2 === 0 ? 'high' : 'low';
        this.doStep({ pins, lowOrHigh, direction });
      }
    });
  }

  stop(pins) {
    _.invokeMap(pins, 'low');
  }

  /**
   * Toggles the pins.  If the given direction is 'cw', only the first pin will be toggled. If the direction is
   * 'ccw', both pins will be toggled.
   * @param {Array} pins
   * @param {String} direction
   * @param {String} lowOrHigh
   */
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
