import '../setup.js';
import { expect } from 'chai';
import getters from '@/store/getters';
import { mutations } from '@/store';

describe('Vuex store', () => {
  describe('getters', () => {
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
        {
          title: 'empty',
          columns: [],
          data: [],
        },
      ],
    };

    it('should get a list from an index', () => {
      const favlist = getters.favlist(state)(0);

      expect(favlist).to.deep.equal(state.favlists[0]);
    });

    it('should get a list title from an index', () => {
      const favlist = getters.favlist(state);
      const title = getters.title(state, {favlist})(0);

      expect(title).to.be.a('string').and.to.equal('numbers');
    });

    it('should get the column headers of a list', () => {
      const favlist = getters.favlist(state);
      const headers = getters.headers(state, {favlist})(0);

      expect(headers).to.be.an('array').and.to.deep.equal(['odd', 'even']);
    });

    it('should get an individual column header of a list', () => {
      const favlist = getters.favlist(state);
      const headers = getters.headers(state, {favlist});
      const header = getters.header(state, {headers})(0, 1);

      expect(header).to.be.a('string').and.to.equal('even');
    });

    it('should get the data of a list', () => {
      const favlist = getters.favlist(state);
      const data = getters.data(state, {favlist})(0);

      expect(data).to.be.an('array').and.to.deep.equal(state.favlists[0].data);
    });

    it('should get a column of data', () => {
      const favlist = getters.favlist(state);
      const data = getters.data(state, {favlist});
      const column = getters.column(state, {data})(0, 1);

      expect(column).to.be.an('array')
        .and.to.deep.equal(state.favlists[0].data[1]);
    });

    it('should get a single point of data', () => {
      const favlist = getters.favlist(state);
      const data = getters.data(state, {favlist});
      const column = getters.column(state, {data});

      const cell = getters.cell(state, {column})(0, 1, 2);

      expect(cell).to.include({datum: '6'});
    });
  });

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

    describe('removeRow', () => {
      const {removeRow} = mutations;

      it('should make a single-column list with 1 row empty', () => {
        const state = {favlists: [{data: [[{datum: '1'}]]}]};

        removeRow(state, {favlistIndex: 0, row: 0});

        expect(state.favlists[0].data[0]).to.be.empty;
      });

      it('should make a multi-column list with 1 row empty', () => {
        const state = {favlists: [{data: [
          [{datum: 'column 1'}],
          [{datum: 'column 2'}],
          [{datum: 'column 3'}],
        ]}]};

        removeRow(state, {favlistIndex: 0, row: 0});

        state.favlists[0].data.forEach(item => expect(item).to.be.empty);
      });

      it('should remove a row from a single-column list', () => {
        const state = {favlists: [{data: [[
          {datum: 'row 1'},
          {datum: 'row 2'},
          {datum: 'row 3'},
        ]]}]};

        removeRow(state, {favlistIndex: 0, row: 1});

        expect(state.favlists[0].data[0]).to.deep.equal([
          {datum: 'row 1'},
          {datum: 'row 3'},
        ]);
      });

      it('should remove a row from a multi-column list', () => {
        const state = {favlists: [{data: [
          // row-column
          [{datum: '1-1'}, {datum: '2-1'}, {datum: '3-1'}],
          [{datum: '1-2'}, {datum: '2-2'}, {datum: '3-2'}],
          [{datum: '1-3'}, {datum: '2-3'}, {datum: '3-3'}],
        ]}]};

        removeRow(state, {favlistIndex: 0, row: 1});

        expect(state.favlists[0].data).to.deep.equal([
          [{datum: '1-1'}, {datum: '3-1'}],
          [{datum: '1-2'}, {datum: '3-2'}],
          [{datum: '1-3'}, {datum: '3-3'}],
        ]);
      });
    });
  });
});
