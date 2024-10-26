"use client"
import { useState, useEffect } from 'react'

const allowedDomains = ['pixeldrain.com', 'cdn.pixeldrain.com']
const allowedAPIBaseDomains = ['workers.dev', 'cloudflare.com']

export default function Queue() {
  const [url, setUrl] = useState('')
  const [queue, setQueue] = useState([])
  const [error, setError] = useState(null)
  const [direct, setDirect] = useState(false)
  const [baseAPIUrl, setBaseAPIUrl] = useState('')
  const [apiInput, setApiInput] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const storedQueue = sessionStorage.getItem('downloadQueue')
    if (storedQueue) {
      setQueue(JSON.parse(storedQueue))
    }

    const storedAPIUrl = sessionStorage.getItem('baseAPIUrl')
    if (storedAPIUrl) {
      setBaseAPIUrl(storedAPIUrl)
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
      if (direct) {
        const fileId = downloadUrl.match(/\/u\/([^\/]+)/)[1]
        const directUrl = `${baseAPIUrl}?origin=https://pixeldrain.com/api/file/${fileId}?download`
        window.location.href = directUrl
      } else {
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
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const handleRemove = (removeUrl) => {
    const updatedQueue = queue.filter((item) => item !== removeUrl)
    setQueue(updatedQueue)
    sessionStorage.setItem('downloadQueue', JSON.stringify(updatedQueue))
  }

  const handleAPIUrlChange = () => {
    try {
      const domain = new URL(apiInput).hostname
      const isSubdomainOrMatch = allowedAPIBaseDomains.some((allowedDomain) => {
        return domain === allowedDomain || domain.endsWith(`.${allowedDomain}`)
      })
      if (!isSubdomainOrMatch) {
        throw new Error('Invalid base API domain')
      }
      setBaseAPIUrl(apiInput)
      sessionStorage.setItem('baseAPIUrl', apiInput)
      setSuccessMessage(`Base API URL set to ${apiInput}`)
      setApiInput('')
    } catch (error) {
      setError(error.message)
    }
  }

  const handleAPIUrlDelete = () => {
    setBaseAPIUrl('')
    sessionStorage.removeItem('baseAPIUrl')
    setSuccessMessage('Base API URL deleted')
  }

  return (
    <div className="p-4">
      <h1 className="text-6xl font-bold pb-12 text-center">Queue</h1>
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
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={direct}
            onChange={(e) => setDirect(e.target.checked)}
            className="mr-2"
          />
          Direct Download
        </label>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={apiInput}
          onChange={(e) => setApiInput(e.target.value)}
          placeholder="Enter Base API URL"
          className="border p-2 w-full mb-2"
        />
        <button
          type="button"
          onClick={handleAPIUrlChange}
          className="bg-blue-500 text-white p-2 rounded mr-2"
        >
          Set Base API URL
        </button>
        <button
          type="button"
          onClick={handleAPIUrlDelete}
          className="bg-red-500 text-white p-2 rounded"
        >
          Delete Base API URL
        </button>
      </div>
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      {baseAPIUrl && (
        <p className="mb-4">Current Base API URL: {baseAPIUrl}</p>
      )}
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      <ul className="list-disc pl-5">
        {queue.map((item, index) => (
          <li key={index} className="flex justify-between items-center mb-2">
            <span>{item}</span>
            {direct && (
              <span className="bg-yellow-500 text-white p-1 rounded">Direct</span>
            )}
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
