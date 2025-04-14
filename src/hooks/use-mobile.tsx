
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Set initial value
    setIsTablet(window.innerWidth < TABLET_BREAKPOINT && window.innerWidth >= MOBILE_BREAKPOINT)
    
    const handleResize = () => {
      setIsTablet(window.innerWidth < TABLET_BREAKPOINT && window.innerWidth >= MOBILE_BREAKPOINT)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isTablet
}
