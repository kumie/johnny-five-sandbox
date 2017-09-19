/**
 * A Mock of the Johnny Five Board class
 */
class FiveBoardMock {
  constructor() {

  }

  on() {
	return jasmine.createSpy();
  }
}

export default FiveBoardMock;
