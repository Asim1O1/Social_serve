import { Outlet } from 'react-router'
import Navbar from './components/Navbar'


function App() {

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className='container mx-auto pt-20 pb-4 px-3 lg:px-0'>
        <Outlet />
      </main>
    </>
  )
}

export default App
