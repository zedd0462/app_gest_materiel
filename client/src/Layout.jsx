import { Box, Center, Grid, GridItem } from "@chakra-ui/react"
import Navbar from "./Navbar.jsx"
import Logo from "./assets/Logo.jsx"
import Sidebar from "./Sidebar.jsx"
import Login from "./Login.jsx"


function Layout() {
  return (
    <Box 
    h='100%' 
    w='100%'
    borderRadius='30px'
    boxShadow='dark-lg'
    >
      <Grid
      templateAreas={`"logo header"
                      "nav main"`}
      gridTemplateRows={'75px 1fr'}
      gridTemplateColumns={'250px 1fr'}
      h='100%'
      w='100%'
      color='blackAlpha.700'
      fontWeight='bold'
      >
        <GridItem area={'logo'} >
          <Box bg="#1e22ff" h="100%" w="100%" borderTopLeftRadius="30px">
            <Center h="100%" w="100%">
              <Logo />  
            </Center>
          </Box>
        </GridItem>
        <GridItem area={'header'}>
          <Navbar />
        </GridItem>
        <GridItem area={'nav'}>
          <Sidebar/>
        </GridItem>
        <GridItem area={'main'}>
          <Box bg="#f2f5fa" w="100%" h="100%" borderBottomRightRadius="30px">
            <Login />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default Layout;