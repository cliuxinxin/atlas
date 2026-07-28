const Icon = ({ children, size = 18, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {children}
  </svg>
);

export const ArrowUpRight = (props) => (
  <Icon {...props}><path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" /></Icon>
);

export const Download = (props) => (
  <Icon {...props}><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" stroke="currentColor" strokeWidth="1.8" /></Icon>
);

export const Menu = (props) => (
  <Icon {...props}><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" /></Icon>
);

export const Close = (props) => (
  <Icon {...props}><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" /></Icon>
);

export const Chevron = (props) => (
  <Icon {...props}><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" /></Icon>
);

