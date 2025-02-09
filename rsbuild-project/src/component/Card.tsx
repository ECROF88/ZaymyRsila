import React, { ReactNode } from 'react';

export interface CardProps {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  bordered?: boolean;
}

function Card({
  title,
  children,
  className = '',
  bodyStyle,
  style,
  bordered = true,
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm ${
        bordered ? 'border border-gray-200' : ''
      } ${className}`}
      style={style}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          {typeof title === 'string' ? (
            <h3 className="text-base text-gray-700 mb-2">{title}</h3>
          ) : (
            title
          )}
        </div>
      )}
      <div className="p-6" style={bodyStyle}>
        {children}
      </div>
    </div>
  );
}

export default Card;
