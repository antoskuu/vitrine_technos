import Header from '../Header'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default RootLayout