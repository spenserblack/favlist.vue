import {v4 as uuidv4} from 'uuid';

export default class Cell {
  constructor(datum) {
    this.datum = datum;
    this.key = uuidv4();
  }
}
