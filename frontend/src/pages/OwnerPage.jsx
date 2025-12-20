
import React from "react"

import { useDispatch } from 'react-redux'
import { addWorkshop } from '../redux/slices/workshopSlice'

export default function OwnerDashboard() {
  const dispatch = useDispatch()

  const handleAddWorkshop = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const newWorkshop = {
      _id: Date.now(),
      name: form.get('name'),
      type: form.get('type'),
      location: { lat: 27.7172, lng: 85.3240 }, // placeholder
    }
    dispatch(addWorkshop(newWorkshop))
    alert('Workshop added (dummy).')
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Owner Dashboard</h2>
      <form onSubmit={handleAddWorkshop} className="space-y-4">
        <input name="name" type="text" placeholder="Workshop Name" className="w-full p-2 border rounded" required />
        <select name="type" className="w-full p-2 border rounded">
          <option value="bike">Bike</option>
          <option value="car">Car</option>
          <option value="both">Both</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Workshop</button>
      </form>
    </div>
  )
}
