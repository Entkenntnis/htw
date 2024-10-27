// @ts-ignore
import cgs from 'connect-gzip-static'
export const connectGzipStatic =
  /** @type { (folder: string, options?: {cacheControl?: boolean}) => import('express').RequestHandler } */ (
    cgs
  )
