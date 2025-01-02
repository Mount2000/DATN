import Header from "../../components/header";
import { useState, useEffect } from "react";
import { apiGetCreatedConcert } from "../../apis/user";
import { Button, Flex, Text, Card, CardBody, Heading, Divider, Image } from "@chakra-ui/react";
import { dateToSecond } from "../../utils/helper";

function CreatedConcert(){
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
    }
    useEffect(()=>{
        fetchCreatedConcert()
    }, [])
    function filterAll(){
        setData(concerts)
        setSelect(0)
    }
    function filterComplete(){
        const filterConcerts = concerts.filter(concert => concert.status == 1 && dateToSecond(concert.timeEndSale) < Date.now())
        setData(filterConcerts)
        setSelect(1)
    }
    function filterSelling(){
        const filterConcerts = concerts.filter(concert => concert.status == 1 && dateToSecond(concert.timeEndSale) > Date.now())
        setData(filterConcerts)
        setSelect(2)
    }
    function filterPending(){
        const filterConcerts = concerts.filter(concert => concert.status == 2)
        setData(filterConcerts)
        setSelect(3)
    }
    function filterReject(){
        const filterConcerts = concerts.filter(concert => concert.status == 0)
        setData(filterConcerts)
        setSelect(4)
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
                <Text onClick={filterSelling} cursor="pointer" textColor={select===2?"gray":"white"}>Selling</Text>
                <Text onClick={filterPending} cursor="pointer" textColor={select===3?"gray":"white"}>Pending</Text>
                <Text onClick={filterReject} cursor="pointer" textColor={select===4?"gray":"white"}>Reject</Text>
            </Flex>
            <Flex
            p="10px"
            gap="20px"
            h="100%"
            >
                
                {   data?.map((concert, index) =>{
                    return(
                        <Card 
                        textDecor="none"
                        key={index}
                        maxW='sm'
                        h="240px"
                        borderRadius="4px"
                        borderColor="black"
                        overflow="hidden"
                        background="#dddddd"
                        >
                        <CardBody>
                            <Image
                            src={concert.logo}
                            alt='image'
                            borderRadius='lg'
                            boxSize="200px"
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
                    )
                    })
                }
            </Flex>
        </Flex>
    </ Flex>
)
}

export default CreatedConcert;