export const Online = ({ color }: { color: string }) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="6" fill={color} />
    </svg>
  )
}

export const ProgressCircle = ({ progress }: { progress: number }) => {
  return (
    <div className="relative size-8">
      <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="15" fill="none" className="stroke-current text-malachite opacity-30" strokeWidth="6"></circle>
        <circle cx="18" cy="18" r="15" fill="none" className="stroke-current text-malachite" strokeWidth="6" strokeDasharray="100" strokeDashoffset={100 - progress} strokeLinecap="round"></circle>
      </svg>
    </div>
  )
}
