import { parentPort, workerData } from 'node:worker_threads'
import { runWorms } from './worms-runner.js'

const progress = new Int32Array(workerData.progress)

try {
  const replay = await runWorms(
    workerData.redCode,
    workerData.greenCode,
    (steps) => {
      Atomics.store(progress, 0, steps)
    },
    {
      onStart: (start) => parentPort?.postMessage({ type: 'start', start }),
      onMove: (dir) => parentPort?.postMessage({ type: 'move', dir }),
    }
  )
  parentPort?.postMessage({ type: 'done', ok: true, replay })
} catch (e) {
  parentPort?.postMessage({ type: 'done', ok: false, error: String(e) })
}
