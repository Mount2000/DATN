import Header from "../../components/header";
import { useState, useEffect } from "react";
import { apiGetUser } from "../../apis/user";
import { Flex, Text } from "@chakra-ui/react";
import { camelToSpace } from "../../utils/helper";

function AccountDetail(){
    const [ userInfor, setUserInfor ] = useState({
        userName: "",
        email: "",
        address: "",
        ballance: "",
    })
    async function fetchUser() {
        const result = await apiGetUser()
        const {metadata} = result
        if(result.success){
            setUserInfor( {
                userName: metadata.userName,
                email: metadata.email,
                address: metadata.address,
                ballance: metadata.ballance,
            })
        }
    }
    useEffect(()=>{
        fetchUser()
    }, [])

    return(
        <>
        <Flex
        w="100vw"
        h="100vh"
        flexDirection="column"
        >
            <Header />
            <Flex
            h="100%"
            flexDirection="column"
            m="20px auto"
            gap="4px"
            >
                {
                Object.keys(userInfor).map( (element, index) => {
                    return(
                        <Flex key={index}>
                            <Text>
                                {camelToSpace(element) + ": " + userInfor[element]}
                            </Text>
                        </Flex>
                    )
                })
            }
            </Flex>
        </Flex>
    </>
)
}

export default AccountDetail;