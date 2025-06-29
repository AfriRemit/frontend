import React from 'react'
import Maindashboard from "./dashboard/Maindashboard"

interface DashboardProps {
  onPageChange?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  return (
    <div>
      <Maindashboard onPageChange={onPageChange} />
    </div>
  )
}

export default Dashboard