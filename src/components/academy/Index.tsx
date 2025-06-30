import React from 'react'
import Navbar from '../home/Navbar';
import Footer from '../home/Footer';
import Courses from "./Courses"

const Index = ({ onPageChange }: { onPageChange?: (page: string) => void }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onPageChange={onPageChange} />
      <main className="pt-28 pb-8 px-2 sm:px-0">
        <Courses />
      </main>
      <Footer onPageChange={onPageChange} />
    </div>
  )
}

export default Index