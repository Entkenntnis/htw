// @ts-nocheck

'use strict'

import { DatabaseSync } from 'node:sqlite'

const OPEN_READONLY = 0x00000001
const OPEN_READWRITE = 0x00000002
const OPEN_CREATE = 0x00000004

class StatementMeta {
  constructor(lastID, changes) {
    this.lastID = lastID
    this.changes = changes
  }
}

Object.defineProperty(StatementMeta.prototype.constructor, 'name', {
  value: 'Statement',
})

function normalizeBigInt(value) {
  if (typeof value !== 'bigint') {
    return value
  }

  if (
    value <= BigInt(Number.MAX_SAFE_INTEGER) &&
    value >= BigInt(Number.MIN_SAFE_INTEGER)
  ) {
    return Number(value)
  }

  return value.toString()
}

function normalizeRow(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) {
    return row
  }

  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, normalizeBigInt(value)])
  )
}

function normalizeRows(rows) {
  return rows.map(normalizeRow)
}

function normalizeError(error) {
  if (!error || typeof error !== 'object') {
    return error
  }

  if (typeof error.code === 'string' && error.code.startsWith('SQLITE_')) {
    return error
  }

  const normalizedError = error
  const message = String(error.message || '')
  const upperMessage = message.toUpperCase()

  if (
    upperMessage.includes('DATABASE IS LOCKED') ||
    upperMessage.includes('SQLITE_BUSY')
  ) {
    normalizedError.code = 'SQLITE_BUSY'
    return normalizedError
  }

  if (upperMessage.includes('FOREIGN KEY CONSTRAINT FAILED')) {
    normalizedError.code = 'SQLITE_CONSTRAINT_FOREIGNKEY'
    return normalizedError
  }

  if (upperMessage.includes('UNIQUE CONSTRAINT FAILED')) {
    normalizedError.code = 'SQLITE_CONSTRAINT_UNIQUE'
    return normalizedError
  }

  if (
    upperMessage.includes('PRIMARY KEY') &&
    upperMessage.includes('CONSTRAINT')
  ) {
    normalizedError.code = 'SQLITE_CONSTRAINT_PRIMARYKEY'
    return normalizedError
  }

  if (upperMessage.includes('CONSTRAINT')) {
    normalizedError.code = 'SQLITE_CONSTRAINT'
    return normalizedError
  }

  return normalizedError
}

function parseRunArgs(sql, params, callback) {
  if (typeof params === 'function') {
    return { sql, params: void 0, callback: params }
  }

  return { sql, params, callback }
}

function statementArgs(params) {
  if (params == null) {
    return []
  }

  if (Array.isArray(params)) {
    return params
  }

  if (typeof params === 'object') {
    return [params]
  }

  return [params]
}

function databaseOptionsFromMode(mode) {
  const numericMode =
    typeof mode === 'number' ? mode : OPEN_READWRITE | OPEN_CREATE
  const readOnly =
    (numericMode & OPEN_READONLY) !== 0 && (numericMode & OPEN_READWRITE) === 0

  return {
    open: true,
    readOnly,
    enableForeignKeyConstraints: false,
    allowBareNamedParameters: true,
  }
}

function configureStatement(statement) {
  if (typeof statement.setReadBigInts === 'function') {
    statement.setReadBigInts(true)
  }

  return statement
}

class Database {
  constructor(filename, mode, callback) {
    if (typeof mode === 'function') {
      callback = mode
      mode = void 0
    }

    this.filename = filename
    this.uuid = void 0
    this._database = null
    this._closed = false

    try {
      this._database = new DatabaseSync(filename, databaseOptionsFromMode(mode))

      if (typeof callback === 'function') {
        process.nextTick(callback, null)
      }
    } catch (error) {
      const normalizedError = normalizeError(error)

      if (typeof callback === 'function') {
        process.nextTick(callback, normalizedError)
        return
      }

      throw normalizedError
    }
  }

  serialize(fn) {
    return fn()
  }

  run(sql, params, callback) {
    const parsed = parseRunArgs(sql, params, callback)

    try {
      const statement = configureStatement(this._database.prepare(parsed.sql))
      const result = statement.run(...statementArgs(parsed.params))
      const meta = new StatementMeta(
        normalizeBigInt(result.lastInsertRowid),
        normalizeBigInt(result.changes)
      )

      if (typeof parsed.callback === 'function') {
        parsed.callback.call(meta, null)
      }
    } catch (error) {
      if (typeof parsed.callback === 'function') {
        parsed.callback.call(
          new StatementMeta(void 0, 0),
          normalizeError(error)
        )
      } else {
        throw normalizeError(error)
      }
    }

    return this
  }

  all(sql, params, callback) {
    const parsed = parseRunArgs(sql, params, callback)

    try {
      const statement = configureStatement(this._database.prepare(parsed.sql))
      const rows = normalizeRows(statement.all(...statementArgs(parsed.params)))

      if (typeof parsed.callback === 'function') {
        parsed.callback.call(this, null, rows)
      }
    } catch (error) {
      if (typeof parsed.callback === 'function') {
        parsed.callback.call(this, normalizeError(error), [])
      } else {
        throw normalizeError(error)
      }
    }

    return this
  }

  close(callback) {
    try {
      if (!this._closed) {
        this._database.close()
        this._closed = true
      }

      if (typeof callback === 'function') {
        process.nextTick(callback, null)
      }
    } catch (error) {
      if (typeof callback === 'function') {
        process.nextTick(callback, normalizeError(error))
      } else {
        throw normalizeError(error)
      }
    }
  }
}

const sqlite3Compat = {
  OPEN_READONLY,
  OPEN_READWRITE,
  OPEN_CREATE,
  Database,
  verbose() {
    return this
  },
}

export default sqlite3Compat
