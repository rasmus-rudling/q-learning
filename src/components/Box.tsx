import React, { forwardRef } from 'react'
import { cn } from '../utils'
import angryMonkey from '../assets/angry_monkey.png'
import minion from '../assets/minion.png'
import bananas from '../assets/bananas.png'
import banana from '../assets/banana.png'
import bananaPeel from '../assets/bananaPeel.png'
import { QActions } from '../context/qLearningContext'
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from 'react-icons/io'
import {} from '../context/environmentContext'
import { BANANAS_SCORE, BANANA_SCORE, BANANA_PEEL_SCORE, DECIMALS } from '../constants'

const Box = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col justify-center h-full w-[23%] items-center bg-slate-600 rounded',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)

interface QTableBoxProps {
  actions: QActions
  className?: string
}

const QTableBox = ({ actions, className }: QTableBoxProps) => {
  const numberBox = 'p-1 bg-slate-200 rounded text-slate-900'
  const containerStyle = 'absolute text-slate-200 flex items-center justify-center gap-1'
  const negativeBox = 'bg-red-500 text-white'
  const positiveBox = 'bg-green-600 text-white'
  const decimals = 0

  return (
    <Box className={cn(className, 'relative')}>
      <div
        className={cn(
          'top-1 left-1/2 transform -translate-x-1/2 flex-col',
          containerStyle,
          {
            hidden: actions.UP === undefined,
          },
        )}
      >
        <IoIosArrowUp />
        <div
          className={cn(numberBox, {
            [negativeBox]: actions.UP && actions.UP < 0,
            [positiveBox]: actions.UP && actions.UP > 0,
          })}
        >
          {actions.UP?.toFixed(decimals)}
        </div>
      </div>

      <div
        className={cn(
          'bottom-1 left-1/2 transform -translate-x-1/2 flex-col',
          containerStyle,
          {
            hidden: actions.DOWN === undefined,
          },
        )}
      >
        <div
          className={cn(numberBox, {
            [negativeBox]: actions.DOWN && actions.DOWN < 0,
            [positiveBox]: actions.DOWN && actions.DOWN > 0,
          })}
        >
          {actions.DOWN?.toFixed(decimals)}
        </div>
        <IoIosArrowDown />
      </div>

      <div
        className={cn('left-1 top-1/2 transform -translate-y-1/2', containerStyle, {
          hidden: actions.LEFT === undefined,
        })}
      >
        <IoIosArrowBack />
        <div
          className={cn(numberBox, {
            [negativeBox]: actions.LEFT && actions.LEFT < 0,
            [positiveBox]: actions.LEFT && actions.LEFT > 0,
          })}
        >
          {actions.LEFT?.toFixed(decimals)}
        </div>
      </div>

      <div
        className={cn('right-1 top-1/2 transform -translate-y-1/2', containerStyle, {
          hidden: actions.RIGHT === undefined,
        })}
      >
        <div
          className={cn(numberBox, {
            [negativeBox]: actions.RIGHT && actions.RIGHT < 0,
            [positiveBox]: actions.RIGHT && actions.RIGHT > 0,
          })}
        >
          {actions.RIGHT?.toFixed(decimals)}
        </div>
        <IoIosArrowForward />
      </div>
    </Box>
  )
}

const ZeroBox = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} className={cn(className)} {...props}>
      <p className="text-green-100 text-3xl">0</p>
    </Box>
  ),
)

interface BoxProps {
  className?: string
  onClick?: () => void
}

const MinionBox = ({
  points = null,
  className,
  ...props
}: {
  points: number | null
} & BoxProps) => {
  let sign = ''

  if (points != null && points < 0) sign = '-'
  if (points != null && points > 0) sign = '+'

  return (
    <Box className={cn(className)} {...props}>
      <p
        className={cn('text-green-100 text-3xl', {
          hidden: points == null,
          'text-green-400': sign == '+',
          'text-red-400': sign == '-',
        })}
      >
        {sign}
        {points}
      </p>
      <img src={minion} alt="minion" className="h-[50%]" />
    </Box>
  )
}
const MonkeyBox = ({ className, ...props }: BoxProps) => {
  return (
    <Box className={cn('bg-red-800', className)} {...props}>
      <img src={angryMonkey} alt="monkey" className="h-[75%]" />
    </Box>
  )
}

const BananasBox = ({ className, ...props }: BoxProps) => (
  <Box className={cn('relative', className)} {...props}>
    <p className="text-green-400 text-3xl">+{BANANAS_SCORE}</p>
    <div className="h-[5%]" />
    <img src={bananas} alt="bananas" className="h-[32%] absolute top-[50%] left-[25%]" />
    <img src={bananas} alt="bananas" className="h-[31%] absolute top-[50%] right-[25%]" />
    <img src={bananas} alt="bananas" className="h-[30%]" />
  </Box>
)

const BananaBox = ({
  className,
  ...props
}: {
  className?: string
  onClick?: () => void
}) => (
  <Box className={cn('relative', className)} {...props}>
    <p className="text-green-400 text-3xl">+{BANANA_SCORE}</p>
    <div className="h-[5%]" />
    <img src={banana} alt="banana" className="w-[40%]" />
  </Box>
)

const BananaPeelBox = ({ className, ...props }: BoxProps) => (
  <Box className={cn('relative', className)} {...props}>
    <p className="text-red-400 text-3xl">{BANANA_PEEL_SCORE}</p>
    <div className="h-[5%]" />
    <img src={bananaPeel} alt="banana peel" className="w-[40%]" />
  </Box>
)

export {
  Box,
  ZeroBox,
  MinionBox,
  MonkeyBox,
  BananaBox,
  BananasBox,
  BananaPeelBox,
  QTableBox,
}
