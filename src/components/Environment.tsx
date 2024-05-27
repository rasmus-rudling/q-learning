import { BANANA_PEEL_SCORE, BANANA_SCORE, BANANAS_SCORE } from '../constants'
import { useEnvironment } from '../context/environmentContext'
import { useQLearning } from '../context/qLearningContext'
import { cn } from '../utils'
import {
  Box,
  MinionBox,
  BananasBox,
  BananaBox,
  BananaPeelBox,
  ZeroBox,
  MonkeyBox,
} from './Box'

export const Environment = () => {
  const { state, agentPosition, moveAgent, possibleNewPositions, getActionNeeded } =
    useEnvironment()
  const { updateQValue } = useQLearning()

  return (
    <div className="flex flex-col gap-1 w-[49%] h-full">
      <div className="w-full flex justify-center gap-2">
        <h3 className="pl-[3%] text-3xl text-slate-900">Environment</h3>
      </div>

      <div className="flex flex-col justify-between h-[90%]">
        {state.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-between h-[23%]">
            <Box className="bg-transparent w-[20px]">
              <h4 className="text-2xl text-slate-900 w-fit">{rowIndex}</h4>
            </Box>
            {row.map((points, columnIndex) => {
              const key = `${rowIndex}${columnIndex}`

              const canWalkToPosition = possibleNewPositions.some(
                (possibleNewPositions) =>
                  possibleNewPositions.newPosition.columnIndex === columnIndex &&
                  possibleNewPositions.newPosition.rowIndex === rowIndex,
              )

              const className = cn({
                'border-yellow-500 border-[8px] cursor-pointer': canWalkToPosition,
              })

              let onClick = () => {}

              if (canWalkToPosition) {
                onClick = () => {
                  const newPosition = { rowIndex, columnIndex }
                  const actionTaken = getActionNeeded(agentPosition, newPosition)

                  updateQValue(newPosition, actionTaken)
                  moveAgent(newPosition)
                }
              }

              let box = <ZeroBox key={key} className={className} onClick={onClick} />

              if (points === BANANA_PEEL_SCORE)
                box = <BananaPeelBox key={key} className={className} onClick={onClick} />
              if (points === BANANA_SCORE)
                box = <BananaBox key={key} className={className} onClick={onClick} />
              if (points === BANANAS_SCORE)
                box = <BananasBox key={key} className={className} onClick={onClick} />
              if (
                agentPosition.columnIndex === columnIndex &&
                agentPosition.rowIndex === rowIndex
              ) {
                box = <MinionBox points={points} key={key} className={className} />
              }

              if (
                points === null &&
                !(
                  agentPosition.columnIndex === columnIndex &&
                  agentPosition.rowIndex === rowIndex
                )
              )
                box = <MonkeyBox />

              return box
            })}
          </div>
        ))}

        <div className="flex justify-between h-[20px]">
          <Box className="bg-transparent w-[20px]">
            <h4 className="text-2xl text-slate-900 w-fit text-transparent">{2}</h4>
          </Box>

          <Box className="bg-transparent w-[23%]">
            <h4 className="text-2xl text-slate-900 w-fit">0</h4>
          </Box>
          <Box className="bg-transparent w-[23%]">
            <h4 className="text-2xl text-slate-900 w-fit">1</h4>
          </Box>
          <Box className="bg-transparent w-[23%]">
            <h4 className="text-2xl text-slate-900 w-fit">2</h4>
          </Box>
          <Box className="bg-transparent w-[23%]">
            <h4 className="text-2xl text-slate-900 w-fit">3</h4>
          </Box>
        </div>
      </div>
    </div>
  )
}
