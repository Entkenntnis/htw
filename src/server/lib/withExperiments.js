/** @type {import("../../data/types.js").ExperimentDefinition[]} */
const defs = [
  {
    id: 1,
    description:
      'Macht eine Einleitung mit Kiwi im Vergleich zur nackten Aufgabe einen Unterschied?',
    challenge: 24, // Nicht blinzeln
    startTs: new Date('2025-10-30').getTime(),
    endTs: new Date('2026-12-15').getTime(),
  },
]

/** @type {Map<number, import("../../data/types.js").ExperimentDefinition>} */
const defsIndex = new Map()

defs.forEach((def) => {
  defsIndex.set(def.id, def)
})

/**
 * @param {import("../../data/types.js").App} App
 */
export function withExperiments(App) {}
