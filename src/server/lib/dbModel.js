import { DataTypes } from 'sequelize'

/**
 * @param {import('../../data/types.js').App} App
 */
export function dbModel(App) {
  const User = App.db.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    session_startTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    session_phase: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    session_score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  })

  const Room = App.db.define('Room', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(20),
      unique: true,
    },
  })

  const Solution = App.db.define('Solution', {
    cid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  })

  App.db.define('Session', {
    sid: {
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    data: {
      type: DataTypes.TEXT,
    },
    expires: {
      type: DataTypes.DATE,
    },
  })

  Room.hasMany(User)
  User.belongsTo(Room)

  User.hasMany(Solution, {
    foreignKey: {
      // @ts-ignore Sometimes, types lie. This is the case here
      // The solution table is using a composite primary key consisting of the cid, and THIS column, so mark the colums as a primary key as well
      // The documentation in v7 is clearer, but it should also work in v6.
      // The database is relying on this! Don't remove.
      primaryKey: true,
    },
    onDelete: 'cascade',
  })
  Solution.belongsTo(User)

  App.db.define('KVPair', {
    key: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    value: {
      type: DataTypes.TEXT,
    },
  })
}
