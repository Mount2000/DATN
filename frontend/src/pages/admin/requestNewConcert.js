import { useEffect, useState } from "react";
import { apiRequestNewEvent, apiSetApproveConcert } from "../../apis/admin";
import { Flex, Button, Image, Card, CardBody, Heading, Text, Divider, Grid, GridItem } from "@chakra-ui/react";
import Header from "../../components/header";
import { CiLocationOn } from "react-icons/ci";

function RequestNewEvent(){
    const [data, setData] = useState([])
    const [showMore, setShowMore] = useState({})
    console.log(data)
    async function fetchRequestNewEvent() {
        const result = await apiRequestNewEvent()
        console.log(result)
        if(result.success){
            setData(result.metadata)
        }
    }
    useEffect( () => {
        fetchRequestNewEvent()
    }, [])
    async function handleApprove(index, approveStatus) { // approveStatus: 1=accept 0=reject
        const concertId = data[index]._id
        const result = await apiSetApproveConcert({concertId, approveStatus})
        if(result.success){
            setData(prev => prev.filter(( element, _index) => _index !== index))
        }
    }

    return(
        <Flex
        w="100vw"
        flexDirection="column"
        >
            <Header />
            <Grid templateColumns='repeat(4, 1fr)' p="10px">            
                {data.map( (element, index) => {
                    return(
                    <GridItem m="20px 10px">
                        <Card 
                        textDecor="none"
                        w='280px' 
                        // h={showMore.index?"none":"400px"}
                        key={index}
                        maxW='sm'
                        borderRadius="4px"
                        borderColor="black"
                        overflow="hidden"
                        background="#dddddd"
                        >
                        <CardBody>
                            <Image
                            src={element.logo}
                            alt='image'
                            borderRadius='lg'
                            boxSize="280px"
                            />
                            <Flex
                            flexDirection="column"
                            p="8px"
                            alignItems="start"
                            
                            >
                                <Text>{element.title}</Text>
                                <Text>{"Event start sale: "+element.timeStartSale.split("T")[0]}</Text>
                                <Text>{"Event end sale: "+element.timeEndSale.split("T")[0]}</Text>
                                {showMore[index] && 
                                <Flex direction="column">
                                    <Flex>
                                        <CiLocationOn />
                                        <Text>{element.location}</Text>
                                    </Flex>
                                </Flex>
                                }
                                {showMore[index]?
                                <Button onClick={()=>setShowMore(prev=>({... prev, [index]: false}))}> Show less</Button>
                                :
                                <Button onClick={()=>setShowMore(prev=>({... prev, [index]: true}))}> Show more</Button>
                                }
                                <Flex justifyContent="space-around" w="100%">
                                    <Button onClick={()=>handleApprove(index, 1)} bg="green" w="100%"> Accept</Button>
                                    <Button onClick={()=>handleApprove(index, 0)} bg="red" w="100%"> Reject</Button>
                                </Flex>
                            </Flex>
                        </CardBody>
                        <Divider />
                        </Card>
                    </GridItem>
                    )
                    })}
            </ Grid>
        </Flex>
    )
}
export default RequestNewEvent