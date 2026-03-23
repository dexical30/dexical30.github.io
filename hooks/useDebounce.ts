import { useEffect, useMemo, useRef } from 'react'

const useDebounce = <T extends (...args: never[]) => void>(func: T, delay: number): T => {
  const callbackRef = useRef(func)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    callbackRef.current = func
  }, [func])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const debounced = useMemo(
    () =>
      ((...args: Parameters<T>) => {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          callbackRef.current(...args)
        }, delay)
      }) as T,
    [delay]
  )

  return debounced
}

export default useDebounce
