
import React from "react"

export default function WorkshopCard({ workshop, onDelete }) {
    return (
      <div className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white">
        <h3 className="text-lg font-bold">{workshop.name}</h3>
        <p className="text-gray-600">Type: {workshop.type}</p>
        <p className="text-sm text-gray-500">
          Location: {workshop.location.lat}, {workshop.location.lng}
        </p>
  
        {onDelete && (
          <button
            onClick={() => onDelete(workshop._id)}
            className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        )}
      </div>
    )
  }
  