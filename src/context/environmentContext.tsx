import { createContext, useContext, useEffect, useState } from 'react'
import { Action } from './qLearningContext'
import { INIT_ENVIRONMENT_STATE } from '../constants'

export interface IPosition {
  columnIndex: number
  rowIndex: number
}

export type TEnvironemntState = (number | null)[][]

interface IEnvironment {
  state: TEnvironemntState
  agentPosition: IPosition
  possibleNewPositions: IPossibleNewPosition[]
  moveAgent: (newPosition: IPosition) => number | null
  peekReward: (position: IPosition) => number | null
  resetEnvironment: () => void
  getActionNeeded: (currentPosition: IPosition, newPosition: IPosition) => Action
  getPositionAfterAction: (currentPosition: IPosition, action: Action) => IPosition
}

const EnvironmentContext = createContext<IEnvironment>({} as IEnvironment)

export const useEnvironment = () => {
  return useContext(EnvironmentContext)
}

interface Props {
  children: React.ReactNode
}

const AGENT_START_POSITION: IPosition = { columnIndex: 0, rowIndex: 3 }

interface IPossibleNewPosition {
  newPosition: IPosition
  requiredAction: Action
}

const EnvironmentProvider = ({ children }: Props) => {
  const [state, setState] = useState<TEnvironemntState>(
    JSON.parse(JSON.stringify(INIT_ENVIRONMENT_STATE)),
  )

  const [possibleNewPositions, setPossibleNewPositions] = useState<
    IPossibleNewPosition[]
  >([])

  const [agentPosition, setAgentPosition] = useState<IPosition>(AGENT_START_POSITION)

  const moveAgent = (newPosition: IPosition): number | null => {
    setAgentPosition(newPosition)

    return _grabReward(newPosition)
  }

  const peekReward = (position: IPosition): number | null => {
    return state[position.rowIndex][position.columnIndex]
  }

  const resetEnvironment = () => {
    setState(JSON.parse(JSON.stringify(INIT_ENVIRONMENT_STATE)))
    setAgentPosition(AGENT_START_POSITION)
  }

  const _grabReward = (position: IPosition): number | null => {
    const reward = peekReward(position)
    _removeReward(position)

    return reward
  }

  const _removeReward = (position: IPosition) => {
    const newStates = [...state]

    if (newStates[position.rowIndex][position.columnIndex] !== 0) {
      newStates[position.rowIndex][position.columnIndex] = null
    }

    setState(newStates)
  }

  const getActionNeeded = (
    currentPosition: IPosition,
    newPosition: IPosition,
  ): Action => {
    if (currentPosition.rowIndex - 1 === newPosition.rowIndex) return Action.UP
    if (currentPosition.columnIndex + 1 === newPosition.columnIndex) return Action.RIGHT
    if (currentPosition.rowIndex + 1 === newPosition.rowIndex) return Action.DOWN
    if (currentPosition.columnIndex - 1 === newPosition.columnIndex) return Action.LEFT

    throw new Error('[QLearningService] Invalid action needed')
  }

  const getPositionAfterAction = (
    currentPosition: IPosition,
    action: Action,
  ): IPosition => {
    switch (action) {
      case Action.UP:
        return { ...currentPosition, rowIndex: currentPosition.rowIndex - 1 }
      case Action.RIGHT:
        return { ...currentPosition, columnIndex: currentPosition.columnIndex + 1 }
      case Action.DOWN:
        return { ...currentPosition, rowIndex: currentPosition.rowIndex + 1 }
      case Action.LEFT:
        return { ...currentPosition, columnIndex: currentPosition.columnIndex - 1 }
    }
  }

  useEffect(() => {
    const possiblePositions = [
      { columnIndex: agentPosition.columnIndex, rowIndex: agentPosition.rowIndex - 1 },
      { columnIndex: agentPosition.columnIndex + 1, rowIndex: agentPosition.rowIndex },
      { columnIndex: agentPosition.columnIndex, rowIndex: agentPosition.rowIndex + 1 },
      { columnIndex: agentPosition.columnIndex - 1, rowIndex: agentPosition.rowIndex },
    ]

    const newPositions = possiblePositions.filter(
      (position) =>
        position.rowIndex >= 0 &&
        position.rowIndex < state.length &&
        position.columnIndex >= 0 &&
        position.columnIndex < state[0].length &&
        state[position.rowIndex][position.columnIndex] !== null,
    )

    const newPossibleNewPositions = newPositions.map((newPosition) => {
      const requiredAction = Object.keys(Action).find(
        (action) =>
          Action[action as keyof typeof Action] ===
          getActionNeeded(agentPosition, newPosition),
      ) as Action

      return { newPosition, requiredAction }
    })

    setPossibleNewPositions(newPossibleNewPositions)
  }, [agentPosition, state])

  return (
    <EnvironmentContext.Provider
      value={{
        state,
        agentPosition,
        moveAgent,
        peekReward,
        resetEnvironment,
        possibleNewPositions,
        getActionNeeded,
        getPositionAfterAction,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  )
}

export default EnvironmentProvider
