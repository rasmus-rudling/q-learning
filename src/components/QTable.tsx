import { TQTable, useQLearning } from '../context/qLearningContext'
import { Box, QTableBox } from './Box'

export const QTable = () => {
  const { qTable } = useQLearning()

  return (
    <div className="flex flex-col gap-1 w-[49%] h-full">
      <div className="w-full flex justify-center gap-2">
        <h3 className="pl-[3%] text-3xl text-slate-900">Q Table</h3>
      </div>

      <div className="flex flex-col justify-between h-[90%]">
        {qTable.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-between h-[23%]">
            <Box className="bg-transparent w-[20px]">
              <h4 className="text-2xl text-slate-900 w-fit">{rowIndex}</h4>
            </Box>

            {row.map((actions, colIndex) => {
              return <QTableBox key={`${rowIndex}${colIndex}`} actions={actions} />
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
