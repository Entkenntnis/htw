import Moment from 'moment'
import express from 'express'
import { appConfig } from './config.js'

export interface App {
  config: typeof appConfig
  entry: {
    add(fn: () => void): void
    start(): Promise<void>
  }
  logger: {
    info(msg: string): void
    warn(msg: string): void
  }
  moment: typeof Moment
  express: ReturnType<typeof express>
  db: any
  challenges: any // todo
}
