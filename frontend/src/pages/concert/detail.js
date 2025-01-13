import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGetConcertDetail, apiBuyTicket } from "../../apis/concert";
import { apiGetBoughtConcert } from "../../apis/user";
import Header from "../../components/header";
import { useSelector } from "react-redux";
import { FaCalendarCheck } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { SiHiveBlockchain } from "react-icons/si";
import { Flex, Image, Text, Heading, Button } from "@chakra-ui/react";
import { dateToSecond } from "../../utils/helper";
import Swal from 'sweetalert2'

function ConcertDetail(){
    const navigate = useNavigate()
    const account = useSelector((state) => state.account)
    const params = useParams()
    const [ticketsInCart, setTicketsInCart] = useState(0)
    const [cart, setCart] = useState(null)
    const [data, setData] = useState(null)
    const {concertId} = params
    async function fetchConcertDetail() {
        const result = await apiGetConcertDetail(concertId)
        if(result.success){
            setData(result.metadata)
            for (let index = 0; index < result.metadata.tickets.length; index++) {
                setCart(prev => ({...prev, [index]: 0})) 
            }
        }
    }
    async function fetchBoughtTickets() {
        const result = await apiGetBoughtConcert(concertId)
        const {metadata} = result
        setTicketsInCart(metadata.length)
        if(metadata){
        }
    }
    function addTicket(index){
        if(ticketsInCart < data.maxTicketPurchase){
            setCart(prev => ({...prev, [index]: ++cart[index]}))
            setTicketsInCart(prev => ++prev)
        }
    }
    function minusTicket(index){
        if(ticketsInCart > 0 && cart[index] > 0){
            setCart(prev => ({...prev, [index]: --cart[index]}))
            setTicketsInCart(prev => --prev)
        }
    }
    async function buyTickets(){
        if(ticketsInCart > 0){
            const result = await apiBuyTicket(concertId, {cart})
            if(result.success){
                navigate("/MyTickets")
            }
        }
    }
    useEffect(() => {
        fetchConcertDetail()
        fetchBoughtTickets()
    }, [])
    console.log((dateToSecond(data.timeStartSale) - 1000*60*60*24), Date.now(), dateToSecond(data.timeEndSale), account.userName)
    return (
        <Flex
        w="100vw"
        minH="100vh"
        flexDirection="column"
        >
            <Header />
            {data &&
            <>
                <Flex
                position="relative"
                m="6% 12px">
                    <Image src={data.logo} boxSize="400px"/> 
                    <Flex
                    direction="column"
                    m=" 8px"
                    >
                        <Heading 
                        fontSize="60px"
                        m="8px 0px"
                        >
                            {data.title}
                        </Heading>
                        <Flex>
                            <SiHiveBlockchain />
                            <Text m="0px 4px"> {"Contract address: " + data.address} </Text>
                        </Flex>
                        <Flex>
                            <FaCalendarCheck />
                            <Text m="0px 4px"> {"Time start event: "+data.timeStartConcert.split("T")[0]} </Text>
                        </Flex>
                        <Flex>
                            <FaLocationDot />
                            <Text m="0px 4px"> {"Location: "+data.location} </Text>
                        </Flex>
                        <Flex>
                            <Text m="0px 2px"> Description: </Text>
                            <Text m="0px 4px"> {data.description} </Text>
                        </Flex>

                    </Flex>
                </Flex>
                <Flex
                minH="10px"
                borderRadius="5px"
                background="black"
                textColor="white"
                flexDirection="column"
                overflow="hidden"
                >
                    <Text m="10px 8px"> Ticket infor</Text>
                    {data.tickets.map((ticket, index) =>{
                        // console.log("cart", cart)
                        return(
                            <Flex
                            justifyContent="space-between"
                            p="10px 8px"
                            bgColor={index%2 ? "#777777" : "#666666"}
                            >
                                <Text>{ticket.ticketName}</Text>
                                <Flex>
                                    <Text mr="8px">{"Price: " +ticket.price}</Text>
                                    <Flex mr="8px" alignItems="center">
                                        <Button 
                                        boxSize="28px"
                                        cursor="pointer"
                                        onClick={() => minusTicket(index)}
                                        bg="#aaa"
                                        >-</Button>
                                        <Text m="auto 4px" boxSize="28px" textAlign="center">{cart[index]}</Text>
                                        <Button 
                                        boxSize="28px"
                                        cursor="pointer"
                                        onClick={() => addTicket(index)}
                                        bg="#aaa"
                                        >+</Button>
                                    </Flex>
                                </Flex>
                            </ Flex>
                        )
                    })}
                    {
                    (dateToSecond(data.timeStartSale) <= Date.now() && Date.now() <= dateToSecond(data.timeEndSale) && account.userName) &&
                    <Button
                    w="100px"
                    h="40px"
                    m="0px auto"
                    cursor="pointer"
                    onClick={buyTickets}
                    >Buy now</Button>}
                </Flex>
            </>
            
            }
        </ Flex>
    )
}

export default ConcertDetail