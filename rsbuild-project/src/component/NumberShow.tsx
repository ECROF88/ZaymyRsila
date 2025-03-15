import type { ReactNode } from 'react'

interface NumberShowData {
  title: string
  value: number | string
  prefix?: ReactNode
  className?: string
}

export default function NumberShow({
  title,
  value,
  prefix,
  className = '',
}: NumberShowData) {
  return (
    <div className={`${className} flex flex-col px-2 gap-2`}>
      <div className="text-base text-gray-700 mb-2">{title}</div>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-lg text-gray-800">{prefix}</span>}
        <span className="text-lg font-medium ">{value}</span>
      </div>
    </div>
  )
}
