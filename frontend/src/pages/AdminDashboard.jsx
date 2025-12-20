import { useSelector, useDispatch } from 'react-redux'
import React from "react"
import { setWorkshops } from '../redux/slices/workshopSlice'
import WorkshopCard from '../components/WorkshopCard'

export default function AdminDashboard() {
  const { workshops } = useSelector((state) => state.workshop)
  const dispatch = useDispatch()

  const handleDelete = (id) => {
    dispatch(setWorkshops(workshops.filter(ws => ws._id !== id)))
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workshops.map(ws => (
          <WorkshopCard key={ws._id} workshop={ws} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}
