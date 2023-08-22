import { Box, Grid, GridItem, Heading, VStack } from "@chakra-ui/react";


function Card(props) {
    const {children, ...rest} = props;
    return(
        <Box  w="100%"bg="#ffFfff" borderRadius="15px" boxShadow="lg" {...rest}>
            {children}
        </Box>
    );
}


function Dashboard() {
    return (
        <VStack w="100%" h="100%">
            <Box textAlign={"left"} w="100%" pl={2}>
                <Heading fontSize="xl" fontWeight="400" color="#0c0c4f" mb="3">Table Title</Heading>
            </Box>
            <Grid templateColumns='60% 40%' gap={1} h="90%" borderRadius="20px" w="100%">
                <GridItem   w='100%' h='100%'  > 
                    <VStack h="100%" w="100%" p="2" gap={4}>
                            <Card h="50%">
                                
                            </Card>
                            <Card h="50%">
                                
                            </Card>
                    </VStack>
                </GridItem>
                <GridItem w='100%' h='100%' >
                    <VStack w="100%" p="2" h="100%" gap="4">
                            <Card h="33%">
                                
                            </Card>
                            <Card h="33%">
                                
                            </Card>
                            <Card h="33%">
                                
                            </Card>
                            
                    </VStack>
                </GridItem>

            </Grid>
        </VStack>
    );
}

export default Dashboard;
