import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'

type AnimatedCardProps<T extends ElementType> = {
  as?: T
  index?: number
  variant?: 'default' | 'interactive'
  className?: string
  children?: ReactNode
  style?: CSSProperties
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'index' | 'variant' | 'className' | 'children' | 'style'>

export function AnimatedCard<T extends ElementType = 'div'>({
  as,
  index = 0,
  variant = 'interactive',
  className = '',
  children,
  style,
  ...rest
}: AnimatedCardProps<T>) {
  const Component = (as ?? 'div') as ElementType
  const { ref, inView } = useInView<HTMLElement>()

  const classes = [
    'card-reveal',
    variant === 'interactive' ? 'card-interactive' : '',
    inView ? 'card-reveal-visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component
      ref={ref}
      className={classes}
      style={
        {
          ...style,
          '--card-delay': `${index * 90}ms`,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Component>
  )
}
