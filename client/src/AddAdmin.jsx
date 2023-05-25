import {useState} from "react";
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



function AddAdmin(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState("");
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const handlePasswordClick = () => setShow(!show);
    const nameHandler = (e) => {
        setName(e.target.value);
    }
    const emailHandler = (e) => {
        setEmail(e.target.value);
    }
    const passwordHandler = (e) => {
        setPassword(e.target.value);
    }
    const submithandler = (e) => {
        e.preventDefault();
        setLoading(true);
        const baseUrl = import.meta.env.VITE_BASE_URL;
        fetch(baseUrl + '/addAdmin', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            setLoading(false);
            if(data.added){
                setAlert(
                    <Container>
                        <Alert status="success">
                        <AlertIcon />
                        Administrateur ajouté avec succès
                        </Alert>
                        <Alert status="success">
                            <AlertIcon />
                            ID du nouveau administrateur: {data.adminId}
                        </Alert>
                    </Container>
                )
            }else{
                setAlert(
                    <Alert status="error">
                        <AlertIcon />
                        Une erreur s'est produite
                    </Alert>
                )
            }
        })
    }


    return(
    <Container maxW="7xl" p={{ base: 5, md: 10 }}>
      <Center>
        <Stack spacing={4}>
          <Stack align="center">
            <Heading fontSize="2xl">Ajouter un Administrateur</Heading>
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
              <FormControl id="name" isRequired>
                <FormLabel>Nom</FormLabel>
                <Input rounded="md" type="text" onChange={nameHandler}/>
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input rounded="md" type="text" onChange={emailHandler}/>
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Mot de passe</FormLabel>
                <InputGroup size="md">
                  <Input rounded="md" type={show ? 'text' : 'password'} onChange={passwordHandler}/>
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      rounded="md"
                      bg={useColorModeValue('gray.300', 'gray.700')}
                      _hover={{
                        bg: useColorModeValue('gray.400', 'gray.800')
                      }}
                      onClick={handlePasswordClick}
                    >
                      {show ? <ViewOffIcon/> : <ViewIcon/>}
                    </Button>
                  </InputRightElement>
                </InputGroup>
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
    
}

export default AddAdmin;