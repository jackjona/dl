"use client";
import { useState } from "react";

export default function Home() {

    const [url, setUrl] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
  
    const validDomains = ['pixeldrain.com', 'cdn.pixeldrain.com']; // Also validated in the back-end code
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const domain = new URL(url).hostname;
        if (!validDomains.includes(domain)) {
          throw new Error('Invalid domain');
        }
  
        const res = await fetch('/api/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });
  
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
  
        const result = await res.blob();
        const downloadUrl = window.URL.createObjectURL(result);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'file'); // you can specify the file name
        document.body.appendChild(link);
        link.click();
        link.remove();
  
        setData('Download started');
      } catch (error) {
        setError(error.message);
        setData(null);
      }
    }  
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-20">
      <h1 className="text-6xl font-bold pb-12">Input Origin URL</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL"
          className="border-2 hover:ring-4 rounded-md mx-2 p-2 text-black"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold p-2 rounded-xl"
        >
          Fetch
        </button>
      </form>
 
      {error && <p id="errorMessage">{error}</p>}
      {data && <p id="data">{data}</p>}
    </div>
  );
}
