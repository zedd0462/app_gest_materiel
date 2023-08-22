import { Box, HStack, Heading, VStack, Text, Center, border, transition } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { motion } from "framer-motion";
import MotionBox from "./MotionBox.jsx";

function NavItem(props){
    return(
        <MotionBox
            initial={{padding:"0",margin:"0"}}
            whileHover={{
                scale:1.2,
                padding:"8px",
                cursor:"pointer"
            }}
            whileTap={{scale:0.95}}
            transition={{duration:"0.2"}}
        >
            <HStack 
            bg="#463bfa"
            spacing="4"
            > 
                <props.icon fill="white"/>
                <Text fontWeight={300} color="white">{props.text}</Text>
            </HStack>
        </MotionBox>
    )
}

function Sidebar(){
    return(
        <Box bg="#463bfa" h="100%" w="100%" pt="40px" borderBottomLeftRadius="30px">
            <Center w="100" >
                <VStack spacing={8} align="left">
                        <NavItem icon={AiFillHome} text="Tableau de bord    "/>
                        <NavItem icon={AiFillHome} text="Hisenberg"/>
                        <NavItem icon={AiFillHome} text="Dashboard"/>
                </VStack>
            </Center>
        </Box>
    )
}

export default Sidebar;