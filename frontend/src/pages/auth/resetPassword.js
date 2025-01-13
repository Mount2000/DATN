import { Button, Flex, Input, FormLabel, Text } from "@chakra-ui/react";
import { useCallback, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { apiResetPassword } from "../../apis/auth";
import { IoHome } from "react-icons/io5";
import Swal from 'sweetalert2';

function ResetPassword() {
  const params = useParams();
  const [invalidFields, setInvalidFields] = useState({password: "", "confirm password": "",});
  const payload = useRef({password: "", "confirm password": "",});
  let payloadList = ["password", "confirm password"]
  function validate () {
    let invalid = true
    const data = payload.current
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
  const handleResetPassword = useCallback(async ()=>{
    const data = payload.current
    const {token} = params
    console.log(data)
    const isValidate = validate()
    if(isValidate ){
      const result = await apiResetPassword(token, data)
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
          <>
          <FormLabel htmlFor={element}>{element.slice(0, 1).toUpperCase() + element.slice(1)}</FormLabel>
          <Input 
          key={index}
          w="100%"
          h="36px"
          p="0 4px"
          borderRadius="4px"
          placeholder={element}
          type={element === "password" || element === "confirm password" ? "password" : "text"}
          onChange={e => {payload.current[element] = e.target.value
          }}
          />
          {<Text>{invalidFields[element]}</Text>}
          </>
        )
      })}
      <Button
      cursor="pointer"
      onClick={handleResetPassword}
      >
        Confirm
      </Button>
      <Link to="/login">
        Login
      </Link>
    </Flex>
  )
}
export default ResetPassword