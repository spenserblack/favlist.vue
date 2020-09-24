import '../setup.js';
import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import { mutations } from '@/store'

describe('Vuex store', () => {
  describe('mutations', () => {
    describe('newFavlist', () => {
      const {newFavlist} = mutations;

      it('adds a favlist', () => {
        const state = {favlists: []};
        newFavlist(state);

        expect(state.favlists).to.have.lengthOf(1);

        const favlist = state.favlists[0];

        expect(favlist.title).to.be.a('string');
        expect(favlist.columns).to.be.an('array');
        expect(favlist.data).to.be.an('array');
      });
    });

    describe('removeFavlist', () => {
      const {removeFavlist} = mutations;

      const state = {
        favlists: [
          {
            title: 'numbers',
            columns: ['odd', 'even'],
            data: [
              [
                {datum: '1'},
                {datum: '3'},
                {datum: '5'},
              ],
              [
                {datum: '2'},
                {datum: '4'},
                {datum: '6'},
              ],
            ],
          },
          {
            title: 'types',
            columns: ['name'],
            data: [
              [
                {datum: 'number'},
                {datum: 'string'},
                {datum: 'array'},
              ],
            ],
          },
        ],
      };

      it('removes a favlist', () => {
        const removed = state.favlists[0];
        const remaining = state.favlists[1];

        removeFavlist(state, 0);

        expect(state.favlists)
          .to
          .have
          .lengthOf(1)
          .and
          .to
          .deep
          .include(remaining)
          .and
          .to
          .not
          .deep
          .include(removed);
      });

      it('removes the last favlist', () => {
        removeFavlist(state, 0);

        expect(state.favlists).to.be.empty;
      });
    });

    describe('updateTitle', () => {
      const {updateTitle} = mutations;
      const state = {favlists: [{title: 'Hello!'}]};

      it('should update the title', () => {
        updateTitle(state, {favlistIndex: 0, title: 'Goodbye!'});

        expect(state.favlists[0].title).to.equal('Goodbye!');
      });
    });
  });
});
