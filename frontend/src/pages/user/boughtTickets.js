import Header from "../../components/header";
import { useState, useEffect } from "react";
import { apiGetBoughtTickets } from "../../apis/user";
import { Flex, Text, Image, Card, CardBody, Heading, Divider, Button, Input } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";

function BoughtTickets(){
    const [tickets, setTickets] = useState(null)
    const [data, setData] = useState(null)
    const [select, setSelect] = useState(0)
    const [choosedTicket, setChoosedTicket] = useState(null)
    console.log(data)
    async function fetchBoughtTickets() {
        const result = await apiGetBoughtTickets()
        const {metadata} = result
        if(metadata){
            setTickets(metadata)
            const notActivedTickets = metadata.filter(ticket => ticket.status==0)
            setData(notActivedTickets)
        }
    }
    function chosseTicket(index){
        setChoosedTicket(index)
    }
    function filterActive(){
        const filterTickets = tickets.filter(ticket => ticket.status==2)
        setData(filterTickets)
        setSelect(2)
    }
    function filterListed(){
        const filterTickets = tickets.filter(ticket => ticket.status==1)
        setData(filterTickets)
        setSelect(1)
    }
    function filterNotActive(){
        const filterTickets = tickets.filter(ticket => ticket.status==0)
        setData(filterTickets)
        setSelect(0)
    }
    useEffect(()=>{
        fetchBoughtTickets()
    }, [])
    return(
        <Flex
        w="100vw"
        h="100vh"
        flexDirection="column"
        >
            <Header />
            <Flex
            h="100%"
            direction="column"
            >
                <Flex
                w="100%"
                h="8%"
                bg="black"
                alignItems="center"
                pl="20px"
                gap="20px"
                >
                    <Text onClick={filterNotActive} cursor="pointer" textColor={select===0?"gray":"white"}>Not Active</Text>
                    <Text onClick={filterListed} cursor="pointer" textColor={select===1?"gray":"white"}>Listed</Text>
                    <Text onClick={filterActive} cursor="pointer" textColor={select===2?"gray":"white"}>Active</Text>
                </Flex>
                <Flex
                p="10px"
                gap="20px"
                >
                    
                    {   data?.map((ticket, index) =>{
                        return(
                            <Card 
                            textDecor="none"
                            key={index}
                            maxW='sm'
                            borderRadius="4px"
                            borderColor="black"
                            overflow="hidden"
                            background="#dddddd"
                            onClick={()=>chosseTicket(index)}
                            cursor="pointer"
                            >
                            <CardBody>
                                <Image
                                src={ticket.concertLogo}
                                alt='image'
                                borderRadius='lg'
                                boxSize="200px"
                                />
                                <Heading 
                                size='sm' 
                                margin="8px"
                                // textAlign="center"
                                >
                                    {"Event name: "+ticket.concertTitle}
                                </Heading>
                                <Flex m="4px" direction="column">
                                    <Text margin="0px 4px">{"Ticket type: "+ticket.ticketName}</Text>
                                    <Text margin="0px 4px">{"Ticket ID: "+ticket.ticketId}</Text>
                                </Flex>
                            </CardBody>
                            <Divider />
                            </Card>
                        )
                        })
                    }

                </Flex>
                    { choosedTicket != null && 
                    <Flex
                    w="100vw"
                    h="100vh"
                    position="absolute"
                    >
                        <Flex
                        w="70vw"
                        h="70vh"
                        top="15%"
                        right="15%"
                        p="10px"
                        bg="white"
                        position="absolute"
                        zIndex="1"
                        borderRadius="4px"
                        border="2px solid black"
                        direction="column"
                        >
                            <IoClose onClick={()=>setChoosedTicket(null)} cursor="pointer"/>
                            <Flex
                            p="10px">
                                <Image src={data[choosedTicket].concertLogo} boxSize="200px"/>
                                <Flex
                                m="0px 10px"
                                direction="column"
                                >
                                    <Text>
                                        {"Event name: " + data[choosedTicket].concertTitle}
                                    </Text>
                                    <Text>
                                        {"Ticket type: " + data[choosedTicket].ticketName}
                                    </Text>
                                    <Text>
                                        {"TicketID: " + data[choosedTicket].ticketId}
                                    </Text>
                                    {data[choosedTicket].status == 1 && 
                                    <Text>
                                        {"Listed price: " + data[choosedTicket].price}    
                                    </Text>}
                                    {data[choosedTicket].status == 0 && 
                                        <Flex>
                                            <Input border="1px solid black" type="number"/>
                                            <Button bg="blue">List</Button>
                                        </Flex>}
                                </Flex>
                            </Flex>
                            <Button>Active</Button>
                        </Flex>
                    </Flex>}
            </Flex>
        </ Flex>
)
}

export default BoughtTickets;