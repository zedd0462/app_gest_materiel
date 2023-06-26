import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import '@fontsource-variable/montserrat';


const theme = extendTheme({
  fonts: {
    heading: `'Montserrat Variable', sans-serif`,
    body: `'Montserrat Variable', sans-serif`,
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
