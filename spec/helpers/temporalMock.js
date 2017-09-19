import _ from 'lodash';

/**
 * Mocks the temporal plugin
 */
const temporalMock = {
  numberOfTimesToLoop: 2,

  loop: function (milliseconds, callback = _.noop) {
    for(let idx = 1; idx < this.numberOfTimesToLoop + 1; idx++) {
      callback({ called: idx });
    }
  }
};

export default temporalMock;
