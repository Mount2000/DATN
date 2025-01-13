import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useCallback, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { login } from '../../store/accountSlice'
import { apiVerify2FALogin } from "../../apis/auth";
import { IoHome } from "react-icons/io5";

function Verify2FALogin() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const [TFACode, setTFACode] = useState({
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
    })
    async function submit2FA() {
            let code = 0
            Object.values(TFACode).map((element, index)=>{
                if(!element){
                    return false
                }
                code += element*10**(5-index)
                console.log(element, code)
            })
            const result = await apiVerify2FALogin({code, token: params.token})
            if(result.success){
                navigate("/")
                dispatch(login({
                    userName: result.metaData.userName,
                    role: result.metaData.role,
                }))
            }
        }
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
        <Flex direction="column" alignItems="center" gap="8px">
            <Text>Submit your goodle authenticator</Text>
            <Flex gap="4px">
                {Object.keys(TFACode).map(element => {
                    return <Input
                            textColor="black"
                            type="number"
                            boxSize="40px"
                            borderRadius="4px" 
                            alignItems="center"
                            justifyItems="center"
                            value={TFACode[element]}
                            onChange={e => setTFACode(prev => ({
                                ...prev,
                                [element]:e.target.value%10}))}/>
                })}
            </Flex>
            <Button onClick={submit2FA}>Submit</Button>
        </Flex>
    </Flex>
  )
}
export default Verify2FALogin