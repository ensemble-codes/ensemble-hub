const styles = {
  borderImageSource: 'linear-gradient(91.95deg, rgba(255, 255, 255, 0.4) -4.26%, rgba(255, 255, 255, 0) 107.52%)',
  boxShadow: '5px 5px 10px 0px #D9D9D9 inset, -5px -5px 10px 0px #E7EBF0 inset',
}

type WindowProps = {
  children: React.ReactNode
}

export default function Window({ children }: WindowProps) {
  return (
    <div
      style={styles}
      className="grow bg-background rounded-2.5xl pt-10 px-4 pb-4 flex flex-col justify-between"
    >
      {children}
    </div>
  )
}
