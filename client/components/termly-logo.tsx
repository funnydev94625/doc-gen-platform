export function TermlyLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="#4169e1" stroke="none" />
      <path d="M8 12h8" stroke="white" strokeWidth="2" />
      <path d="M12 8v8" stroke="white" strokeWidth="2" />
    </svg>
  )
}
