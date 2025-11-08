'use client';

import { useState } from 'react';

interface ExpandableSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  borderColor?: string;
}

export default function ExpandableSection({ 
  title, 
  icon, 
  children, 
  defaultExpanded = false,
  borderColor = 'border-accent'
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-white/60 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 border-l-4 ${borderColor} mb-6 transition-all duration-300 hover:shadow-xl hover:bg-white/70`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-white/30 transition-all duration-300 rounded-xl"
      >
        <div className="flex items-center">
          {icon && <span className="mr-3">{icon}</span>}
          <h3 className="text-lg md:text-xl font-semibold text-left">{title}</h3>
        </div>
        <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${
        isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 md:px-6 pb-4 md:pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}