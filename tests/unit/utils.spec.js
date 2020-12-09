import { addKeys, hasKeys } from '@/utils';
import { expect } from 'chai';

describe('utils', () => {
  describe('hasKeys', () => {
    it('should return true if all keys are defined', () => {
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
            key: 'f1',
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
            key: 'f2',
          },
          {
            title: 'empty',
            columns: [],
            data: [],
            key: 'f3',
          },
        ],
      };

      expect(hasKeys(state.favlists)).to.be.true;
    });

    it('should return false if no keys are defined', () => {
      const state = {
        favlists: [
          {
            title: 'numbers',
            columns: ['odd', 'even'],
            data: [
              ['1', '2', '3'],
              ['a', 'b', 'c'],
            ],
          },
          {
            title: 'types',
            columns: ['name'],
            data: [['number', 'string', 'array']],
          },
          {
            title: 'empty',
            columns: [],
            data: [],
          },
        ],
      };

      expect(hasKeys(state.favlists)).to.be.false;
    });
  });

  describe('addKeys', () => {
    it('should create a favlist that has keys', () => {
      const favlists = [
        {
          title: 'numbers',
          columns: ['odd', 'even'],
          data: [
            ['1', '2', '3'],
            ['a', 'b', 'c'],
          ],
        },
        {
          title: 'types',
          columns: ['name'],
          data: [['number', 'string', 'array']],
        },
        {
          title: 'empty',
          columns: [],
          data: [],
        },
      ];

      const favlistsWithKeys = addKeys(favlists);

      expect(favlistsWithKeys).to.be.an('array').with.lengthOf(3);

      favlistsWithKeys.forEach((favlist) => {
        expect(favlist).to.have.property('key');
        favlist.columns.forEach((header) => {
          expect(header).to.have.property('key');
        });
        favlist.data.forEach((column) => column.forEach((cell) => {
          expect(cell).to.have.property('key');
        }));
      });
    });
  });
});
