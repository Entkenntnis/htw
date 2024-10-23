import Moment from 'moment'

export interface App {
  config: any
  entry: {
    add(fn: () => void): void
    start(): Promise<void>
  }
  logger: {
    info(msg: string): void
    warn(msg: string): void
  }
  moment: typeof Moment
}
