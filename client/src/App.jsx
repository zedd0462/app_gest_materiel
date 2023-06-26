import { useState, useEffect } from 'react'
import './App.css'
import Layout from './Layout.jsx'
import Login from './Login.jsx'
import { Box } from '@chakra-ui/react'

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    })
  }, [])
  return (
    <Box w={windowWidth} h={windowHeight} bg="#b5d0ff" p="10">
      <Layout/>
    </Box>
  )
}

export default App
