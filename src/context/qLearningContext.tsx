import { createContext, useContext, useEffect, useState } from 'react'
import { IPosition, useEnvironment } from './environmentContext'
import {
  BANANA1_POSITION,
  DISCOUNT_FACTOR,
  EXPLORATION_RATE_DECAY,
  INITIAL_EXPLORATION_RATE,
  INIT_ENVIRONMENT_STATE,
  LEARNING_RATE,
  NUM_EPISODES,
} from '../constants'

export enum Action {
  UP = 'UP',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
}

export type QActions = Partial<{
  [action in Action]: number
}>

export type FrozenActions = Partial<{
  [action in Action]: boolean
}>

export type FrozenActionsTable = FrozenActions[][]

export type TQTable = QActions[][]

interface IQTable {
  qTable: TQTable
  currentEpisode: number
  totNumEpisodes: number
  learningRate: number
  discountFactor: number
  explorationRate: number
  isPlayingAlgorithm: boolean
  isPlayingOneEpisode: boolean
  pauseBetweenMoves: number
  isTestingAgent: boolean
  startAgentTest: () => void
  stopAgentTest: () => void
  setPauseBetweenMoves: (pauseBetweenMoves: number) => void
  setIsPlayingOneEpisode: (isPlayingOneEpisode: boolean) => void
  setIsPlayingAlgorithm: (isPlayingAlgorithm: boolean) => void
  setExplorationRate: (explorationRate: number) => void
  setLearningRate: (learningRate: number) => void
  setDiscountFactor: (discountFactor: number) => void
  updateQValue: (postition: IPosition, action: Action) => void
  resetQTable: () => void
  setTotNumEpisodes: (totNumEpisodes: number) => void
  triggerNextEpisode: () => void
  makeAMove: () => void
}

const QLearningContext = createContext<IQTable>({} as IQTable)

export const useQLearning = () => {
  return useContext(QLearningContext)
}

interface Props {
  children: React.ReactNode
}

const INIT_Q_TABLE: TQTable = INIT_ENVIRONMENT_STATE.map((row) =>
  row.map(() => ({
    [Action.UP]: 0,
    [Action.RIGHT]: 0,
    [Action.DOWN]: 0,
    [Action.LEFT]: 0,
  })),
)

delete INIT_Q_TABLE[0][0][Action.UP]
delete INIT_Q_TABLE[0][0][Action.LEFT]
delete INIT_Q_TABLE[0][1][Action.UP]
delete INIT_Q_TABLE[0][2][Action.UP]
delete INIT_Q_TABLE[0][3][Action.UP]
delete INIT_Q_TABLE[0][3][Action.RIGHT]

delete INIT_Q_TABLE[1][0][Action.LEFT]
delete INIT_Q_TABLE[1][3][Action.RIGHT]

delete INIT_Q_TABLE[2][0][Action.LEFT]
delete INIT_Q_TABLE[2][3][Action.RIGHT]

delete INIT_Q_TABLE[3][0][Action.LEFT]
delete INIT_Q_TABLE[3][0][Action.DOWN]
delete INIT_Q_TABLE[3][1][Action.DOWN]
delete INIT_Q_TABLE[3][2][Action.DOWN]
delete INIT_Q_TABLE[3][3][Action.DOWN]
delete INIT_Q_TABLE[3][3][Action.RIGHT]

const QLearningProvider = ({ children }: Props) => {
  const [learningRate, setLearningRate] = useState<number>(LEARNING_RATE)
  const [discountFactor, setDiscountFactor] = useState<number>(DISCOUNT_FACTOR)
  const [explorationRate, setExplorationRate] = useState<number>(INITIAL_EXPLORATION_RATE)
  const [totNumEpisodes, setTotNumEpisodes] = useState<number>(NUM_EPISODES)
  const [episodeNumber, setEpisodeNumber] = useState<number>(0)
  const [isPlayingAlgorithm, setIsPlayingAlgorithm] = useState<boolean>(false)
  const [isPlayingOneEpisode, setIsPlayingOneEpisode] = useState<boolean>(false)
  const [isTestingAgent, setIsTestingAgent] = useState<boolean>(false)
  const [pauseBetweenMoves, setPauseBetweenMoves] = useState<number>(1)
  const [numMovesInCurrentEpisode, setNumMovesInCurrentEpisode] = useState<number>(0)

  const { state, agentPosition, resetEnvironment, getPositionAfterAction, moveAgent } =
    useEnvironment()

  const [qTable, setQTable] = useState<TQTable>(JSON.parse(JSON.stringify(INIT_Q_TABLE)))

  const updateQValue = (newPosition: IPosition, action: Action) => {
    const newQTable = [...qTable]
    const newQValue = getNewQValue(newPosition, action)

    newQTable[agentPosition.rowIndex][agentPosition.columnIndex][action] = newQValue
    setQTable(newQTable)
  }

  const resetQTable = () => {
    setQTable(JSON.parse(JSON.stringify(INIT_Q_TABLE)))
    setEpisodeNumber(0)
    resetEnvironment()
  }

  const shouldStopAlgorithm = () => {
    return (
      episodeNumber >= totNumEpisodes || (!isPlayingAlgorithm && !isPlayingOneEpisode)
    )
  }

  const shouldResetEnvironment = () => {
    const bananasFound = state[0][3] == null
    const banana1Found = state[3][1] == null
    const banana2Found = state[2][1] == null
    const banana3Found = state[1][1] == null
    return bananasFound && banana1Found && banana2Found && banana3Found
  }

  const playOneEpisode = async () => {
    if (shouldStopAlgorithm() && !isPlayingOneEpisode && !isTestingAgent) {
      setIsPlayingOneEpisode(false)
      setIsPlayingAlgorithm(false)
      setIsTestingAgent(false)
      setEpisodeNumber((prev) => prev + 1)
      return
    }
    await new Promise((resolve) => setTimeout(resolve, pauseBetweenMoves))

    makeAMove()
  }

  const makeAMove = async () => {
    setNumMovesInCurrentEpisode((prev) => prev + 1)
    const actionToTake = getActionToTake()
    const newPosition = getPositionAfterAction(agentPosition, actionToTake)

    updateQValue(newPosition, actionToTake)
    moveAgent(newPosition)

    if (shouldResetEnvironment()) {
      setExplorationRate((prev) => Math.max(prev - EXPLORATION_RATE_DECAY, 0))
      setIsPlayingOneEpisode(false)

      if (isTestingAgent) {
        alert(
          `Agent has found all bananas in ${
            numMovesInCurrentEpisode + 1
          } moves with a total training of ${episodeNumber} episodes.`,
        )
        setExplorationRate(INITIAL_EXPLORATION_RATE)
      }

      setNumMovesInCurrentEpisode(0)
      setIsTestingAgent(false)
      triggerNextEpisode()
    }
  }

  const getNewQValue = (newPosition: IPosition, actionTaken: Action): number => {
    const oldQValue =
      qTable[agentPosition.rowIndex][agentPosition.columnIndex][actionTaken]

    if (oldQValue === undefined) {
      throw new Error('[QLearningService] Invalid action taken')
    }

    const maxFutureReward = _getBestActionForPosition(newPosition)
    const immediateReward = state[newPosition.rowIndex][newPosition.columnIndex]

    if (immediateReward == null) {
      throw new Error('[QLearningService] Invalid immediate reward')
    }

    const term1 = (1 - learningRate) * oldQValue
    const term2 = learningRate * immediateReward
    const term3 = learningRate * discountFactor * maxFutureReward.rewardForBestAction

    return term1 + term2 + term3
  }

  const triggerNextEpisode = () => {
    resetEnvironment()
    setEpisodeNumber((prev) => prev + 1)
  }

  const getActionToTake = (): Action => {
    if (Math.random() < explorationRate) return _getRandomAction()

    return _getBestActionForPosition(agentPosition).bestAction
  }

  const _getRandomAction = (): Action => {
    const possibleActions = getPossibleActions(agentPosition)
    const randomIndex = Math.floor(Math.random() * Object.keys(possibleActions).length)
    return Object.keys(possibleActions)[randomIndex] as Action
  }

  const _getBestActionForPosition = (
    position: IPosition,
  ): {
    bestAction: Action
    rewardForBestAction: number
  } => {
    const possibleActions = getPossibleActions(position)

    const rewardForBestAction = Math.max(...Object.values(possibleActions))

    let bestAction = Action.UP

    if (possibleActions[Action.RIGHT] === rewardForBestAction) {
      bestAction = Action.RIGHT
    } else if (possibleActions[Action.DOWN] === rewardForBestAction) {
      bestAction = Action.DOWN
    } else if (possibleActions[Action.LEFT] === rewardForBestAction) {
      bestAction = Action.LEFT
    }

    return {
      bestAction,
      rewardForBestAction,
    }
  }

  const getPossibleActions = (position: IPosition): QActions => {
    const possibleActions = qTable[position.rowIndex][position.columnIndex]

    const actionsToRemove: Action[] = []
    if (
      possibleActions.UP !== undefined &&
      state[position.rowIndex - 1][position.columnIndex] == null
    ) {
      actionsToRemove.push(Action.UP)
    }

    if (
      possibleActions.RIGHT !== undefined &&
      state[position.rowIndex][position.columnIndex + 1] == null
    ) {
      actionsToRemove.push(Action.RIGHT)
    }

    if (
      possibleActions.DOWN !== undefined &&
      state[position.rowIndex + 1][position.columnIndex] == null
    ) {
      actionsToRemove.push(Action.DOWN)
    }

    if (
      possibleActions.LEFT !== undefined &&
      state[position.rowIndex][position.columnIndex - 1] == null
    ) {
      actionsToRemove.push(Action.LEFT)
    }

    const allowedNewPositions = Object.keys(possibleActions).reduce((acc, action) => {
      if (!actionsToRemove.includes(action as Action)) {
        acc[action as Action] = possibleActions[action as Action]
      }
      return acc
    }, {} as QActions)

    return allowedNewPositions
  }

  const startAgentTest = () => {
    resetEnvironment()
    setExplorationRate(0)
    setIsTestingAgent(true)
  }

  const stopAgentTest = async () => {
    setIsTestingAgent(false)
    setExplorationRate(INITIAL_EXPLORATION_RATE)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    resetEnvironment()
  }

  useEffect(() => {
    if (isPlayingOneEpisode || isPlayingAlgorithm || isTestingAgent) {
      playOneEpisode()
    }
  }, [agentPosition, isPlayingOneEpisode, isPlayingAlgorithm, isTestingAgent])

  return (
    <QLearningContext.Provider
      value={{
        qTable,
        updateQValue,
        resetQTable,
        currentEpisode: episodeNumber,
        totNumEpisodes,
        setTotNumEpisodes,
        triggerNextEpisode,
        learningRate,
        setLearningRate,
        discountFactor,
        setDiscountFactor,
        explorationRate,
        setExplorationRate,
        isPlayingAlgorithm,
        setIsPlayingAlgorithm,
        isPlayingOneEpisode,
        setIsPlayingOneEpisode,
        makeAMove,
        pauseBetweenMoves,
        setPauseBetweenMoves,
        isTestingAgent,
        startAgentTest,
        stopAgentTest,
      }}
    >
      {children}
    </QLearningContext.Provider>
  )
}

export default QLearningProvider
