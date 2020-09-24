import chai from 'chai';
import {mutations} from '../src/store'

const {expect} = chai;

describe('mutations', () => {
  const {newFavlist} = mutations;

  it('adds a favlist', () => {
    const state = {favlists: []};
    newFavlist(state);

    expect(state.favlists.length).to.equal(1);
  });
});
