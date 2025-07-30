import React from 'react';

/**
 * Utility functions to format AI responses for better visual presentation
 */

export interface FormattedMessageProps {
  text: string;
  className?: string;
}

/**
 * Format text with proper line breaks, lists, and structure
 */
export const formatMessageText = (text: string): string => {
  if (!text) return '';

  let formatted = text;

  // Normalize line breaks
  formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Add proper spacing after periods followed by capital letters (new sentences)
  formatted = formatted.replace(/\.([A-ZÁÊÇÕ])/g, '. $1');

  // Add line breaks before numbered lists
  formatted = formatted.replace(/(\d+\.\s)/g, '\n$1');

  // Add line breaks before bullet points
  formatted = formatted.replace(/([•\-\*]\s)/g, '\n$1');

  // Add line breaks before common medical section headers
  const headers = [
    'Diagnóstico', 'Tratamento', 'Dosagem', 'Posologia', 'Indicações',
    'Contraindicações', 'Efeitos', 'Observações', 'Importante', 'Atenção',
    'Cuidados', 'Monitoramento', 'Sinais', 'Sintomas', 'Protocolo'
  ];
  
  headers.forEach(header => {
    const regex = new RegExp(`(${header}:?)`, 'gi');
    formatted = formatted.replace(regex, '\n**$1**');
  });

  // Clean up multiple consecutive line breaks
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace
  formatted = formatted.trim();

  return formatted;
};

/**
 * Parse markdown-like formatting in text
 */
export const parseMarkdown = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Find all **bold** patterns
  const boldRegex = /\*\*(.*?)\*\*/g;
  let match;
  
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the bold part
    if (match.index > currentIndex) {
      parts.push(text.slice(currentIndex, match.index));
    }
    
    // Add the bold part
    parts.push(
      <strong key={`bold-${match.index}`} className="font-bold">
        {match[1]}
      </strong>
    );
    
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }
  
  return parts.length > 0 ? parts : [text];
};

/**
 * Component to render formatted message text
 */
export const FormattedMessage: React.FC<FormattedMessageProps> = ({ text, className = '' }) => {
  const formattedText = formatMessageText(text);
  
  // Split text into paragraphs and format each part
  const parts = formattedText.split('\n').filter(part => part.trim());
  
  return (
    <div className={`space-y-2 ${className}`}>
      {parts.map((part, index) => {
        const trimmedPart = part.trim();
        
        // Skip empty parts
        if (!trimmedPart) return null;
        
        // Handle bold headers (marked with **)
        if (trimmedPart.startsWith('**') && trimmedPart.endsWith('**')) {
          const headerText = trimmedPart.slice(2, -2);
          return (
            <div key={index} className="font-semibold text-primary mt-3 mb-1">
              {headerText}
            </div>
          );
        }
        
        // Handle numbered lists
        if (/^\d+\.\s/.test(trimmedPart)) {
          return (
            <div key={index} className="ml-2 mb-1">
              <span className="font-medium text-primary">
                {trimmedPart.match(/^\d+\./)?.[0]}
              </span>
              <span className="ml-2">
                {trimmedPart.replace(/^\d+\.\s/, '')}
              </span>
            </div>
          );
        }
        
        // Handle bullet points
        if (/^[•\-\*]\s/.test(trimmedPart)) {
          return (
            <div key={index} className="ml-2 mb-1 flex items-start">
              <span className="text-primary mr-2 mt-1">•</span>
              <span>{trimmedPart.replace(/^[•\-\*]\s/, '')}</span>
            </div>
          );
        }
        
        // Handle regular paragraphs
        return (
          <p key={index} className="leading-relaxed">
            {trimmedPart}
          </p>
        );
      })}
    </div>
  );
};

/**
 * Enhanced formatter for medical content with specific styling optimized for chatbot
 */
export const MedicalFormattedMessage: React.FC<FormattedMessageProps> = ({ text, className = '' }) => {
  const formattedText = formatMessageText(text);
  const parts = formattedText.split('\n').filter(part => part.trim());
  
  return (
    <div className={`space-y-2 text-sm ${className}`}>
      {parts.map((part, index) => {
        const trimmedPart = part.trim();
        
        if (!trimmedPart) return null;
        
        // Medical headers with special styling
        if (trimmedPart.startsWith('**') && trimmedPart.endsWith('**')) {
          const headerText = trimmedPart.slice(2, -2);
          return (
            <div key={index} className="font-bold text-current opacity-90 mt-3 mb-1 pb-1 border-b border-current border-opacity-20">
              {headerText}
            </div>
          );
        }
        
        // Dosage information with highlight
        if (/dose|dosagem|mg\/kg|ml\/kg|gotas|comprimido|ml|mg/i.test(trimmedPart)) {
          return (
            <div key={index} className="bg-current bg-opacity-10 border-l-2 border-current border-opacity-30 pl-3 py-1 rounded-r-md my-2">
              <p className="font-medium text-current">{parseMarkdown(trimmedPart)}</p>
            </div>
          );
        }
        
        // Warning or important information
        if (/atenção|importante|cuidado|alerta|contraindicação|emergência|urgente/i.test(trimmedPart)) {
          return (
            <div key={index} className="bg-red-100 border-l-2 border-red-400 pl-3 py-1 rounded-r-md my-2">
              <p className="font-medium text-red-800">{parseMarkdown(trimmedPart)}</p>
            </div>
          );
        }
        
        // Numbered lists with medical styling
        if (/^\d+\.\s/.test(trimmedPart)) {
          return (
            <div key={index} className="ml-3 mb-2 flex items-start">
              <span className="font-bold text-current opacity-80 mr-2 mt-0.5 min-w-[1.5rem]">
                {trimmedPart.match(/^\d+\./)?.[0]}
              </span>
              <span className="text-current opacity-90 leading-relaxed">
                {parseMarkdown(trimmedPart.replace(/^\d+\.\s/, ''))}
              </span>
            </div>
          );
        }
        
        // Bullet points
        if (/^[•\-\*]\s/.test(trimmedPart)) {
          return (
            <div key={index} className="ml-3 mb-1 flex items-start">
              <span className="text-current opacity-70 mr-2 mt-1 font-bold">•</span>
              <span className="text-current opacity-90 leading-relaxed">{parseMarkdown(trimmedPart.replace(/^[•\-\*]\s/, ''))}</span>
            </div>
          );
        }
        
        // Regular paragraphs with markdown support
        return (
          <p key={index} className="leading-relaxed text-current opacity-95 mb-2">
            {parseMarkdown(trimmedPart)}
          </p>
        );
      })}
    </div>
  );
};
