import { IPosition, TEnvironemntState } from './context/environmentContext'

export const INITIAL_EXPLORATION_RATE = 0.0 // TODO: Change to appropriate value
export const EXPLORATION_RATE_DECAY = 0.0 // TODO: Change to appropriate value (exploration vs exploitation trade off)

export const LEARNING_RATE = 0.0 // TODO: Change to appropriate value
export const DISCOUNT_FACTOR = 0.0 // TODO: Change to appropriate value
export const NUM_EPISODES = 1 // TODO: Change to appropriate value

// --- Don't change anything below this line ---
export const DECIMALS = 2

export const BANANAS_SCORE = 100
export const BANANA_SCORE = 10
export const BANANA_PEEL_SCORE = -50

export const BANANAS_POSITION: IPosition = {
  rowIndex: 0,
  columnIndex: 3,
}
export const BANANA1_POSITION: IPosition = {
  rowIndex: 3,
  columnIndex: 1,
}
export const BANANA2_POSITION: IPosition = {
  rowIndex: 2,
  columnIndex: 1,
}
export const BANANA3_POSITION: IPosition = {
  rowIndex: 1,
  columnIndex: 1,
}
export const BANANA_PEEL_POSITION: IPosition = {
  rowIndex: 3,
  columnIndex: 3,
}

const INIT_ENVIRONMENT_STATE: TEnvironemntState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]

INIT_ENVIRONMENT_STATE[BANANAS_POSITION.rowIndex][BANANAS_POSITION.columnIndex] =
  BANANAS_SCORE
INIT_ENVIRONMENT_STATE[BANANA1_POSITION.rowIndex][BANANA1_POSITION.columnIndex] =
  BANANA_SCORE
INIT_ENVIRONMENT_STATE[BANANA2_POSITION.rowIndex][BANANA2_POSITION.columnIndex] =
  BANANA_SCORE
INIT_ENVIRONMENT_STATE[BANANA3_POSITION.rowIndex][BANANA3_POSITION.columnIndex] =
  BANANA_SCORE
INIT_ENVIRONMENT_STATE[BANANA_PEEL_POSITION.rowIndex][BANANA_PEEL_POSITION.columnIndex] =
  BANANA_PEEL_SCORE

export { INIT_ENVIRONMENT_STATE }
