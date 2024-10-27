import Moment from 'moment'
import express, { Request } from 'express'
import { appConfig } from './config.js'
import { Sequelize } from 'sequelize'
import { i18n } from 'i18next'
import { htwChallenges } from '../content/challenges.js'

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
  db: Sequelize
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
    distance: { [key: number]: number }
  }
  storage: {
    setItem(key: string, value: string): void
    getItem(key: string): Promise<string | null>
    removeItem(key: string): void
  }
  challengeStats: {
    getData(cid: number): Promise<ChallengeStatsData> | ChallengeStatsData
    refreshData(cid: number): Promise<void>
    nuke: () => void
  }
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
  html?: { de: string; en: string }
  render?: (context: {
    App: App
    req: Request
  }) =>
    | Promise<{ de: string; en: string }>
    | { de: string; en: string }
    | string
    | Promise<string>
  solution?: string
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
}

export interface ChallengeStatsData {
  solvedBy: number
  lastSolved: string | Date | null
  lastSolvedUserName: string | null
}

// Dates are a bit messy, sometimes, they are strings, sometimes they are dates
// depending on the backend and/or wether the query is raw
// assume it's not parsed
export interface IUser {
  id: number
  name: string
  password: string
  score: number
  session_startTime: string | Date | null
  session_phase: string | null
  session_score: number | null
  createdAt: string | Date
  updatedAt: string | Date
  RoomId: number | null
}

export interface ISolution {
  cid: number
  UserId: number
  createdAt: string | Date
  updatedAt: string | Date
}

export interface ISession {
  sid: string
  data: string
  expires: string | Date
  createdAt: string | Date
  updatedAt: string | Date
}

export interface IRoom {
  id: number
  name: string
  createdAt: string | Date
  updatedAt: string | Date
}

export interface IKVPair {
  key: string
  value: string
  createdAt: string | Date
  updatedAt: string | Date
}
