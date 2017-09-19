/**
 * A Mock of the  Johnny Five Pin class
 */
class Pin {
  constructor() {

  }

  high() {
    return jasmine.createSpy();
  }

  low() {
    return jasmine.createSpy();
  }
}

export default Pin;
