// SVG - Z1 Nutrition style
export function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="11" cy="11" r="7" /><path d="M20 20L16.5 16.5" />
    </svg>
  )
}
export function IconHeart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 21s-6-4.5-8.5-8.5A4.5 4.5 0 0 1 12 5a4.5 4.5 0 0 1 8.5 7.5C18 16.5 12 21 12 21z" />
    </svg>
  )
}
export function IconCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M6 6h15l-1.5 9H7L6 6z" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M6 6L5 2H2" />
    </svg>
  )
}
export function IconPhone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8l-1.4 1.4a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 1.8-.6l3 .5A2 2 0 0 1 22 16.9z" />
    </svg>
  )
}
export function IconTruck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12h13z" /><path d="M14 9h5l3 5v4h-8" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" />
    </svg>
  )
}
export function IconStar({ filled, ...rest }: React.SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" {...rest}>
      <path d="M12 3l2.5 5.5L20 9l-4 4 1 6L12 16l-5 3 1-6-4-4 5.5-.5L12 3z" />
    </svg>
  )
}
export function IconMuscle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 14a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" /><path d="M16 14a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" /><path d="M8 14h8" /><path d="M8 10l-2-2 2-2" /><path d="M16 10l2-2-2-2" />
    </svg>
  )
}
export function IconFire(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 3s4 3 4 7a4 4 0 0 1-8 0c0-2 1-3 2-4 1 1 2 2 2 4a2 2 0 0 0 4 0c0-4-4-7-4-7z" /><path d="M9 21h6" />
    </svg>
  )
}
export function IconZap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  )
}
export function IconApple(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 20a5 5 0 0 0 5-5c0-3-2-5-5-5s-5 2-5 5a5 5 0 0 0 5 5z" /><path d="M12 15V9" /><path d="M8 11s1.5-1 4-1 4 1 4 1" />
    </svg>
  )
}
export function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}