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
  if (!text || text.trim() === '') return '';

  let formatted = text.trim();

  // Normalize line breaks
  formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Respect sentence structure - only break after periods followed by capital letters if there's a clear new topic
  // Remove aggressive sentence breaking that was causing unwanted line breaks
  
  // Add line breaks only before clear numbered lists (with space after number)
  formatted = formatted.replace(/(\n|^)(\d+\.\s+)/g, '\n$2');

  // Add line breaks only before clear bullet points (with space after bullet)
  formatted = formatted.replace(/(\n|^)([•\-\*]\s+)/g, '\n$2');

  // Add line breaks before common medical section headers only when they appear at start of line or after punctuation
  const headers = [
    'Diagnóstico', 'Tratamento', 'Dosagem', 'Posologia', 'Indicações',
    'Contraindicações', 'Efeitos', 'Observações', 'Importante', 'Atenção',
    'Cuidados', 'Monitoramento', 'Sinais', 'Sintomas', 'Protocolo'
  ];
  
  headers.forEach(header => {
    const regex = new RegExp(`(\\.|\\n|^)\\s*(${header}:?)`, 'gi');
    formatted = formatted.replace(regex, '$1\n**$2**');
  });

  // Clean up multiple consecutive line breaks
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  // Remove leading line breaks
  formatted = formatted.replace(/^\n+/, '');

  // Trim final whitespace
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
  // Don't render anything if text is empty or just whitespace
  if (!text || text.trim() === '') {
    return null;
  }

  const formattedText = formatMessageText(text);
  
  // Don't render if formatted text is empty
  if (!formattedText) {
    return null;
  }
  
  const parts = formattedText.split('\n').filter(part => part.trim());
  
  // Don't render if no valid parts
  if (parts.length === 0) {
    return null;
  }
  
  return (
    <div className={`space-y-1.5 text-sm ${className}`}>
      {parts.map((part, index) => {
        const trimmedPart = part.trim();
        
        if (!trimmedPart) return null;
        
        // Medical headers with subtle styling (no border)
        if (trimmedPart.startsWith('**') && trimmedPart.endsWith('**')) {
          const headerText = trimmedPart.slice(2, -2);
          return (
            <div key={index} className="font-semibold text-current mt-2 mb-1 text-blue-600">
              {headerText}
            </div>
          );
        }
        
        // Dosage information with subtle highlight
        if (/dose|dosagem|mg\/kg|ml\/kg|gotas|comprimido|ml|mg/i.test(trimmedPart)) {
          return (
            <div key={index} className="bg-blue-50 px-2 py-1 rounded text-blue-800 my-1">
              <span className="font-medium">{parseMarkdown(trimmedPart)}</span>
            </div>
          );
        }
        
        // Warning or important information with subtle styling
        if (/atenção|importante|cuidado|alerta|contraindicação|emergência|urgente/i.test(trimmedPart)) {
          return (
            <div key={index} className="bg-orange-50 px-2 py-1 rounded text-orange-800 my-1">
              <span className="font-medium">{parseMarkdown(trimmedPart)}</span>
            </div>
          );
        }
        
        // Numbered lists with clean styling
        if (/^\d+\.\s/.test(trimmedPart)) {
          return (
            <div key={index} className="ml-2 mb-1 flex items-start">
              <span className="font-semibold text-blue-600 mr-2 mt-0.5 min-w-[1.2rem] text-xs">
                {trimmedPart.match(/^\d+\./)?.[0]}
              </span>
              <span className="text-current leading-relaxed">
                {parseMarkdown(trimmedPart.replace(/^\d+\.\s/, ''))}
              </span>
            </div>
          );
        }
        
        // Bullet points with clean styling
        if (/^[•\-\*]\s/.test(trimmedPart)) {
          return (
            <div key={index} className="ml-2 mb-1 flex items-start">
              <span className="text-blue-600 mr-2 mt-1.5 text-xs">•</span>
              <span className="text-current leading-relaxed">{parseMarkdown(trimmedPart.replace(/^[•\-\*]\s/, ''))}</span>
            </div>
          );
        }
        
        // Regular paragraphs with markdown support
        return (
          <p key={index} className="leading-relaxed text-current mb-1.5">
            {parseMarkdown(trimmedPart)}
          </p>
        );
      })}
    </div>
  );
};
