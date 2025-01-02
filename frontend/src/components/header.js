import { Flex, Text, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { useSelector } from 'react-redux'
import { Link } from "react-router-dom"
import { useEffect } from "react"
import { apiGetUser } from "../apis/user"
import { useDispatch } from 'react-redux'
import { login } from '../store/accountSlice'


function Header() {
    const dispatch = useDispatch()
    const account = useSelector((state) => state.account)

    async function fetchUser() {
        console.log("role", account)
        const result = await apiGetUser()
        if(result.success){
            dispatch(login({
                userName: result.metadata.userName,
                role: result.metadata.role
            }))
        }
    }
    useEffect(()=>{
        fetchUser()
    }, [])
    return(
        <>
            <Flex
            w="100vw"
            h="10%"
            bg="pink"
            alignItems="center"
            justifyContent="space-between"
            p="8px 20px"
            boxSizing="border-box"
            >
                {/* logo */}
                <Text as={Link}
                to="/"
                textDecor="none"
                >
                    Tickbit
                </Text>
                {/* search */}
                <Flex
                h="100%"
                w="60%"
                justifyContent="space-around"
                >
                    
                    {/* market place */}
                    <Flex as={Link}
                    to={"/marketPlace"}
                    h="100%"
                    textDecor="none"
                    border="2px solid white"
                    borderRadius="10px"
                    alignItems="center"
                    p="0px 4px"
                    >
                        Market place
                    </Flex>
                    {/* creat event */}
                    <Flex as={Link}
                    to={account.role ? "/RequestNewEvent" : "/createEvent"}
                    h="100%"
                    textDecor="none"
                    border="2px solid white"
                    borderRadius="10px"
                    alignItems="center"
                    p="0px 4px"
                    >
                        {account.role ? "Request new event" : "Create event"}
                    </Flex>
                    {account.userName ? 
                    <Menu>
                        <MenuButton as={Button}
                        borderRadius="5px"
                        border="2px solid white"
                        h="100%"
                        p="0px 20px"
                        bg="none"
                        cursor="pointer"
                        >
                        Account
                        </MenuButton>
                        <MenuList
                        borderRadius="5px"
                        border="2px solid gray"
                        zIndex="1"
                        bg="white"
                        >
                        <MenuItem as={Link} to="/AccountDetail" _hover={{bg:"#aaaaaa"}}>Profile</MenuItem>
                        <MenuItem as={Link} to="/MyTickets" _hover={{bg:"#aaaaaa"}}>My tickets</MenuItem>
                        <MenuItem as={Link} to="/MyConcerts" _hover={{bg:"#aaaaaa"}}>My concerts</MenuItem>
                        <MenuItem as={Link} to="/Logout" _hover={{bg:"#aaaaaa"}}>Log out</MenuItem>
                        </MenuList>
                    </Menu> :
                    <Link to="/login" alignContent="center"> 
                    <Text h="100%" alignContent="center" > Login </Text>
                    </Link>}
                </Flex>
            </Flex>
        </>
    )
}

export default Header