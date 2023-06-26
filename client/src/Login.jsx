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

function Login(){
  const [show, setShow] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [alert, setAlert] = useState(<></>);
  const [loading, setLoading] = useState(false);
  const loginTypeText = [];
  loginTypeText ['user'] = 'Utilisateur';
  loginTypeText ['admin'] = 'Administrateur';
  const handlePasswordClick = () => setShow(!show);

  const loginIdHandler = (e) => {
    setLoginId(e.target.value);
  }
  const loginPasswordHandler = (e) => {
    setLoginPassword(e.target.value);
  }
  const submithandler = (e) => {
    setLoading(true);
    const baseUrl = import.meta.env.VITE_BASE_URL;
    e.preventDefault();
    let toAppend = '';
    let data = null;
    if(loginType === 'user'){
      toAppend = '/userAuth';
      data = {
        userId: loginId,
        password: loginPassword,
      }
    }else if(loginType === 'admin'){
      toAppend = '/adminAuth';
      data = {
        adminId: loginId,
        password: loginPassword,
      }
    }
    let url = baseUrl + toAppend;
    //console.log(data + " ::: " + JSON.stringify(data))
    fetch(url, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
      if(data.loggedin){
        setAlert(<></>);
        sessionStorage.setItem('loggedin', "true");
        sessionStorage.setItem('loginType', loginType);
        sessionStorage.setItem('loginId', loginId);
        setLoading(false);
        console.log("Logged in !" + sessionStorage.getItem('loggedin') + " " + sessionStorage.getItem('loginType') + " " + sessionStorage.getItem('loginId')); 
      }else{
        console.log("Not logged in !"); 
        setAlert(<Alert status='error'><AlertIcon />Identifiant / Mot de passe invalide !</Alert>);
        setLoading(false);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  }


  return (
    <Container maxW="7xl" >
      <Center>
        <Stack spacing={4}>
          <Stack align="center">
            <Heading fontSize="2xl" fontWeight="400" color="#0c0c4f">Se connecter</Heading>
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
              <FormControl id="id" isRequired>
                <FormLabel>Identifiant</FormLabel>
                <Input rounded="md" type="text" onChange={loginIdHandler}/>
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Mot de passe</FormLabel>
                <InputGroup size="md">
                  <Input rounded="md" type={show ? 'text' : 'password'} onChange={loginPasswordHandler}/>
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
              <Stack direction="row" justify="space-between" w="100%">
                <Box>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            {loginTypeText[loginType]}
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => { setLoginType("user") }} >Utilisateur</MenuItem>
                            <MenuItem onClick={() => { setLoginType("admin") }} >Administrateur</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
              </Stack>
              <Button
                bg="#4a3dff"
                _hover={{
                  bg: "#191552"
                }}
                color="white"
                rounded="md"
                w="100%"
                type="submit"
              >
                {loading ? <Spinner color='WhiteAlpha.500'/> : 'Se connecter'}
              </Button>
            </VStack>
          </VStack>
        </Stack>
      </Center>
    </Container>
  );
}

export default Login;