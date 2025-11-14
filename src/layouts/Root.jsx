import { Outlet } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState, createContext, useContext } from "react"
import { setUser, clearUser, setInitialized } from "@/store/userSlice"
import { getRouteConfig, verifyRouteAccess } from "@/router/route.utils"
import { getApperClient } from "@/services/apperClient"

// Auth context for logout functionality
const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within Root component")
  }
  return context
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
)

export default function Root() {
  const { isInitialized } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [authInitialized, setAuthInitialized] = useState(false)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      // Wait for SDK to load and get client
      const apperClient = await getApperClient()

      if (!apperClient || !window.ApperSDK) {
        console.error('Failed to initialize ApperSDK or ApperClient')
        dispatch(clearUser())
        handleAuthComplete()
        return
      }

      // Initialize completed
      handleAuthComplete()

    } catch (error) {
      console.error('Failed to initialize authentication:', error)
      dispatch(clearUser())
      handleAuthComplete()
    }
  }

  const handleAuthComplete = () => {
    setAuthInitialized(true) // Local loading state
    dispatch(setInitialized(true)) // Redux state for route guards
  }

  const logout = async () => {
    try {
      dispatch(clearUser())
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Show loading spinner until auth is initialized
  if (!authInitialized) {
    return <LoadingSpinner />
  }

  return (
    <AuthContext.Provider value={{ logout, isInitialized: authInitialized }}>
      <Outlet />
    </AuthContext.Provider>
  )
}