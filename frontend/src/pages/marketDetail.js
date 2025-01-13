import { useState, useEffect } from "react";
import { apiGetListedTicket } from "../apis/marketplace";
import { useParams } from "react-router-dom";
import Header from "../components/header";
import { Flex, Grid, GridItem, Card, CardBody, Image, Heading, Text, Divider, Button, Input, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import { apiBuyListTicket } from "../apis/marketplace";
import Swal from "sweetalert2";

export default function MarketDetail(){
    const [tickets, setTickets] = useState([])
    const [filterTickets, setFilterTickets] = useState([])
    const [ticketType, setTicketType] = useState([])
    const {concertId} = useParams()
    const [searchKey, setsearchKey] = useState("")
    const [filter, setFilter] = useState({
        price: 0, // 0: lowToHigt 1: highToLow
        type: null,
    })
    const handleSearch = ()=>{
        const data = tickets.filter(ticket => ((ticket.ticketName+ticket.ticketId).toUpperCase()).includes(searchKey.toUpperCase()))
        setFilterTickets(data)
    }
    async function fetchListedTicket() {
        const result = await apiGetListedTicket(concertId)
        if(result.success){
            setTickets(result.metadata.data)
            setFilterTickets(result.metadata.data.sort((a, b) => a.price - b.price))
            setTicketType(result.metadata.ticketType)
        }
    }
    async function handleBuy(index) {
        const ticketId = filterTickets[index].id
        const result = await apiBuyListTicket({ticketId})
        if(result.success){
            Swal.fire('Success!', 'success')
            const newTikcets = tickets.filter(ticket => ticket.id != ticketId)
            console.log(newTikcets)
            setTickets(newTikcets)
        }
        else Swal.fire('Error', 'error')
    }
    function filterTicket(){
        let data
        if(filter.type != null){
            data = tickets.filter(ticket=> ticket.typeTicketId == filter.type)
        }
        else{
            data = tickets
        }
        if(filter.price){
            data.sort((a, b) => b.price - a.price)
        }
        else{
            data.sort((a, b) => a.price - b.price)
        }
        setFilterTickets(data)
    }
    useEffect(()=>{
        fetchListedTicket()
    }, [])
    useEffect(()=>{
        filterTicket()
        console.log("1", tickets)
    }, [filter, tickets])
    console.log("2",tickets)
    return(
        <Flex
        w="100vw"
        minH="100vh"
        flexDirection="column"
        >
            <Header />
            <Flex
            minH="100vh"
            >
                <Flex
                w="20vw"
                minH="100%"
                bg="black"
                direction="column"
                >
                    <Flex
                    justifyContent="center"
                    alignItems="center"
                    w="90%"
                    m="5%"
                    bg="white"
                    borderRadius="5px"
                    p="0 8px"
                    >
                        <CiSearch />
                        <Input 
                        p="10px"
                        w="100%"
                        placeholder="Search tickets"
                        border="none"
                        onChange={e => setsearchKey(e.target.value)}
                        _focusVisible={{
                            outline: "none",
                            boxShadow: "none",
                            border: "none",
                        }}
                        />
                        <Button
                        bg="white"
                        border="none"
                        cursor="pointer"
                        type="text"
                        onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </Flex>

                    <Flex
                    direction="column"
                    gap="4px"
                    >
                        <Flex m="8px 0px">
                            <Menu>
                                <MenuButton 
                                as={Button} 
                                rightIcon={<FaChevronDown />}
                                bg="#eee"
                                textColor="black"
                                p="0 4px"
                                m="0px 12px 0px auto"
                                borderRadius="4px"
                                >
                                    {filter.price?"High to low" : "Low to high"}
                                </MenuButton>
                                <MenuList bg="white" borderRadius="4px" overflow="hidden">

                                        <MenuItem
                                        p="0px 4px"
                                        _hover={{
                                        bg:"#666"
                                        }}
                                        onClick={() => setFilter(prev => ({
                                        ... prev,
                                        price : 0,
                                        }))}
                                        >Low to high</MenuItem>
                                         <MenuItem
                                        p="0px 4px"
                                        _hover={{
                                        bg:"#666"
                                        }}
                                        onClick={() => setFilter(prev => ({
                                            ... prev,
                                            price : 1,
                                            }))}
                                        >High to low</MenuItem>

                                </MenuList>
                            </Menu>
                        </Flex>
                        {ticketType.map((type, index) => {
                            return(
                                <Flex m="0px 12px 0px 180px" gap="8px">
                                    <Input type="checkbox" checked={filter.type == index} onClick={() => setFilter(prev => ({
                                        ... prev,
                                        type : filter.type == index ? null: index,
                                    }))}/>
                                    <Text textColor="white">{type.ticketName}</Text>
                                </Flex>
                            )
                        })}
                    </Flex>
                </Flex>
                <Flex
                w="80vh"
                minH="100%"
                >
                    <Grid templateColumns='repeat(5, 1fr)' p="10px">  
                    {(filterTickets?.map((element, index) => {
                        return(
                            <GridItem
                            background="#dddddd"
                            m="20px 10px"
                            borderRadius="4px"
                            borderColor="black"
                            overflow="hidden"
                            key={index}
                            w="170px"
                            h="260px"
                            >
                                <Card >
                                <CardBody>
                                <Image
                                    src={element.concertLogo}
                                    alt='image'
                                    borderRadius='lg'
                                    boxSize="170px"
                                />
                                <Flex
                                flexDirection="column"
                                >
                                    <Heading 
                                    size='sm' 
                                    margin="0px"
                                    textAlign="center"
                                    >
                                        {element.ticketName + " - " + element.ticketId}
                                    </Heading>
                                    <Text pl="8px">{element.price + " POL"}</Text>
                                    <Button 
                                    w="50%"
                                    h="34px"
                                    mt="8px"
                                    ml="auto"
                                    borderRadius="4px"
                                    textColor="white"
                                    bg="blue"
                                    onClick={()=>handleBuy(index)}
                                    > Buy ticket </Button>
                                </Flex>
                                </CardBody>
                                <Divider />
                                </Card>
                            </GridItem>
                            )
                    })
                )
                }
                    </Grid>
                </Flex>
            </Flex>
        </Flex>
    )
}