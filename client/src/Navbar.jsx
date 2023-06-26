// @ts-nocheck
import { Box, Flex, HStack, Heading, Image, Spacer } from "@chakra-ui/react";
import defaultUserImg from "./assets/defaultUserImg.png";
import { useState } from "react";


function Navbar (){
    // const [loggedin, setLoggedin] = useState(false);
    const [name, setName] = useState("Laura Jane");
    // //TODO: remove later
    // setLoggedin(true);
    


    return(
        <HStack bg="#668FFF"  w='100%' h='100%' spacing='0' borderTopRightRadius="30px">
            <HStack w='100%' h='100%' px="8" spacing='0'>
                <Box  w='60%' h='100%'></Box>
                <Spacer/>
                <HStack w='40%'>
                    <Spacer />
                    <Heading fontSize="xl" color="white" fontWeight="300" >Hi {name}</Heading>
                    <Image src={defaultUserImg}></Image>  
                </HStack>
            </HStack>
        </HStack>
    )
}

export default Navbar;