import Header from "../../components/header";
import { useState, useEffect } from "react";
import { apiGetUser, apiWithdrawAccount } from "../../apis/user";
import { apiAdd2FA, apiVerify2FA, apiChangePassword } from "../../apis/auth";
import { Box, Button, Flex, Text, Input, Image } from "@chakra-ui/react";
import Swal from "sweetalert2";

function AccountDetail(){
    const [ userInfor, setUserInfor ] = useState({})
    const [ isChangePassword, setIsChangePassword] = useState(false)
    const [ changePassword, setChangePassword] = useState({
        oldPassword: "",
        newPassword: "",
    })
    const [withdrawAddress, setWithdrawAddress] = useState("")
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [TFASecreate, setTFASecreate] = useState(null)
    const [TFACode, setTFACode] = useState({
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
    })
    console.log(TFACode)
    function handleSetWithdraw(value){
        const withdrawable = (userInfor.ballance - 0.005) > 0 ? (userInfor.ballance - 0.005) : 0
        const amount = value < withdrawable ? value : withdrawable
        setWithdrawAmount(amount)
    }
    async function handleWithdraw() {
        if(withdrawAmount > 0 && withdrawAddress != ""){
            const result = await apiWithdrawAccount({
                withdrawAddress,
                withdrawAmount
            })
            console.log(result)
            if(result.success){
                setUserInfor(
                    prev => ({
                        ... prev,
                        ballance: result.metadata,
                    })
                )
                setWithdrawAddress("")
                setWithdrawAmount("")
            }
        }
    }
    async function turnOn2FA() {
        const result = await apiAdd2FA()
        if(result.success){
            setTFASecreate(result.metadata)
        }
    }
    async function submit2FA() {
        let code = 0
        Object.values(TFACode).map((element, index)=>{
            if(!element){
                return false
            }
            code += element*10**(5-index)
            console.log(element, code)
        })
        const result = await apiVerify2FA({token: code, secret: TFASecreate.secret.base32})
        if(result.success){
            setTFASecreate(null)
            setUserInfor(prev =>({
                ...prev,
                is2FA: true,
            }))
        }
    }
    async function submitChangePassword() {
        if(!changePassword.oldPassword || !changePassword.newPassword){
            return false
        }
        const result = await apiChangePassword(changePassword)
        if(result.success){
            Swal.fire("success", "success")
            setIsChangePassword(false)
            setChangePassword({
                oldPassword: "",
                newPassword: "",
            })
        }
        else Swal.fire("error", "error")
    }
    async function fetchUser() {
        const result = await apiGetUser()
        const {metadata} = result
        if(result.success){
            setUserInfor( metadata)
        }
    }
    useEffect(()=>{
        fetchUser()
    }, [])

    return(
        <>
        <Flex
        w="100vw"
        minH="100vh"
        flexDirection="column"
        >
            <Header />
            <Flex
            minH="100%"
            flexDirection="column"
            m="20px auto"
            gap="4px"
            >
                <Flex
                w="50vw"
                minH="90vh"
                bg="black"
                border="2px solid"
                borderRadius="5px" 
                p="8px"
                direction="column"
                textColor="white"
                gap="20px"
                >
                    <Flex gap="8px">
                        <Box borderRadius="4px" border="1px solid white" p="12px 20px" w="25%">User name</Box>
                        <Box borderRadius="4px" border="1px solid white" p="12px 20px" w="100%">{userInfor.userName}</Box>
                    </Flex>
                    <Flex gap="8px">
                        <Box borderRadius="4px" border="1px solid white" p="12px 20px" w="25%">Email</Box>
                        <Box borderRadius="4px" border="1px solid white" p="12px 20px" w="100%">{userInfor.email}</Box>
                    </Flex>
                    <Flex gap="8px">
                        <Box borderRadius="4px" border="1px solid white" p="12px 20px" w="25%">Address</Box>
                        <Box borderRadius="4px" border="1px solid white" p="12px 20px" w="100%">{userInfor.address}</Box>
                    </Flex>
                    <Flex gap="8px">
                        <Box borderRadius="4px" border="1px solid white" p="12px 20px" w="25%">Ballance</Box>
                        <Flex borderRadius="4px" border="1px solid white" p="12px 20px" w="100%" justifyContent="space-between">
                            <Text>{userInfor.ballance}</Text>
                            <Text>POL</Text>
                        </Flex>
                    </Flex>
                    <Flex gap="8px">
                        <Input placeholder="Withdraw address" borderRadius="4px" border="1px solid white" p="12px 20px" w="70%" textColor="black" onChange={e => setWithdrawAddress(e.target.value)} value={withdrawAddress}/>
                        <Input placeholder="Amount" borderRadius="4px" border="1px solid white" p="12px 20px" w="30%" textColor="black" onChange={e => handleSetWithdraw(e.target.value)} value={withdrawAmount}/>
                        <Button borderRadius="4px" border="1px solid white" p="12px 20px" w="25%" onClick={handleWithdraw}>Withdraw</Button>
                    </Flex>
                    <Flex gap="8px">
                        <Box borderRadius="4px" border="1px solid white" p="12px 20px" w="25%">Ballance</Box>
                        <Flex borderRadius="4px" border="1px solid white" p="12px 20px" w="100%" justifyContent="space-between">
                            <Text>{userInfor.ballance}</Text>
                            <Text>POL</Text>
                        </Flex>
                    </Flex>
                    <Flex gap="8px">
                        <Box borderRadius="4px" border="1px solid white" p="12px 20px" w="25%">2FA</Box>
                        <Flex borderRadius="4px" border="1px solid white" p="12px 20px" w="100%" justifyContent="space-between">
                            <Text>{userInfor.is2FA?"On":"Off"}</Text>
                            {userInfor.is2FA?
                            <Button>Turn off</Button>
                            :
                            <Button onClick={turnOn2FA}>Turn on</Button>
                            }
                        </Flex>
                    </Flex>
                    <Button onClick={()=> setIsChangePassword(prev => !prev)}>Change password</Button>
                    {isChangePassword && 
                    <Flex direction="column" gap="8px" alignItems="center">
                        <Input textColor="black" type="password" placeholder="Old password" w="60%" p="4px" borderRadius="4px" onChange={e=>setChangePassword(prev => ({...prev, oldPassword:e.target.value}))}/>
                        <Input textColor="black" type="password" placeholder="New password" w="60%" p="4px" borderRadius="4px" onChange={e=>setChangePassword(prev => ({...prev, newPassword:e.target.value}))}/>
                        <Button onClick={submitChangePassword}>Submit</Button>
                    </ Flex>}
                    {TFASecreate &&
                        <Flex direction="column" alignItems="center" gap="4px">
                            <Image src={TFASecreate.qrcode} boxSize="200px"/>
                            <Text textColor="white">{TFASecreate.secret.base32}</Text>
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
                    }
                </Flex>
            </Flex>
        </Flex>
    </>
)
}

export default AccountDetail;