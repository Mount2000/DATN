import Header from "../../components/header";
import { useState, useEffect } from "react";
import { apiGetBoughtTickets, apiListTicket, apiActiveTicket, apiUnlistTicket } from "../../apis/user";
import { Flex, Text, Image, Card, CardBody, Heading, Divider, Button, Input, Grid, GridItem } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";

function BoughtTickets(){
    const [tickets, setTickets] = useState(null)
    const [data, setData] = useState(null)
    const [select, setSelect] = useState(0)
    const [choosedTicket, setChoosedTicket] = useState(null)
    const [listPrice, setListPrice] = useState()
    async function fetchBoughtTickets() {
        const result = await apiGetBoughtTickets()
        const {metadata} = result
        if(metadata){
            setTickets(metadata)
            const notActivedTickets = metadata.filter(ticket => ticket.status==0)
            setData(notActivedTickets)
            
        }
    }
    async function handleList() {
        const ticket = data[choosedTicket]
        if(!listPrice){
            Swal.fire('Oops!', "Should set price", 'error')
        }
        const requestData = {
            price: listPrice,
            ticketId: ticket.id,
        }
        const result = await apiListTicket(requestData)
        if(result.success){
            Swal.fire('Success!', result.message, 'success')
            const newTicket = tickets.map((element, index)=>{
                if(element.id == ticket.id){
                    return {
                        ... element,
                        price: listPrice,
                        status: 1,
                    }
                }
                else return element
            })
            setTickets(newTicket)
            setData(newTicket.filter(ticket => ticket.status==0))
            setChoosedTicket(null)
            setSelect(0)
        }
        else{
            Swal.fire('Oops!', result.message, 'error')
        }
    }
    async function handleActive() {
        const ticket = data[choosedTicket]
        const result = await apiActiveTicket({ticketId: ticket.id})
        if(result.success){
            Swal.fire('Success!', result.message, 'success')
            const newTicket = tickets.map((element, index)=>{
                if(element.id == ticket.id){
                    return {
                        ... element,
                        status: 2,
                        qrcode: result.metadata
                    }
                }
                else return element
            })
            setTickets(newTicket)
            setData(newTicket.filter(ticket => ticket.status==0))
            setChoosedTicket(null)
            setSelect(0)
        }
        else{
            Swal.fire('Oops!', result.message, 'error')
        }
    }
    async function handleUnlist() {
        const ticket = data[choosedTicket]
        const result = await apiUnlistTicket({ticketId: ticket.id})
        if(result.success){
            Swal.fire('Success!', result.message, 'success')
            const newTicket = tickets.map((element, index)=>{
                if(element.id == ticket.id){
                    return {
                        ... element,
                        status: 0,
                        price: 0,
                    }
                }
                else return element
            })
            setTickets(newTicket)
            setData(newTicket.filter(ticket => ticket.status==0))
            setChoosedTicket(null)
            setSelect(0)
        }
        else{
            Swal.fire('Oops!', result.message, 'error')
        }
    }
    function filterActive(){
        const filterTickets = tickets?.filter(ticket => ticket.status==2)
        setData(filterTickets)
        setSelect(2)
    }
    function filterListed(){
        const filterTickets = tickets?.filter(ticket => ticket.status==1)
        setData(filterTickets)
        setSelect(1)
    }
    function filterNotActive(){
        const filterTickets = tickets?.filter(ticket => ticket.status==0)
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
                <Grid templateColumns='repeat(4, 1fr)' p="10px">  
                    
                    {   data?.map((ticket, index) =>{
                        return(
                            <GridItem
                            background="#dddddd"
                            m="20px 10px"
                            borderRadius="4px"
                            borderColor="black"
                            overflow="hidden"
                            key={index}
                            w="280px"
                            onClick={()=>setChoosedTicket(index)}
                            cursor="pointer"
                            > 
                                <Card >
                                <CardBody>
                                    <Image
                                    src={ticket.concertLogo}
                                    alt='image'
                                    borderRadius='lg'
                                    boxSize="280px"
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
                            </GridItem>
                        )
                        })
                    }

                </Grid>
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
                            {select == 2 ? 
                            <Image src={data[choosedTicket].qrcode} boxSize="300px"/>
                            :
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
                                    {data[choosedTicket]?.status == 1 && 
                                    <Text>
                                        {"Listed price: " + data[choosedTicket].price}    
                                    </Text>}
                                    {data[choosedTicket].status == 0 && 
                                        <Flex gap="8px">
                                            <Input border="1px solid black" type="number" placeholder="List price" onChange={e => setListPrice(e.target.value)}/>
                                            <Button p="0px 40px" bg="black" textColor="white" onClick={handleList}>List</Button>
                                        </Flex>}
                                </Flex>
                            </Flex>
                            }
                            {data[choosedTicket].status == 0 && <Button onClick={handleActive} bg="Black" textColor="white">Active</Button>}
                            {data[choosedTicket].status == 1 && <Button onClick={handleUnlist} bg="Black" textColor="white">Unlist</Button>}
                        </Flex>
                    </Flex>}
            </Flex>
            
        </ Flex>
)
}

export default BoughtTickets;