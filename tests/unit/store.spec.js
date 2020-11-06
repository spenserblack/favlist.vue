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
          columns: [{datum: 'odd', key: 'O'}, {datum: 'even', key: 'K'}],
          data: [
            [
              {datum: '1', key: 'x'},
              {datum: '3', key: 'y'},
              {datum: '5', key: 'z'},
            ],
            [
              {datum: '2', key: 'a'},
              {datum: '4', key: 'b'},
              {datum: '6', key: 'c'},
            ],
          ],
        },
        {
          title: 'types',
          columns: [{datum: 'name', key: '!'}],
          data: [
            [
              {datum: 'number', key: '1'},
              {datum: 'string', key: '2'},
              {datum: 'array', key: '3'},
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

      expect(headers).to.be.an('array').and.have.lengthOf(2);
      expect(headers[0]).to.deep.include({datum: 'odd'});
      expect(headers[1]).to.deep.include({datum: 'even'});
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

      expect(cell).to.be.an('object').and.to.include({datum: '6'});
    });

    it('should get the datum stored at the point of data', () => {
      const favlist = getters.favlist(state);
      const data = getters.data(state, {favlist});
      const column = getters.column(state, {data});
      const cell = getters.cell(state, {column});

      const datum = getters.datum(state, {cell})(0, 1, 2);

      expect(datum).to.be.a('string').and.to.equal('6');
    });

    it('should get the key of a point of data', () => {
      const favlist = getters.favlist(state);
      const data = getters.data(state, {favlist});
      const column = getters.column(state, {data});
      const cell = getters.cell(state, {column});

      const datum = getters.datumKey(state, {cell})(0, 1, 2);

      expect(datum).to.be.a('string').and.to.equal('c');
    });

    it('should get the "height" of a list', () => {
      const favlist = getters.favlist(state);
      const data = getters.data(state, {favlist});

      const height = getters.height(state, {data})(0);

      expect(height).to.be.a('number').and.to.equal(3);
    });

    it('should get the "width" of a list', () => {
      const favlist = getters.favlist(state);
      const data = getters.data(state, {favlist});

      const width = getters.width(state, {data})(0);

      expect(width).to.be.a('number').and.to.equal(2);
    });
  });

  describe('mutations', () => {
    describe('loadFromJson', () => {
      const {loadFromJson} = mutations;

      it('should fully replace the old favlists with new ones', () => {
        const oldState = {
          favlists: [{
            title: ':(',
            columns: [{datum: 'a'}],
            data: [
              [{datum: '1'}, {datum: '2'}, {datum: '3'}],
            ],
          }],
        };
        const newState = {
          favlists: [{
            title: ':)',
            columns: [{datum: 'b'}],
            data: [
              [{datum: '4'}, {datum: '5'}],
            ],
          }],
        };

        loadFromJson(oldState, newState.favlists);

        const {favlists} = oldState;

        expect(favlists).to.deep.equal(newState.favlists);
      });
    });
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

        expect(state.favlists).to.have.lengthOf(1)
          .and.to.deep.include(remaining)
          .and.to.not.deep.include(removed);
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
      const state = {favlists: [{columns: [{datum: 'a'}, {datum: 'b'}]}]};

      it('should update the column header', () => {
        updateHeader(state, {favlistIndex: 0, columnIndex: 1, header: 'c'});

        expect(state.favlists[0].columns).to.have.lengthOf(2);
        expect(state.favlists[0].columns[1]).to.deep.include({datum: 'c'});
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

    describe('addColumn', () => {
      const {addColumn} = mutations;

      it('should add a column header to an empty list', () => {
        const state = {favlists: [{columns: [], data: []}]};

        addColumn(state, 0);

        expect(state.favlists[0].columns).to.not.be.empty;
      });

      it('should add a column header to a list', () => {
        const state = {favlists: [{columns: [{datum: 'items'}], data: []}]};

        addColumn(state, 0);

        expect(state.favlists[0].columns).to.have.lengthOf(2);
        expect(state.favlists[0].columns[1]).to.deep.include({datum: ''});
      });

      it('should add a new "column" to an empty list', () => {
        const state = {favlists: [{columns: [], data: []}]};

        addColumn(state, 0);

        expect(state.favlists[0].data).to.deep.equal([[]]);
      });

      it('should add a new "column" to a favlist with no "rows"', () => {
        const state = {favlists: [{columns: [''], data: [[]]}]};

        addColumn(state, 0);

        expect(state.favlists[0].data).to.have.lengthOf(2)
          .and.to.deep.equal([[], []]);
      });

      it('should add a new "column" with as many "rows" as the others', () => {
        const state = {favlists: [{columns: ['left', 'right'], data: [
          [{datum: '1'}, {datum: '2'}, {datum: '3'}],
          [{datum: '4'}, {datum: '5'}, {datum: '6'}, {datum: '7'}],
        ]}]};

        addColumn(state, 0);

        expect(state.favlists[0].data).to.have.lengthOf(3);
        expect(state.favlists[0].data[2]).to.be.an('array')
          .and.to.have.lengthOf(4);
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

    describe('removeColumn', () => {
      const {removeColumn} = mutations;

      it('should remove a column from a list with no "rows"', () => {
        const state = {favlists: [{columns: [''], data: [[]]}]};

        removeColumn(state, {favlistIndex: 0, column: 0});

        const [favlist] = state.favlists;

        expect(favlist.columns).to.be.empty;
        expect(favlist.data).to.be.empty;
      });

      it('should remove a column from a list with columns but no rows', () => {
        const state = {favlists: [{columns: ['c1', 'c2'], data: [[], []]}]};

        removeColumn(state, {favlistIndex: 0, column: 1});

        const [favlist] = state.favlists;

        expect(favlist.columns).to.deep.equal(['c1']);
        expect(favlist.data).to.deep.equal([[]]);
      });

      it('should remove the only column from a list', () => {
        const state = {favlists: [{columns: ['numbers'], data: [[
          {datum: '1'},
          {datum: '2'},
          {datum: '3'},
        ]]}]};

        removeColumn(state, {favlistIndex: 0, column: 0});

        const [favlist] = state.favlists;

        expect(favlist.columns).to.be.empty;
        expect(favlist.data).to.be.empty;
      });

      it('should remove a column from a list with columns and rows', () => {
        const state = {favlists: [{columns: ['odd', 'even'], data: [
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
        ]}]};

        removeColumn(state, {favlistIndex: 0, column: 1});

        const [favlist] = state.favlists;

        expect(favlist.columns).to.deep.equal(['odd']);
        expect(favlist.data).to.have.lengthOf(1);
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
    describe('moveColumnLeft', () => {
      const {moveColumnLeft} = mutations;

      it('should do nothing when there is only 1 column', () => {
        const state = {favlists: [{columns: ['header 1'], data: [
          [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
        ]}]};

        moveColumnLeft(state, {favlistIndex: 0, column: 0});

        expect(state.favlists[0]).to.deep.equal({columns: ['header 1'], data: [
          [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
        ]});
      });

      it('should swap column 1 and column 2', () => {
        const state = {favlists: [{columns: ['header 1', 'header 2'], data: [
          [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
          [{datum: 'column 2 row 1'}, {datum: 'column 2 row 2'}],
        ]}]};

        moveColumnLeft(state, {favlistIndex: 0, column: 1});

        expect(state.favlists[0]).to.deep.equal({
          columns: ['header 2', 'header 1'],
          data: [
            [{datum: 'column 2 row 1'}, {datum: 'column 2 row 2'}],
            [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
          ],
        });
      });

      it('should swap column 3 and column 2', () => {
        const state = {favlists: [{
          columns: ['header 1', 'header 2', 'header 3'],
          data: [
            [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
            [{datum: 'column 2 row 1'}, {datum: 'column 2 row 2'}],
            [{datum: 'column 3 row 1'}, {datum: 'column 3 row 2'}],
          ],
        }]};

        moveColumnLeft(state, {favlistIndex: 0, column: 2});

        expect(state.favlists[0]).to.deep.equal({
          columns: ['header 1', 'header 3', 'header 2'],
          data: [
            [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
            [{datum: 'column 3 row 1'}, {datum: 'column 3 row 2'}],
            [{datum: 'column 2 row 1'}, {datum: 'column 2 row 2'}],
          ],
        });
      });

      it(
        'should wrap column 1 to column 3 and shift 3 and 2 to the left',
        () => {
          const state = {favlists: [{
            columns: ['header 1', 'header 2', 'header 3'],
            data: [
              [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
              [{datum: 'column 2 row 1'}, {datum: 'column 2 row 2'}],
              [{datum: 'column 3 row 1'}, {datum: 'column 3 row 2'}],
            ],
          }]};

          moveColumnLeft(state, {favlistIndex: 0, column: 0});

          expect(state.favlists[0]).to.deep.equal({
            columns: ['header 2', 'header 3', 'header 1'],
            data: [
              [{datum: 'column 2 row 1'}, {datum: 'column 2 row 2'}],
              [{datum: 'column 3 row 1'}, {datum: 'column 3 row 2'}],
              [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
            ],
          });
        },
      );
    });
    describe('moveColumnRight', () => {
      const {moveColumnRight} = mutations;

      it('should do nothing when there is only 1 column', () => {
        const state = {favlists: [{columns: ['header 1'], data: [
          [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
        ]}]};

        moveColumnRight(state, {favlistIndex: 0, column: 0});

        expect(state.favlists[0]).to.deep.equal({columns: ['header 1'], data: [
          [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
        ]});
      });

      it('should swap column 1 and column 2', () => {
        const state = {favlists: [{columns: ['header 1', 'header 2'], data: [
          [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
          [{datum: 'column 2 row 1'}, {datum: 'column 2 row 2'}],
        ]}]};

        moveColumnRight(state, {favlistIndex: 0, column: 0});

        expect(state.favlists[0]).to.deep.equal({
          columns: ['header 2', 'header 1'],
          data: [
            [{datum: 'column 2 row 1'}, {datum: 'column 2 row 2'}],
            [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
          ],
        });
      });

      it('should swap column 1 and column 2', () => {
        const state = {favlists: [{
          columns: ['header 1', 'header 2', 'header 3'],
          data: [
            [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
            [{datum: 'column 2 row 1'}, {datum: 'column 2 row 2'}],
            [{datum: 'column 3 row 1'}, {datum: 'column 3 row 2'}],
          ],
        }]};

        moveColumnRight(state, {favlistIndex: 0, column: 0});

        expect(state.favlists[0]).to.deep.equal({
          columns: ['header 2', 'header 1', 'header 3'],
          data: [
            [{datum: 'column 2 row 1'}, {datum: 'column 2 row 2'}],
            [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
            [{datum: 'column 3 row 1'}, {datum: 'column 3 row 2'}],
          ],
        });
      });

      it(
        'should wrap column 3 to column 1 and shift 1 and 2 to the right',
        () => {
          const state = {
            favlists: [{
              columns: ['header 1', 'header 2', 'header 3'],
              data: [
                [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
                [{datum: 'column 2 row 1'}, {datum: 'column 2 row 2'}],
                [{datum: 'column 3 row 1'}, {datum: 'column 3 row 2'}],
              ],
            }]};

          moveColumnRight(state, {favlistIndex: 0, column: 2});

          expect(state.favlists[0]).to.deep.equal({
            columns: ['header 3', 'header 1', 'header 2'],
            data: [
              [{datum: 'column 3 row 1'}, {datum: 'column 3 row 2'}],
              [{datum: 'column 1 row 1'}, {datum: 'column 1 row 2'}],
              [{datum: 'column 2 row 1'}, {datum: 'column 2 row 2'}],
            ],
          });
        },
      );
    });
  });
});
