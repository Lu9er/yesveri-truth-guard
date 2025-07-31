export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Neural network brain icon */}
      <circle cx="8" cy="8" r="2" fill="currentColor" />
      <circle cx="24" cy="8" r="2" fill="currentColor" />
      <circle cx="8" cy="24" r="2" fill="currentColor" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
      <circle cx="6" cy="16" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="26" cy="16" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="16" cy="6" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="16" cy="26" r="1.5" fill="currentColor" opacity="0.7" />
      
      {/* Neural connections */}
      <path 
        d="M8 8 L16 16 M24 8 L16 16 M8 24 L16 16 M24 24 L16 16 M6 16 L16 16 M26 16 L16 16 M16 6 L16 16 M16 26 L16 16" 
        stroke="currentColor" 
        strokeWidth="1" 
        opacity="0.5"
      />
      
      {/* Verification checkmark overlay */}
      <circle cx="26" cy="6" r="4" fill="hsl(142 76% 36%)" />
      <path 
        d="M24 6 L25.5 7.5 L28 5" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};