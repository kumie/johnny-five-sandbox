import PinMock from './PinMock';
import BoardMock from './BoardMock';

const johnnyFiveMock = {
  Board: BoardMock,
  Led: {
    pulse: jasmine.createSpy()
  },
  Pin: PinMock
};

export default johnnyFiveMock;
