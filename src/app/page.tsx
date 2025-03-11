"use client"

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import PieChart from '@/components/PieChart'
import DataTable from '@/components/DataTable'
import { ChartData, User } from '@/types/types'

const DEFAULT_DATA: ChartData[] = [
  { id: 1, label: 'Category 1', value: 5, color: '#4E79A7' },
  { id: 2, label: 'Category 2', value: 5, color: '#F28E2B' },
  { id: 3, label: 'Category 3', value: 5, color: '#E15759' },
  { id: 4, label: 'Category 4', value: 5, color: '#76B7B2' },
  { id: 5, label: 'Category 5', value: 5, color: '#59A14F' },
]

export default function Home() {
  const [chartData, setChartData] = useState<ChartData[]>(DEFAULT_DATA)
  const [isClient, setIsClient] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  
  // Get current user name for title
  const currentUser = users.find(u => u.id === currentUserId)
  const pageTitle = currentUser ? `${currentUser.name}'s life` : 'Life Chart Demo'
  
  // Create a sample user
  const createSampleUser = () => {
    const userId = uuidv4()
    const newUser = {
      id: userId,
      name: 'Sample User',
      chartData: [...DEFAULT_DATA]
    }
    
    setUsers([newUser])
    setCurrentUserId(userId)
    setChartData([...DEFAULT_DATA])
    
    // Save to localStorage
    localStorage.setItem('lifeChartUsers', JSON.stringify([newUser]))
    localStorage.setItem('currentUserId', userId)
  }
  
  // Load users from localStorage or create sample user
  useEffect(() => {
    setIsClient(true)
    
    try {
      const savedUsers = localStorage.getItem('lifeChartUsers')
      const savedCurrentUserId = localStorage.getItem('currentUserId')
      
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers)
        
        if (parsedUsers.length > 0) {
          setUsers(parsedUsers)
          
          // If we have a saved current user ID and it exists in our users
          if (savedCurrentUserId && parsedUsers.some((u: User) => u.id === savedCurrentUserId)) {
            setCurrentUserId(savedCurrentUserId)
            
            // Load that user's chart data
            const userData = parsedUsers.find((u: User) => u.id === savedCurrentUserId)
            if (userData && userData.chartData) {
              setChartData(userData.chartData)
            }
          } else {
            // Use the first user if no current user is set
            setCurrentUserId(parsedUsers[0].id)
            setChartData(parsedUsers[0].chartData || DEFAULT_DATA)
          }
        } else {
          // Create a sample user if the array is empty
          createSampleUser()
        }
      } else {
        // Create a sample user if no data exists
        createSampleUser()
      }
    } catch (error) {
      console.error('Error loading users from localStorage:', error)
      // If there's an error, create a sample user
      createSampleUser()
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  // Save users to localStorage when they change
  useEffect(() => {
    if (isClient && users.length > 0) {
      localStorage.setItem('lifeChartUsers', JSON.stringify(users))
    }
  }, [users, isClient])
  
  // Save current user ID to localStorage when it changes
  useEffect(() => {
    if (isClient && currentUserId) {
      localStorage.setItem('currentUserId', currentUserId)
    }
  }, [currentUserId, isClient])

  const handleAddUser = () => {
    if (newUserName.trim()) {
      const newUser: User = {
        id: uuidv4(),
        name: newUserName.trim(),
        chartData: [...DEFAULT_DATA]
      }
      
      setUsers(prev => [...prev, newUser])
      setCurrentUserId(newUser.id)
      setChartData([...DEFAULT_DATA])
      setNewUserName('')
      setIsAddingUser(false)
    }
  }

  const handleSelectUser = (userId: string) => {
    setCurrentUserId(userId)
    
    // Find and load the selected user's chart data
    const selectedUser = users.find(u => u.id === userId)
    if (selectedUser && selectedUser.chartData) {
      setChartData(selectedUser.chartData)
    }
  }

  const handleDataUpdate = (newData: ChartData[]) => {
    setChartData(newData)
    
    // Also update the user's stored data
    if (currentUserId) {
      setUsers(prev => 
        prev.map(user => 
          user.id === currentUserId
            ? { ...user, chartData: newData }
            : user
        )
      )
    }
  }
  
  const handleRemoveUser = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get the user we're removing
    const userToRemove = users.find(u => u.id === userId)
    if (!userToRemove) return
    
    // Confirm deletion
    const isConfirmed = window.confirm(`Are you sure you want to remove "${userToRemove.name}"? This action cannot be undone.`)
    if (!isConfirmed) return
    
    // Filter out the user from our list
    const updatedUsers = users.filter(u => u.id !== userId)
    setUsers(updatedUsers)
    
    // If we're removing the current user, select another user
    if (userId === currentUserId) {
      if (updatedUsers.length > 0) {
        // Select the first user in the list
        setCurrentUserId(updatedUsers[0].id)
        setChartData(updatedUsers[0].chartData)
      } else {
        // No users left, create a new sample user
        createSampleUser()
      }
    }
    
    // Update localStorage
    if (updatedUsers.length > 0) {
      localStorage.setItem('lifeChartUsers', JSON.stringify(updatedUsers))
    } else {
      // If no users left, clear localStorage
      localStorage.removeItem('lifeChartUsers')
      localStorage.removeItem('currentUserId')
    }
  }

  if (!isClient || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-4">
      {/* User Tabs - Excel Style */}
      <div className="border-b border-gray-200 mb-5">
        <div className="flex items-center space-x-1 overflow-x-auto py-1">
          {users.map(user => (
            <div 
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              className={`
                flex items-center px-4 py-2 text-sm font-medium rounded-t-lg cursor-pointer
                ${currentUserId === user.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              <span>{user.name}</span>
              <button
                onClick={(e) => handleRemoveUser(user.id, e)}
                className={`
                  ml-2 rounded-full p-1 
                  ${currentUserId === user.id 
                    ? 'hover:bg-blue-600 text-white' 
                    : 'hover:bg-gray-300 text-gray-500'}
                `}
                title="Remove User"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          
          {/* Add New Tab Button */}
          {isAddingUser ? (
            <div className="flex items-center bg-white border border-gray-300 rounded-t-lg px-2">
              <input
                type="text"
                placeholder="User name"
                className="py-1 px-2 text-sm border-none outline-none focus:ring-0"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
                autoFocus
              />
              <div className="flex space-x-1">
                <button
                  onClick={handleAddUser}
                  className="text-green-600 hover:text-green-800"
                  title="Add"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setIsAddingUser(false);
                    setNewUserName('');
                  }}
                  className="text-red-600 hover:text-red-800"
                  title="Cancel"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingUser(true)}
              className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-t-lg"
              title="Add User"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 text-center">
        {pageTitle}
      </h1>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1fr] gap-4 md:items-start">
        <div>
          <PieChart data={chartData} />
        </div>
        <div className="pt-8">
          <DataTable data={chartData} onDataUpdate={handleDataUpdate} />
        </div>
      </div>
    </main>
  )
}