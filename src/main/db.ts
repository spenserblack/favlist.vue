import { join } from "path";
import { app } from "electron";
import { Sequelize, DataTypes, Model } from "sequelize";
import { validateJson, validateLegacyJson, pivotArray } from "./util";
import type { BelongsToMany, HasMany } from "sequelize";

export const dbPath = getDbPath();
console.log("Using database:", dbPath);

const db = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
});

export class Favlist extends Model {
  declare id: number;
  declare title: string;
  declare static Columns: HasMany<Favlist, Column>;
  declare static Rows: HasMany<Favlist, Row>;
  declare getColumns: () => Promise<Column[]>;
  declare getRows: () => Promise<Row[]>;
}

Favlist.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Favlist",
  },
);

export class Column extends Model {
  declare id: number;
  declare name: string;
  declare favlistId: number;
  declare static Rows: BelongsToMany<Column, Row>;
  declare static Cells: HasMany<Column, Cell>;

  declare getFavlist: () => Promise<Favlist>;
}

Column.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Column",
  },
);

export class Row extends Model {
  declare id: number;
  declare static Columns: BelongsToMany<Row, Column>;
  declare static Cells: HasMany<Row, Cell>;

  declare getFavlist: () => Promise<Favlist>;
  declare getCells: () => Promise<Cell[]>;

  public override async toJSON(): Promise<object> {
    const cells = await this.getCells();
    const data = cells.reduce(
      (obj, cell) => ({ ...obj, [cell.columnId]: cell.value }),
      { id: this.id },
    );
    return data;
  }
}
Row.init({}, { sequelize: db, modelName: "Row" });

export class Cell extends Model {
  declare id: number;
  declare value: string;
  declare rowId: number;
  declare columnId: number;

  declare getColumn: () => Promise<Column>;
}
Cell.init(
  {
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "---",
    },
    columnId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Column,
        key: "id",
      },
    },
    rowId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Row,
        key: "id",
      },
    },
  },
  {
    sequelize: db,
    modelName: "Cell",
  },
);

Favlist.Columns = Favlist.hasMany(Column, {
  foreignKey: "favlistId",
  onDelete: "CASCADE",
});
Column.belongsTo(Favlist, {
  foreignKey: "favlistId",
  onDelete: "CASCADE",
});

Favlist.Rows = Favlist.hasMany(Row, {
  foreignKey: "favlistId",
  onDelete: "CASCADE",
});
Row.belongsTo(Favlist, {
  foreignKey: "favlistId",
  onDelete: "CASCADE",
});

Cell.belongsTo(Column, {
  foreignKey: "columnId",
  onDelete: "CASCADE",
});
Column.Cells = Column.hasMany(Cell, {
  foreignKey: "columnId",
  onDelete: "CASCADE",
});

Cell.belongsTo(Row, {
  foreignKey: "rowId",
  onDelete: "CASCADE",
});
Row.Cells = Row.hasMany(Cell, {
  foreignKey: "rowId",
  onDelete: "CASCADE",
});

export type JsonExport = {
  favlists: FavlistJsonExport[];
};

export type FavlistJsonExport = {
  title: string;
  data: Record<string, string>[];
};

export async function asJson(): Promise<JsonExport> {
  const favlistData = await Favlist.findAll();
  // TODO Enforce unique names for columns so that this doesn't break
  const favlists = await Promise.all(
    favlistData.map(async (favlist) => {
      const columns = await favlist.getColumns();
      const rows = await favlist.getRows();
      const data = await Promise.all(
        rows.map(async (row) => {
          const rowData = await row.toJSON();
          return columns.reduce(
            (obj, column) => ({
              ...obj,
              [column.name]: rowData[column.id],
            }),
            {},
          );
        }),
      );
      return { title: favlist.title, data };
    }),
  );

  return { favlists };
}

export async function fromJson(json: unknown): Promise<void> {
  if (!validateJson(json)) {
    throw new Error("Invalid JSON");
  }
  const dbPromise = json.favlists.map(async ({ title, data }) => {
    const favlist = await Favlist.create({ title });
    const columnNames = Object.keys(data[0]);
    const columns = await Promise.all(
      columnNames.map(
        async (name) =>
          await Column.create({
            name,
            favlistId: favlist.id,
          }),
      ),
    );
    await Promise.all(
      data.map(async (rowData) => {
        const row = await Row.create({ favlistId: favlist.id });
        return await Promise.all(
          columns.map(async (column) => {
            const value = rowData[column.name];
            return await Cell.create({
              value,
              columnId: column.id,
              rowId: row.id,
            });
          }),
        );
      }),
    );
  });
  await Promise.all(dbPromise);
}

export type LegacyJsonExport = {
  favlists: LegacyFavlistJsonExport[];
};

export type LegacyFavlistJsonExport = {
  title: string;
  columns: string[];
  data: LegacyColumnJsonExport[];
};

export type LegacyColumnJsonExport = string[];

export async function asLegacyJson(): Promise<LegacyJsonExport> {
  const favlistData = await Favlist.findAll();
  // NOTE I sacrificed readability for cleverness for fun :)
  // If you're reading this, feel free to make a PR to make this more readable.
  const favlists = await Promise.all(
    favlistData.map(async (favlist) => ({
      title: favlist.title,
      columns: (await favlist.getColumns()).map(({ name }) => name),
      data: pivotArray(
        await Promise.all((await favlist.getRows()).map((row) => row.getCells())),
      ).map((cells) => cells.map(({ value }) => value)),
    })),
  );
  return { favlists };
}

export async function fromLegacyJson(json: unknown): Promise<void> {
  if (!validateLegacyJson(json)) {
    throw new Error("Invalid JSON");
  }
  const dbPromise = json.favlists.map(async ({ title, columns: columnData, data }) => {
    const favlist = await Favlist.create({ title });
    const columns = await Promise.all(
      columnData.map((name) => Column.create({ name, favlistId: favlist.id })),
    );
    const rows = pivotArray(data);
    await Promise.all(
      rows.map(async (rowData) => {
        const row = await Row.create({ favlistId: favlist.id });
        await Promise.all(
          rowData.map((value, index) =>
            Cell.create({ value, rowId: row.id, columnId: columns[index].id }),
          ),
        );
      }),
    );
  });
  await Promise.all(dbPromise);
}

function getDbPath(): string {
  switch (process.env.NODE_ENV) {
    case "test":
      return ":memory:";
    default:
      return join(app.getPath("userData"), "favlist.sqlite3");
  }
}

export default db;
