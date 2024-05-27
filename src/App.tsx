import { Environment } from './components/Environment'
import { QTable } from './components/QTable'
import { DECIMALS } from './constants'
import { useEnvironment } from './context/environmentContext'
import { useQLearning } from './context/qLearningContext'
import { cn } from './utils'

function App() {
  const {
    resetQTable,
    totNumEpisodes,
    setTotNumEpisodes,
    currentEpisode,
    triggerNextEpisode,
    explorationRate,
    learningRate,
    setLearningRate,
    discountFactor,
    setDiscountFactor,
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
  } = useQLearning()

  return (
    <div className="w-screen h-screen p-6 justify-between flex flex-col bg-slate-50 ">
      <div className="flex gap-2">
        <h3 className="text-xl text-slate-900">Actions:</h3>

        <button
          className="px-2 bg-blue-500 text-white rounded"
          onClick={() => {
            resetQTable()
          }}
        >
          Reset Q Table
        </button>

        <button
          className="px-2 bg-blue-500 text-white rounded"
          onClick={() => {
            triggerNextEpisode()
          }}
        >
          Next episode / reset environment
        </button>

        <button
          className={cn('px-2 bg-blue-500 text-white rounded', {
            'bg-gray-500': isPlayingOneEpisode,
            'bg-green-500': isPlayingAlgorithm,
          })}
          disabled={isPlayingOneEpisode}
          onClick={() => setIsPlayingAlgorithm(!isPlayingAlgorithm)}
        >
          {isPlayingAlgorithm ? 'Pause algorithm' : 'Play algorithm'}
        </button>

        <button
          className={cn('px-2 bg-blue-500 text-white rounded', {
            'bg-gray-500': isPlayingAlgorithm,
            'bg-green-500': isPlayingOneEpisode,
          })}
          disabled={isPlayingAlgorithm}
          onClick={() => setIsPlayingOneEpisode(true)}
        >
          Play one episode
        </button>

        <button
          className={cn('px-2 bg-blue-500 text-white rounded', {
            'bg-gray-500': isPlayingAlgorithm || isPlayingOneEpisode,
          })}
          disabled={isPlayingAlgorithm || isPlayingOneEpisode}
          onClick={makeAMove}
        >
          Make one move
        </button>

        <button
          className={cn('px-2 bg-blue-500 text-white rounded', {
            'bg-gray-500': isPlayingAlgorithm || isPlayingOneEpisode,
            'bg-blue-800': isTestingAgent,
          })}
          disabled={isPlayingAlgorithm || isPlayingOneEpisode}
          onClick={() => {
            isTestingAgent ? stopAgentTest() : startAgentTest()
          }}
        >
          {isTestingAgent ? 'Abort test' : 'Test agent'}
        </button>
      </div>

      <div className="flex gap-1 items-center">
        <h3 className="text-xl text-slate-900">Configuration & info:</h3>

        <span>Max episodes (</span>
        <input
          step="10"
          className="border rounded w-[55px] text-center"
          type="number"
          min="1"
          max="500"
          onChange={(e) => setTotNumEpisodes(Number(e.target.value))}
          value={totNumEpisodes}
        />
        <span>), </span>

        <span>current episode ({currentEpisode}), </span>

        <span>learning rate (</span>
        <input
          className="border rounded w-[55px] text-center"
          type="number"
          step=".05"
          max="1"
          min="0"
          onChange={(e) => setLearningRate(parseFloat(e.target.value))}
          value={learningRate.toFixed(DECIMALS)}
        />
        <span>), </span>

        <span>discount factor (</span>
        <input
          className="border rounded w-[55px] text-center"
          type="number"
          step=".05"
          max="1"
          min="0"
          onChange={(e) => setDiscountFactor(parseFloat(e.target.value))}
          value={discountFactor.toFixed(DECIMALS)}
        />
        <span>), </span>

        <span>exploration rate (</span>
        <input
          className="border rounded w-[55px] text-center"
          type="number"
          step=".05"
          max="1"
          min="0"
          onChange={(e) => setExplorationRate(parseFloat(e.target.value))}
          value={explorationRate.toFixed(DECIMALS)}
        />
        <span>), </span>

        <span>move pause (</span>
        <input
          className="border rounded w-[55px] text-center"
          type="number"
          step="50"
          max="1000"
          min="1"
          onChange={(e) => setPauseBetweenMoves(parseInt(e.target.value))}
          value={pauseBetweenMoves}
        />
        <span>) ms</span>
      </div>

      <div className="flex items-center justify-between w-full h-[90%]">
        <QTable />
        <Environment />
      </div>
    </div>
  )
}

export default App
