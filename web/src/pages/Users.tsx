import { useEffect, useState } from "react";
import { User } from "../interfaces/User";

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [user, setUser] = useState<User>({ id: '', name: '', email: '', phoneNumber: '' })
  const [isAdd, setIsAdd] = useState<boolean>(true)

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async () => {
    fetch('/api/users').then(response => response.json()).then(data => {
      setUsers(data)
    }).catch(error => {
      console.error('There was an error!', error)
    })
  }

  const deleteUser = async (id: string) => {
    fetch(`/api/user/${id}`, {
      method: 'DELETE'
    }).then(() => {
      getUsers()
    }).catch(error => {
      console.error('There was an error!', error)
    })
  }

  const createUser = async (user: User) => {
    if (user.name === '' || user.email === '' || user.phoneNumber === '') {
      alert("請勿留白!")
      return
    }
    fetch(`/api/user`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    }).then(() => {
      getUsers()
      setUser({ id: '', name: '', email: '', phoneNumber: '' })
    }).catch(error => {
      console.error('There was an error!', error)
    })
  }

  const updateUser = async (user: User) => {
    if (user.name === '' || user.email === '' || user.phoneNumber === '') {
      alert("請勿留白!")
      return
    }
    fetch(`/api/user/${user.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    }).then(() => {
      getUsers()
      setUser({ id: '', name: '', email: '', phoneNumber: '' })
      setIsAdd(true)
    }).catch(error => {
      console.error('There was an error!', error)
    })
  }

  const handleChangeUser = (data: Partial<User>) => {
    setUser(prev => ({ ...prev, ...data }))
  }

  const handleUpdateBtn = (user: User) => {
    setUser(user)
    setIsAdd(false)
  }

  return (
    <div className="overflow-x-auto w-4/5 mx-auto mt-40 space-y-5">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
        <p className="text-2xl mb-4 underline">Create User</p>
        <div className="flex flex-row justify-around gap-12">
          <input type="text" className="bg-white focus:outline-none text-gray-800 p-2 rounded-lg w-full" placeholder="Name"
            value={user?.name} onChange={(e) => { handleChangeUser({ name: e.target.value }) }} />
          <input type="text" className="bg-white focus:outline-none text-gray-800 p-2 rounded-lg w-full" placeholder="Email"
            value={user?.email} onChange={(e) => { handleChangeUser({ email: e.target.value }) }} />
          <input type="text" className="bg-white focus:outline-none text-gray-800 p-2 rounded-lg w-full" placeholder="phoneNumber"
            value={user?.phoneNumber} onChange={(e) => { handleChangeUser({ phoneNumber: e.target.value }) }} />
          <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-lg
                  hover:bg-cyan-600 hover:cursor-pointer
                  active:scale-90 transition duration-200" onClick={() => {
              isAdd ? createUser(user) : updateUser(user)
            }}>
            {isAdd ? "Add" : "Update"}
          </button>
        </div>
      </div>

      <table className="w-full table p-4 bg-white rounded-lg shadow
      dark:bg-gray-800 dark:text-white">
        <thead className="border-b-2">
          <tr>
            <th className="p-4 whitespace-nowrap font-normal">
              name
            </th>
            <th className="p-4 whitespace-nowrap font-normal">
              email
            </th>
            <th className="p-4 whitespace-nowrap font-normal">
              phoneNumber
            </th>
            <th className="p-4 whitespace-nowrap font-normal">
              Update
            </th>
            <th className="p-4 whitespace-nowrap font-normal">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {
            users.map(user => {
              return (
                <tr className="text-center border-b-2 last:border-none" key={user.id}>
                  <td className="p-4">
                    {user.name}
                  </td>
                  <td className="p-4">
                    {user.email}
                  </td>
                  <td className="p-4">
                    {user.phoneNumber}
                  </td>
                  <td className="p-4">
                    <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-lg
                  hover:bg-cyan-600 hover:cursor-pointer
                  active:scale-90 transition duration-200" onClick={() => handleUpdateBtn(user)}>
                      Update
                    </button>
                  </td>
                  <td className="p-4">
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-lg
                  hover:bg-pink-600 hover:cursor-pointer
                  active:scale-90 transition duration-200" onClick={() => deleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default Users