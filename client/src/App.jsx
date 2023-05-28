import { useState } from 'react'
import Login from './Login.jsx'
import AddUser from './AddUser.jsx'
import AddAdmin from './AddAdmin.jsx'
import { VStack, Center } from '@chakra-ui/react'
import './App.css'
import AddTicket from './AddTicket.jsx'

function App() {

  return (
    <div>
      <VStack alignItems='center'>
          <Login />
          <AddUser />
          <AddAdmin />
          <AddTicket />
      </VStack>
    </div>
  )
}

export default App
