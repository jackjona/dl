"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'

const allowedDomains = ['pixeldrain.com', 'cdn.pixeldrain.com']

export default function Queue() {
  const [url, setUrl] = useState('')
  const [queue, setQueue] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedQueue = sessionStorage.getItem('downloadQueue')
    if (storedQueue) {
      setQueue(JSON.parse(storedQueue))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const domain = new URL(url).hostname
      if (!allowedDomains.includes(domain)) {
        throw new Error('Invalid domain')
      }
      const updatedQueue = [...queue, url]
      setQueue(updatedQueue)
      sessionStorage.setItem('downloadQueue', JSON.stringify(updatedQueue))
      setUrl('')
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDownload = async (downloadUrl) => {
    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: downloadUrl }),
      })

      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }

      const result = await res.blob()
      const blobUrl = window.URL.createObjectURL(result)
      const link = document.createElement('a')
      link.href = blobUrl
      link.setAttribute('download', 'file')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleRemove = (removeUrl) => {
    const updatedQueue = queue.filter((item) => item !== removeUrl)
    setQueue(updatedQueue)
    sessionStorage.setItem('downloadQueue', JSON.stringify(updatedQueue))
  }

  return (
    <div className="p-4  text-center">
      <h1 className="text-6xl font-bold pb-12">Queue - [Deprecated]</h1>
      <h2 className="text-4xl font-semibold pb-12">This page is now deprecated please use the updated <Link
        className="underline hover:underline-offset-4"
        href="/queue"
      >
        queue
      </Link>.</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="border p-2 w-full mb-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add to Queue
        </button>
      </form>
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      <ul className="list-disc pl-5">
        {queue.map((item, index) => (
          <li key={index} className="flex justify-between items-center mb-2">
            <span>{item}</span>
            <div>
              <button
                onClick={() => handleDownload(item)}
                className="bg-green-500 text-white p-1 rounded mr-2"
              >
                Download
              </button>
              <button
                onClick={() => handleRemove(item)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
