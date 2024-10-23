import Moment from 'moment'
import config from './config'
import express from 'express'

export interface App {
  config: typeof config
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
}
