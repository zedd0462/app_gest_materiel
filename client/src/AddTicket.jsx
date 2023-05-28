import { useState } from 'react';
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  VStack,
  Center,
  Textarea,
  InputGroup,
  InputRightElement,
  Box,
  Alert,
  AlertIcon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner
} from '@chakra-ui/react';

import { ChevronDownIcon , ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
//TODO add validation
function AddTicket(){
    const [title, setTitle] = useState("");
    const [severity, setSeverity] = useState("");
    const [deviceType, setDeviceType] = useState("");
    const [inventoryNum, setInventoryNum] = useState("");
    const [serialNum, setSerialNum] = useState("");
    const [description, setDescription] = useState("");
    const [alert, setAlert] = useState("");
    const [loading, setLoading] = useState(false);

    const titleHandler = (e) => {
        setTitle(e.target.value);
    }
    const severityHandler = (e) => {
        setSeverity(e.target.value);
    }
    const deviceTypeHandler = (e) => {
        setDeviceType(e.target.value);
    }
    const inventoryNumHandler = (e) => {
        setInventoryNum(e.target.value);
    }
    const serialNumHandler = (e) => {
        setSerialNum(e.target.value);
    }
    const descriptionHandler = (e) => {
        setDescription(e.target.value);
    }
    
    const submithandler = (e) => {
        e.preventDefault();
        setLoading(true);
        const baseUrl = import.meta.env.VITE_BASE_URL;
        fetch(baseUrl + '/addTicket', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                severity: severity,
                deviceType: deviceType,
                inventoryNum: inventoryNum,
                serialNum: serialNum,
                description: description
            })
        })
        .then(res => res.json())
        .then(data => {
            setLoading(false);
            if(data.added){
                setAlert(
                    <Alert status="success">
                        <AlertIcon />
                        Ticket ajouté avec succès
                    </Alert>
                );
            }else{
                setAlert(
                    <Alert status="error">
                        <AlertIcon />
                        {data.msg}
                    </Alert>
                );
            }
        })
        .catch(err => {
            setLoading(false);
            setAlert(
                <Alert status="error">
                    <AlertIcon />
                    {err}
                </Alert>
            );
        }
        );
    }
    //TODO: make the app fetch department list and make the depId a dropdown

    return (
        <Container maxW="7xl" p={{ base: 5, md: 10 }}>
            <Center>
            <Stack spacing={4}>
                <Stack align="center">
                    <Heading fontSize="2xl">Ajouter un Ticket</Heading>
                </Stack>
                <VStack
                as="form"
                boxSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                h="max-content !important"
                bg={useColorModeValue('white', 'gray.700')}
                rounded="lg"
                boxShadow="lg"
                p={{ base: 5, sm: 10 }}
                spacing={8}
                onSubmit={submithandler}
                >
                    <VStack spacing={4} w="100%">
                        {alert}
                        <FormControl id="title" isRequired>
                            <FormLabel>Titre</FormLabel>
                            <Input rounded="md" type="text" onChange={titleHandler}/>
                        </FormControl>
                        <FormControl id="severity" isRequired>
                            <FormLabel>Gravité</FormLabel>
                        <Input rounded="md" type="text" onChange={severityHandler}/>
                        </FormControl>
                        <FormControl id="deviceType" isRequired>
                            <FormLabel>Type d'appareil</FormLabel>
                            <Input rounded="md" type="text" onChange={deviceTypeHandler}/>
                        </FormControl>
                        <FormControl id="inventoryNum" isRequired>
                            <FormLabel>Numéro d'inventaire</FormLabel>
                            <Input rounded="md" type="text" onChange={inventoryNumHandler}/>
                        </FormControl>
                        <FormControl id="serialNum" isRequired>
                            <FormLabel>Numéro de série</FormLabel>
                            <Input rounded="md" type="text" onChange={serialNumHandler}/>
                        </FormControl>
                        <FormControl id="description" isRequired>
                            <FormLabel>Description</FormLabel>
                            <Textarea rounded="md" type="text" placeholder="Décrivez le problème ici" onChange={descriptionHandler}/>
                        </FormControl>
                        
                    </VStack>
                <VStack w="100%" spacing={4}>
                    <Button
                    bg="green.300"
                    color="white"
                    _hover={{
                        bg: 'green.500'
                    }}
                    rounded="md"
                    w="100%"
                    type="submit"
                    >
                        {loading ? <Spinner color='WhiteAlpha.500'/> : 'Ajouter'}
                    </Button>
                </VStack>
                </VStack>
            </Stack>
            </Center>
        </Container>
    );
};


export default AddTicket;