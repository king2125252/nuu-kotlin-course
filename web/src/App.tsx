import { Route, Routes } from "react-router";
import Users from "./pages/Users";

function App() {
  return (
    <Routes>
      <Route index element={<Users />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  )
}


export default App
