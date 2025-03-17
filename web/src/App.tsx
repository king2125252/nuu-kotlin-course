import { useState } from "react";

function App() {
  const [users, setUsers] = useState<string>('');

  const getUsers = async () => {
    fetch('/api/users').then(response => response.json()).then(data => {
      console.log(JSON.stringify(data))
      setUsers(JSON.stringify(data))
    }).catch(error => {
      console.error('There was an error!', error)
    })
  }


  return (
    <div className="m-5">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer" onClick={() => {
        getUsers()
      }}>
        Click me
      </button>
      <div>
        {users}
      </div>
    </div>
  )
}


export default App
