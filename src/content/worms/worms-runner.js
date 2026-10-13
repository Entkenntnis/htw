import { getQuickJS } from 'quickjs-emscripten'

/**
 * Standalone server-side worms runner
 * @param {string} srcRed
 * @param {string} srcGreen
 * @param {(steps: number) => void} [onStep]
 * @param {{ onStart?: (start: import('../../data/types.js').WormsStart) => void, onMove?: (dir: number) => void }} [hooks]
 * @returns {Promise<import('../../data/types.js').WormsReplay>}
 */
export async function runWorms(
  srcRed,
  srcGreen,
  onStep = () => {},
  { onStart = () => {}, onMove = () => {} } = {}
) {
  const offsets = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ]

  /** @type {number[][]} */
  const board = []
  for (let x = 0; x < 74; x++) {
    const col = []
    for (let y = 0; y < 42; y++) {
      if (x == 0 || y == 0 || x == 73 || y == 41) {
        col.push(-1)
      } else {
        col.push(0)
      }
    }
    board.push(col)
  }

  let xRed = 10 + Math.floor(Math.random() * 8 - 4)
  let yRed = 20 + Math.floor(Math.random() * 8 - 4)
  let dirRed = Math.floor(Math.random() * 3)

  let xGreen = 61 + Math.floor(Math.random() * 8 - 4)
  let yGreen = 21 + Math.floor(Math.random() * 8 - 4)
  let dirGreen = (Math.floor(Math.random() * 3) + 2) % 4

  board[xRed][yRed] = 1
  board[xGreen][yGreen] = 1

  /** @type {import('../../data/types.js').WormsReplay} */
  const replay = {
    xRed,
    yRed,
    dirRed,
    xGreen,
    yGreen,
    dirGreen,
    dirs: [],
    winner: '',
    redElo: -1,
    greenElo: -1,
  }

  onStart({ xRed, yRed, dirRed, xGreen, yGreen, dirGreen })

  const QuickJS = await getQuickJS()

  const runtimeRed = QuickJS.newRuntime()
  runtimeRed.setMemoryLimit(1024 * 640)
  runtimeRed.setMaxStackSize(1024 * 320)
  let cyclesRed = { val: 0 }
  runtimeRed.setInterruptHandler(() => {
    return cyclesRed.val++ > 101
  })
  const ctxRed = runtimeRed.newContext()

  // ---------------------------------------
  const logHandleRed = ctxRed.newFunction('log', (...args) => {
    // no-op
  })
  const consoleHandleRed = ctxRed.newObject()
  ctxRed.setProp(consoleHandleRed, 'log', logHandleRed)
  ctxRed.setProp(ctxRed.global, 'console', consoleHandleRed)
  consoleHandleRed.dispose()
  logHandleRed.dispose()
  // -------------------------

  try {
    ctxRed.evalCode(srcRed)
  } catch (e) {
    console.log(e)
  }

  const runtimeGreen = QuickJS.newRuntime()
  runtimeGreen.setMemoryLimit(1024 * 640)
  runtimeGreen.setMaxStackSize(1024 * 320)

  let cyclesGreen = { val: 0 }
  runtimeGreen.setInterruptHandler(() => {
    return cyclesGreen.val++ > 101
  })
  const ctxGreen = runtimeGreen.newContext()

  // ---------------------------------------
  const logHandleGreen = ctxGreen.newFunction('log', (...args) => {
    // no-op
  })
  const consoleHandleGreen = ctxGreen.newObject()
  ctxGreen.setProp(consoleHandleGreen, 'log', logHandleGreen)
  ctxGreen.setProp(ctxGreen.global, 'console', consoleHandleGreen)
  consoleHandleGreen.dispose()
  logHandleGreen.dispose()
  // -------------------------

  try {
    ctxGreen.evalCode(srcGreen)
  } catch (e) {
    console.log(e)
  }

  let lastInterrupt = Date.now()
  let steps = 0

  // todo: provide console.log in context

  while (!replay.winner) {
    steps++
    onStep(steps)
    if (Date.now() - lastInterrupt > 50) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      lastInterrupt = Date.now()
    }

    const callScriptRed = `
      think(74, 42, ${JSON.stringify(board)}, ${xRed}, ${yRed}, ${dirRed}, ${xGreen}, ${yGreen});
    `
    let newDirRed = -1
    try {
      cyclesRed.val = 0
      const resultRed = ctxRed.unwrapResult(ctxRed.evalCode(callScriptRed))
      newDirRed = ctxRed.getNumber(resultRed)
      resultRed.dispose()
      // console.log('red cycles (10k)', cyclesRed.val)
    } catch {}
    if (
      newDirRed === 0 ||
      newDirRed === 1 ||
      newDirRed === 2 ||
      newDirRed === 3
    ) {
      dirRed = newDirRed
      replay.dirs.push(newDirRed)
      onMove(newDirRed)
    } else {
      replay.winner = 'green'
      replay.withCrash = true
      break
    }
    const nrx = xRed + offsets[dirRed][0]
    const nry = yRed + offsets[dirRed][1]
    if (board[nrx][nry] == 0) {
      xRed = nrx
      yRed = nry
      board[xRed][yRed] = 1
    } else {
      replay.winner = 'green'
      break
    }

    const callScriptGreen = `
      think(74, 42, ${JSON.stringify(board)}, ${xGreen}, ${yGreen}, ${dirGreen}, ${xRed}, ${yRed});
    `
    let newDirGreen = -1
    try {
      //console.time('green')
      cyclesGreen.val = 0
      const resultGreen = ctxGreen.unwrapResult(
        ctxGreen.evalCode(callScriptGreen)
      )
      newDirGreen = ctxGreen.getNumber(resultGreen)
      resultGreen.dispose()
      //console.log('cycles green', cyclesGreen.val)
      //console.timeEnd('green')
    } catch {}
    if (
      newDirGreen === 0 ||
      newDirGreen === 1 ||
      newDirGreen === 2 ||
      newDirGreen === 3
    ) {
      dirGreen = newDirGreen
      replay.dirs.push(newDirGreen)
      onMove(newDirGreen)
    } else {
      replay.winner = 'red'
      replay.withCrash = true
      break
    }
    const ngx = xGreen + offsets[dirGreen][0]
    const ngy = yGreen + offsets[dirGreen][1]
    if (board[ngx][ngy] == 0) {
      xGreen = ngx
      yGreen = ngy
      board[xGreen][yGreen] = 2
    } else {
      replay.winner = 'red'
      break
    }
  }

  try {
    ctxRed.dispose()
    ctxGreen.dispose()

    runtimeRed.dispose()
    runtimeGreen.dispose()
  } catch {}

  return replay
}
