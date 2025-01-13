import Header from "../../components/header";
import { useState, useEffect } from "react";
import { apiGetCreatedConcert, apiWithdrawConcert } from "../../apis/user";
import { Button, Flex, Text, Card, CardBody, Heading, Divider, Image, Grid, GridItem, Input } from "@chakra-ui/react";
import { dateToSecond } from "../../utils/helper";
import { IoClose } from "react-icons/io5";
import Swal from 'sweetalert2';

function CreatedConcert(){
    const [choosedConcert, setChoosedConcert] = useState(null)
    const [concerts, setConcerts] = useState(null)
    const [data, setData] = useState(null)
    const [select, setSelect] = useState(0)
    async function fetchCreatedConcert() {
        const result = await apiGetCreatedConcert()
        const {metadata} = result
        if(metadata){
            setConcerts(metadata)
            setData(metadata)
        }
        setSelect(0)
        setChoosedConcert(null)
    }
    useEffect(()=>{
        fetchCreatedConcert()
    }, [])
    function filterAll(){
        setData(concerts)
        setSelect(0)
    }
    function filterComplete(){
        const filterConcerts = concerts.filter(concert => concert.status == 1 && dateToSecond(concert.timeEndSale) < Date.now() && !concert.isWithdraw)
        setData(filterConcerts)
        setSelect(1)
    }
    function filterWithdrawn(){
        const filterConcerts = concerts.filter(concert => concert.status == 1 && dateToSecond(concert.timeEndSale) < Date.now() && concert.isWithdraw)
        setData(filterConcerts)
        setSelect(2)
    }
    function filterSelling(){
        const filterConcerts = concerts.filter(concert => concert.status == 1 && dateToSecond(concert.timeEndSale) > Date.now())
        setData(filterConcerts)
        setSelect(3)
    }
    function filterPending(){
        const filterConcerts = concerts.filter(concert => concert.status == 2)
        setData(filterConcerts)
        setSelect(4)
    }
    function filterReject(){
        const filterConcerts = concerts.filter(concert => concert.status == 0)
        setData(filterConcerts)
        setSelect(5)
    }
    async function handleWithdraw(){
        const concertId = data[choosedConcert]._id
        const result = await apiWithdrawConcert(concertId)
        if(result.success){
            Swal.fire('Success!', 'success')
            await fetchCreatedConcert()
        }
        else{
            Swal.fire('Oops!', 'error')
        }
    }
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
                <Text onClick={filterAll} cursor="pointer" textColor={select===0?"gray":"white"}>All</Text>
                <Text onClick={filterComplete} cursor="pointer" textColor={select===1?"gray":"white"}>Completed</Text>
                <Text onClick={filterWithdrawn} cursor="pointer" textColor={select===2?"gray":"white"}>Withdrawn</Text>
                <Text onClick={filterSelling} cursor="pointer" textColor={select===3?"gray":"white"}>Selling</Text>
                <Text onClick={filterPending} cursor="pointer" textColor={select===4?"gray":"white"}>Pending</Text>
                <Text onClick={filterReject} cursor="pointer" textColor={select===5?"gray":"white"}>Reject</Text>
            </Flex>
            <Grid templateColumns='repeat(4, 1fr)' p="10px">  
                {   data?.map((concert, index) =>{
                    return(
                        <GridItem
                        background="#dddddd"
                        m="20px 10px"
                        borderRadius="4px"
                        borderColor="black"
                        overflow="hidden"
                        key={index}
                        w="280px"
                        onClick={()=>setChoosedConcert(index)}
                        cursor="pointer"
                        >    
                            <Card >
                            <CardBody>
                                <Image
                                src={concert.logo}
                                alt='image'
                                borderRadius='lg'
                                boxSize="280px"
                                />
                                <Heading 
                                size='sm' 
                                margin="8px"
                                textAlign="center"
                                >
                                    {concert.title}
                                </Heading>
                            </CardBody>
                            <Divider />
                            </Card>
                        </GridItem>
                    )
                    })
                }
            </Grid>
            { choosedConcert != null && 
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
                    <IoClose onClick={()=>setChoosedConcert(null)} cursor="pointer"/>
                    <Flex
                    p="10px">
                        <Image src={data[choosedConcert].logo} boxSize="200px"/>
                        <Flex
                        m="0px 10px"
                        direction="column"
                        >
                            <Text>
                                {"Event name: " + data[choosedConcert].title}
                            </Text>
                            <Text>Number of tickets sold</Text>
                            {
                                data[choosedConcert].tickets.map(ticket=>{
                                    console.log(ticket)
                                    return(
                                        <Text>{ticket.ticketName + ": " + ticket.sold + " Tickets"}</Text>
                                    )
                                })
                            }
                            {select == 1 && <Text>
                                {"Sale amount: " + data[choosedConcert].balance}
                            </Text>}
                        </Flex>
                    </Flex>
                        {select == 1 && 
                        <Button bg="#aaa" h="40px" onClick={handleWithdraw}>
                            withdraw
                        </Button>}
                </Flex>
            </Flex>}
        </Flex>
    </ Flex>
)
}

export default CreatedConcert;