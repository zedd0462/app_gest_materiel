import { useState } from 'react'
import Login from './login'
import { VStack, Center } from '@chakra-ui/react'
import './App.css'

function App() {

  return (
    <div>
      <VStack alignItems='center'>
          <Login />
      </VStack>
    </div>
  )
}

export default App
