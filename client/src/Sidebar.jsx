import { Box, HStack, Heading, VStack, Text, Center } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";


function NavItem(props){
    return(
        <HStack bg="#463bfa" spacing="4"> 
            <props.icon fill="white"/>
            <Text fontWeight={300} color="white">{props.text}</Text>
        </HStack>
    )
}

function Sidebar(){
    return(
        <Box bg="#463bfa" h="100%" w="100%" pt="40px" borderBottomLeftRadius="30px">
            <Center w="100" >
                <VStack spacing={8} align="left">
                        <NavItem icon={AiFillHome} text="Dashboard"/>
                        <NavItem icon={AiFillHome} text="Hisenberg"/>
                        <NavItem icon={AiFillHome} text="Dashboard"/>
                </VStack>
            </Center>
        </Box>
    )
}

export default Sidebar;