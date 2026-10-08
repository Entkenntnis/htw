import { parentPort, workerData } from 'node:worker_threads'
import { runWorms } from './worms-runner.js'

const progress = new Int32Array(workerData.progress)

try {
  const replay = await runWorms(
    workerData.redCode,
    workerData.greenCode,
    (steps) => {
      Atomics.store(progress, 0, steps)
    }
  )
  parentPort?.postMessage({ ok: true, replay })
} catch (e) {
  parentPort?.postMessage({ ok: false, error: String(e) })
}
