import '../setup.js';
import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import { mutations } from '@/store'

describe('mutations', () => {
  const {newFavlist} = mutations;

  it('adds a favlist', () => {
    const state = {favlists: []};
    newFavlist(state);

    expect(state.favlists.length).to.equal(1);
  });
});
