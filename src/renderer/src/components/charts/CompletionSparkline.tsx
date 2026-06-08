import React from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface CompletionSparklineProps {
  data: { value: number }[]
  color?: string
}

export function CompletionSparkline({ data, color = 'var(--done)' }: CompletionSparklineProps): React.ReactElement {
  return (
    <div style={{ width: 60, height: 20 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
