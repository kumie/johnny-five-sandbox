const five = require('johnny-five') ;
const temporal = require('temporal');
const _ = require('lodash');
const board = new five.Board();

/**
 * @class MotorStepper
 * @example new MotorStepper('stepccw', 5)
 * @param {Object} [opts= {}] - Configuration options
 * @param {Array} [opts.pinPositions = [4, 5]] - The optional pin positions on the board.  The default
 * positions are 4 and 5
 *
 */
class MotorStepper {
  constructor({ pinPositions = [4, 5] } = {}) {
    board.on('ready', this.handleBoardReady.bind(this, pinPositions));
  }

  handleBoardReady(pinPositions) {
    const pins = _.map(pinPositions, this.createPin.bind(this));

    this.stop(pins);
    this.promptForCommands(pins);
  }

  /**
   *
   * @param {Number} position
   * @returns {five.Pin}
   */
  createPin(position) {
    return new five.Pin(position);
  }

  /**
   * @example CMD('stepccw', 5)
   * @param {Array} pins
   */
  promptForCommands(pins) {
    board.repl.inject({
      CMD: (...commands) => {
        const [stepCommand, numberOfSteps] = commands;
        const direction = this.getDirection(stepCommand);

        this.start({ pins, direction, numberOfSteps });
      }
    });
  }

  /**
   * Determines whether the direction is clock wise or counter clock wise
   * @example this.getDirection('STEPCCW') => 'ccw'
   * @param {String} stepCommand - The step instructions the user has entered, e.g. 'STEPCW 5' or 'stepccw'
   * @returns {String} e.g. 'ccw'
   */
  getDirection(stepCommand) {
    return _.chain(stepCommand)
      .split(/step/i)
      .last()
      .toLower()
      .value();
  }

  /**
   *
   * @param {Array} pins
   * @param {String} direction
   * @param {Number} numberOfSteps
   */
  start({ pins, direction, numberOfSteps }) {
    temporal.loop(500, (temporal) => {
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
   * @param {String} lowOrHigh - Whether the pins should be set to 'low' or 'high'
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
