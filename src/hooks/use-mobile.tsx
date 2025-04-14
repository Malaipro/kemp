
import * as React from "react"

// Updated breakpoints for better mobile responsiveness
const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

// Define the desktop breakpoint for completeness
const DESKTOP_BREAKPOINT = 1280

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkSize = () => window.innerWidth < MOBILE_BREAKPOINT
    
    // Set initial value
    setIsMobile(checkSize())
    
    const handleResize = () => {
      setIsMobile(checkSize())
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
    const checkSize = () => window.innerWidth < TABLET_BREAKPOINT && window.innerWidth >= MOBILE_BREAKPOINT
    
    // Set initial value
    setIsTablet(checkSize())
    
    const handleResize = () => {
      setIsTablet(checkSize())
    }
    
    window.addEventListener('resize', handleResize)
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isTablet
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkSize = () => window.innerWidth >= DESKTOP_BREAKPOINT
    
    // Set initial value
    setIsDesktop(checkSize())
    
    const handleResize = () => {
      setIsDesktop(checkSize())
    }
    
    window.addEventListener('resize', handleResize)
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isDesktop
}

// Combined hook for better responsive control
export function useResponsive() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()

  return { isMobile, isTablet, isDesktop }
}
