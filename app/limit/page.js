export default async function Limit() {

  let data = await fetch('https://pixeldrain.com/api/misc/rate_limits')
  let response = await data.json()

  return (
    <div className="grid items-center justify-items-center p-4 pb-10 text-center text-xl">
      <h1 className="text-6xl font-bold pb-12">Rate Limit Page</h1>
      <h2>Transfer limit used percentage: {((response.transfer_limit_used/response.transfer_limit)*100).toFixed(2)}%</h2>
      <h3>Tranfer limit: {(response.transfer_limit/ 1e6).toFixed(2)} MB</h3>
      <h3>Transfer limit used: {(response.transfer_limit_used/ 1e6).toFixed(2)} MB</h3>
     
   </div>
  );
}
