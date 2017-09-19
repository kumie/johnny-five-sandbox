import PinMock from './PinMock';

const johnnyFiveMock = {
  Board: {
    on: jasmine.createSpy()
  },
  Led: {
    pulse: jasmine.createSpy()
  },
  Pin: PinMock
};

export default johnnyFiveMock;
