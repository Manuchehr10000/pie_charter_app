import { User, UserState, ChartData } from '@/types/types'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'pieChartUsers'

const DEFAULT_CHART_DATA: ChartData[] = [
  { id: 1, label: 'Category 1', value: 5, color: '#4E79A7' },
  { id: 2, label: 'Category 2', value: 5, color: '#F28E2B' },
  { id: 3, label: 'Category 3', value: 5, color: '#E15759' },
  { id: 4, label: 'Category 4', value: 5, color: '#76B7B2' },
  { id: 5, label: 'Category 5', value: 5, color: '#59A14F' },
]

// Get all users from localStorage
export const getUsers = async (): Promise<User[]> => {
  try {
    const usersJSON = localStorage.getItem(STORAGE_KEY)
    return usersJSON ? JSON.parse(usersJSON) : []
  } catch (error) {
    console.error('Failed to get users:', error)
    return []
  }
}

// Save users to localStorage
const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error('Failed to save users:', error)
  }
}

// Get user state from localStorage or initialize with defaults
export const getUserState = async (): Promise<UserState> => {
  try {
    const users = await getUsers()
    
    // Get current user ID from localStorage
    const currentUserId = localStorage.getItem('currentUserId') || null
    
    // Check if current user exists in the users list
    const currentUserExists = currentUserId && users.some(user => user.id === currentUserId)
    
    return {
      users,
      currentUserId: currentUserExists ? currentUserId : users.length > 0 ? users[0].id : null
    }
  } catch (error) {
    console.error('Failed to get user state:', error)
    return { users: [], currentUserId: null }
  }
}

// Add a new user
export const addUser = async (name: string): Promise<User> => {
  try {
    const users = await getUsers()
    
    const newUser: User = {
      id: uuidv4(),
      name,
      chartData: [...DEFAULT_CHART_DATA]
    }
    
    const updatedUsers = [...users, newUser]
    saveUsers(updatedUsers)
    
    return newUser
  } catch (error) {
    console.error('Failed to add user:', error)
    throw error
  }
}

// Update user's chart data
export const updateUserChartData = async (userId: string, chartData: ChartData[]): Promise<void> => {
  try {
    const users = await getUsers()
    
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, chartData } 
        : user
    )
    
    saveUsers(updatedUsers)
  } catch (error) {
    console.error('Failed to update user chart data:', error)
    throw error
  }
}

// Set current user ID
export const setCurrentUserId = (userId: string): void => {
  localStorage.setItem('currentUserId', userId)
} 