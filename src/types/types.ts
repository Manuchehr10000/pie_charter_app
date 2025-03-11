export interface ChartData {
  id: number
  label: string
  value: number
  color: string
}

export interface User {
  id: string
  name: string
  chartData: ChartData[]
}

export interface UserState {
  users: User[]
  currentUserId: string | null
}