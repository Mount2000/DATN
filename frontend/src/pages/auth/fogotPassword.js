import { Button, Flex, Input, FormLabel, Text, FormControl } from "@chakra-ui/react";
import { useCallback, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { apiForgotPassword } from "../../apis/auth";
import { IoHome } from "react-icons/io5";
import Swal from 'sweetalert2';

function ForgotPassword() {
  
  const [invalidFields, setInvalidFields] = useState({email: ""});
  const payload = useRef({email: ""});
  let payloadList = ["email"]
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
    return invalid;
  }
  const handleForgotPassword = useCallback(async ()=>{
    const data = payload.current
    console.log(data)
    const isValidate = validate()
    if(isValidate ){
      const result = await apiForgotPassword(data)
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
            <FormLabel htmlFor={element}>{element.slice(0, 1).toUpperCase() + element.slice(1)}</FormLabel>
            <Input 
            key={index}
            w="100%"
            h="36px"
            p="0px 4px"
            borderRadius="4px"
            placeholder={element}
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
      onClick={handleForgotPassword}
      >
        Confirm
      </Button>
      <Link to="/login">
        Login
      </Link>
    </Flex>
  )
}
export default ForgotPassword