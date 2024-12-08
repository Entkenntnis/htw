import Moment from 'moment'
import express, { Request } from 'express'
import { appConfig } from './config.js'
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize,
} from 'sequelize'
import { i18n } from 'i18next'

export interface App {
  config: typeof appConfig
  entry: {
    add(fn: () => void | Promise<void>): void
    start(): Promise<void>
  }
  logger: {
    info(msg: string): void
    warn(msg: string): void
  }
  moment: typeof Moment
  express: ReturnType<typeof express>
  db: Sequelize & {
    models: {
      User: ModelStatic<UserModel>
      Solution: ModelStatic<SolutionModel>
      Session: ModelStatic<SessionModel>
      Room: ModelStatic<RoomModel>
      KVPair: ModelStatic<KVPairModel>
      WormsBotDraft: ModelStatic<WormsBotDraftModel>
    }
  }
  i18n: { get(lng: 'de' | 'en'): i18n }
  csrf: {
    create(req: Request): string
    verify(req: Request, token: string): boolean
  }
  periodic: {
    add(interval: number, fn: () => void): void
  }
  challenges: {
    data: HtwChallenge[]
    dataMap: { [key: number]: HtwChallenge }
    distance: { [key: number]: number }
  }
  storage: {
    setItem(key: string, value: string): Promise<void>
    getItem(key: string): Promise<string | null>
    removeItem(key: string): Promise<void>
  }
  challengeStats: {
    getData(cid: number): Promise<ChallengeStatsData> | ChallengeStatsData
    refreshData(cid: number): Promise<void>
    nuke: () => void
  }
  version: string
}

export interface HtwChallenge {
  id: number
  pos: { x: number; y: number }
  title: { de: string; en: string }
  deps: number[]
  date?: string
  noScore?: boolean
  author?: string
  showAfterSolve?: boolean
  showAboveScore?: number
  html?: { de: string; en: string }
  render?: (context: {
    App: App
    req: Request
  }) =>
    | Promise<{ de: string; en: string }>
    | { de: string; en: string }
    | string
    | Promise<string>
  solution?: string | string[]
  check?: (
    raw: string,
    context: {
      App: App
      req: Request
    }
  ) =>
    | boolean
    | { rawAnswer?: true; answer: string; correct: boolean }
    | Promise<boolean>
    | Promise<{ rawAnswer?: boolean; answer: string; correct: boolean }>
  hidesubmit?: boolean
  afterSolveText?: { de: string; en: string }
}

export interface ChallengeStatsData {
  solvedBy: number
  lastSolved: string | Date | null
  lastSolvedUserName: string | null
}

// Dates are a bit messy, sometimes, they are strings, sometimes they are dates
// depending on the backend and/or wether the query is raw
// assume it's not parsed

export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare password: string
  declare score: CreationOptional<number>
  declare session_startTime: string | Date | null
  declare session_phase: string | null
  declare session_score: number | null
  declare createdAt: CreationOptional<string | Date>
  declare updatedAt: CreationOptional<string | Date>
  declare RoomId: number | null
}

export class SolutionModel extends Model<
  InferAttributes<SolutionModel>,
  InferCreationAttributes<SolutionModel>
> {
  declare cid: number
  declare UserId: number
  declare createdAt: CreationOptional<string | Date>
  declare updatedAt: CreationOptional<string | Date>
}

export class SessionModel extends Model<
  InferAttributes<SessionModel>,
  InferCreationAttributes<SessionModel>
> {
  declare sid: string
  declare data: string
  declare expires: string | Date
  declare createdAt: CreationOptional<string | Date>
  declare updatedAt: CreationOptional<string | Date>
}

export class RoomModel extends Model<
  InferAttributes<RoomModel>,
  InferCreationAttributes<RoomModel>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare createdAt: CreationOptional<string | Date>
  declare updatedAt: CreationOptional<string | Date>
}

export class KVPairModel extends Model<
  InferAttributes<KVPairModel>,
  InferCreationAttributes<KVPairModel>
> {
  declare key: string
  declare value: string
  declare createdAt: CreationOptional<string | Date>
  declare updatedAt: CreationOptional<string | Date>
}

export class WormsBotDraftModel extends Model<
  InferAttributes<WormsBotDraftModel>,
  InferCreationAttributes<WormsBotDraftModel>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare code: string
  declare UserId: number
  declare createdAt: CreationOptional<string | Date>
  declare updatedAt: CreationOptional<string | Date>
}

declare global {
  namespace Express {
    interface Request {
      user?: UserModel
      lng: 'de' | 'en'
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: number
    __start_ts?: number
    __path?: string
    csrfSecret?: string
    joinRoom?: string
    registerValues?: object
    joinValues?: object
    roomValues?: object
    rooms?: string[]
    loginFail: boolean
    rates: { [key: string]: { count: number; lockedUntil: number } }
    chal117?: DungeonData
    chal303_ts?: number
    chal303_result?: string
    chal338_ts?: number
    chal338_result?: string
    maze?: { x: number; y: number }
  }
}

export interface DungeonData {
  health: number
  state:
    | null
    | 'choice'
    | 'safe'
    | 'chamber'
    | 'done'
    | 'combat'
    | 'dices'
    | 'death'
    | 'instadeath'
  hall: number
  isReturn: boolean
  choices: string[]
  values: number[]
}

export type RenderPageOptions =
  | string
  | {
      page: string
      user?: UserModel
      backHref?: string
      props?: object
      heading?: string
      title?: string
      content?: string
      backButton?: boolean
      outsideOfContainer?: boolean
    }

export interface WormsReplay {
  xRed: number
  yRed: number
  dirRed: number

  xGreen: number
  yGreen: number
  dirGreen: number

  dirs: number[]
}

export type HintsData = {
  [key: number]: { entries: { question: string; answer: string }[] }
}
