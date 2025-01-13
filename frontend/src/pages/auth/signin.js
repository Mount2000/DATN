import { Button, Flex, Input, FormLabel, Text, FormControl } from "@chakra-ui/react";
import { useCallback, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { login } from '../../store/accountSlice'
import { apiLogin } from "../../apis/auth";
import { IoHome } from "react-icons/io5";
import Swal from 'sweetalert2';

function SignIn() {
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [invalidFields, setInvalidFields] = useState({email: "", password: ""});
  const payload = useRef({email: "", password:""});
  let payloadList = ["email", "password"]
  function validate () {
    let invalid = true
    const data = payload.current
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!data.email.match(regex) || data.email === "") {
        invalid = false;
        setInvalidFields(prev => ({... prev, email: 'Email invalid.'}))
    }
    else{
      setInvalidFields(prev => ({... prev, email: ''}))
    }
    if (data.password.length < 6 || data.password === "") {
      invalid = false;
      setInvalidFields(prev => ({... prev, password: 'password invalid.'}))
    }
    else{
      setInvalidFields(prev => ({... prev, password: ''}))
    }
    return invalid;
  }
  const handleLogin = useCallback(async ()=>{
    const data = payload.current
    const isValidate = validate()
    if(isValidate ){
      const result = await apiLogin(data)
      console.log(result)
      if(result.status == 200)
      {
        navigate("/")
        dispatch(login({
          userName: result.metaData.userName,
          role: result.metaData.role,
        }))
      }
      else if(result.status == 201){
        navigate("/verify2FALogin/"+result.metaData.token)
      }
      else{
        Swal.fire('Oops!', result.message, 'error')
      }
    }
  })

  return (
    <Flex
    w="30vw"
    h="80vh"
    position="absolute"
    top="10vh"
    right="35%"
    p="12px 40px"
    bg="#bbb"
    borderRadius="5px"
    border="1px solid black"
    alignItems="center"
    flexDirection="column"
    gap="8px"
    >
      <Link to="/">
        <IoHome/>
      </Link>
      {payloadList.map((element, index) => {
        return(
          <FormControl w="100%">
          <FormLabel htmlFor={element}>{element.slice(0, 1).toUpperCase() + element.slice(1)}</FormLabel>
          <Input 
          key={index}
          w="100%"
          h="36px"
          p="0 4px"
          borderRadius="4px"
          placeholder={element}
          type={element === "password" ? "password" : "text"}
          onChange={e => {payload.current[element] = e.target.value
          }}
          />
          {<Text>{invalidFields[element]}</Text>}
          </FormControl>
        )
      })}
      <Button
      cursor="pointer"
      onClick={handleLogin}
      >
        Login
      </Button>
      <Link to="/register">
        Register
      </Link>
      <Link to="/forgotPassword">
        Forgot password
      </Link>
    </Flex>
  )
}
export default SignIn