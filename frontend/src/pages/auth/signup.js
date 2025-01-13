import { Button, Flex, Input, FormLabel, Text, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { useCallback, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { apiRegister } from "../../apis/auth";
import { IoHome } from "react-icons/io5";
import Swal from 'sweetalert2';
import { camelToSpace } from "../../utils/helper";

function SignUp() {
  
  const [invalidFields, setInvalidFields] = useState({email: "", password: "", "confirm password": "", "userName": "",});
  const payload = useRef({email: "", password:"", "confirm password": "", "userName": "",});
  let payloadList = ["email", "userName", "password", "confirm password"]
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
    if (data["confirm password"] !== data.password || data.password === "") {
      invalid = false;
      setInvalidFields(prev => ({... prev, "confirm password": 'confirm password do not match with password.'}))
    }
    else{
      setInvalidFields(prev => ({... prev, "confirm password": ''}))
    }
    return invalid;
  }
  const handleRegister = useCallback(async ()=>{
    const data = payload.current
    console.log(data)
    const isValidate = validate()
    if(isValidate ){
      const result = await apiRegister(data)
      if(result.success)
      {
        Swal.fire('Success!', result.message, 'success')
      }
      else{
        Swal.fire('Oops!', result.message, 'error')
      }
    }
  })

  return (
    <Flex
    w="30vw"
    minH="80vh"
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
          <FormLabel htmlFor={element}>{camelToSpace(element)}</FormLabel>
          <Input 
          key={index}
          w="100%"
          h="36px"
          p="0px 4px"
          borderRadius="4px"
          placeholder={camelToSpace(element)}
          type={element === "password" || element === "confirm password" ? "password" : "text"}
          onChange={e => {payload.current[element] = e.target.value
          }}
          />
          {<Text>{invalidFields[element]}</Text>}
          </ FormControl>
        )
      })}
      <Button
      cursor="pointer"
      onClick={handleRegister}
      >
        Register
      </Button>
      <Link to="/login">
        Login
      </Link>
    </Flex>
  )
}
export default SignUp