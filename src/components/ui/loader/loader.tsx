import styles from './loader.module.css'
import cn from 'classnames'

interface Props {
  className?: string
  text?: string
  showText?: boolean
  simple?: boolean
}

const Loader = (props: Props) => {
  const { className, showText = true, text = 'Loading...', simple } = props
  return (
    <>
      {simple ? (
        <div className={cn(className, styles.simple_loading)} />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200" />
            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
              <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Loader
