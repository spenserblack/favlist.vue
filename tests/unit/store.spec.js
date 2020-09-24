import '../setup.js';
import { expect } from 'chai';
import { mutations } from '@/store';

describe('Vuex store', () => {
  describe('mutations', () => {
    describe('newFavlist', () => {
      const {newFavlist} = mutations;

      it('adds a favlist', () => {
        const state = {favlists: []};
        newFavlist(state);

        expect(state.favlists).to.have.lengthOf(1);

        const [favlist] = state.favlists;

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
        const [removed, remaining] = state.favlists;

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

    describe('updateHeader', () => {
      const {updateHeader} = mutations;
      const state = {favlists: [{columns: ['a', 'b']}]};

      it('should update the column header', () => {
        updateHeader(state, {favlistIndex: 0, columnIndex: 1, header: 'c'});

        expect(state.favlists[0].columns).to.deep.equal(['a', 'c']);
      });
    });

    describe('updateCell', () => {
      const {updateCell} = mutations;
      const state = {favlists: [{data: [
        [{datum: 'a'}, {datum: 'i'}, {datum: 'u'}],
        [{datum: 'あ'}, {datum: 'い'}, {datum: 'お'}],
      ]}]};

      it("should update the cell's value", () => {
        updateCell(state, {
          favlistIndex: 0,
          columnIndex: 1,
          cellIndex: 2,
          datum: 'う',
        });

        expect(state.favlists[0].data).to.deep.equal([
          [{datum: 'a'}, {datum: 'i'}, {datum: 'u'}],
          [{datum: 'あ'}, {datum: 'い'}, {datum: 'う'}],
        ]);
      });
    });

    describe('addRow', () => {
      const {addRow} = mutations;

      it('should add a new "row" to a single-column empty favlist', () => {
        const state = {favlists: [{data: [[]]}]};

        addRow(state, 0);

        expect(state.favlists[0].data[0]).to.not.be.empty;
        expect(state.favlists[0].data[0][0]).to.include({datum: ''});
      });

      it('should add a new "row" to a multi-column empty favlist', () => {
        const state = {favlists: [{data: [[], [], []]}]};

        addRow(state, 0);

        expect(state.favlists[0].data).to.have.lengthOf(3);
        state.favlists[0].data.forEach(item => {
          expect(item).to.not.be.empty;
          expect(item[0]).to.include({datum: ''});
        });

      });
      it('should add a new "row" to a single-column favlist with data', () => {
        const state = {favlists: [{data: [[{datum: '1'}]]}]};

        addRow(state, 0);

        expect(state.favlists[0].data[0]).to.have.lengthOf(2);
        expect(state.favlists[0].data[0][1]).to.include({datum: ''});
      });

      it('should add a new "row" to a multi-column favlist with data', () => {
        const state = {favlists: [{data: [
          [{datum: '1'}],
          [{datum: '2'}],
          [{datum: '3'}],
        ]}]};

        addRow(state, 0);

        expect(state.favlists[0].data).to.have.lengthOf(3);
        state.favlists[0].data.forEach(item => {
          expect(item).to.have.lengthOf(2);
          expect(item[1]).to.include({datum: ''});
        });
      });
    });
  });
});
