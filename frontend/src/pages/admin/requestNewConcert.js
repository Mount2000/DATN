import { useEffect, useState } from "react";
import { apiRequestNewEvent, apiSetApproveConcert } from "../../apis/admin";
import { Flex, Table, Thead, Th, Tr, Td, TableContainer, Tbody, Button, Image } from "@chakra-ui/react";
import Header from "../../components/header";

function RequestNewEvent(){
    const [data, setData] = useState([])
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
    async function handleApprove(concertId, approveStatus, index) {
        const result = await apiSetApproveConcert({concertId, approveStatus})
        if(result.success){
            setData(prev => prev.filter(( element, _index) => _index !== index))
        }
    }

    return(
        <>
            <Header />
            <Flex
            w="40vw"
            h="80vh"
            position="absolute"
            top="10%"
            alignItems="flex-start"
            flexDirection="column"
            >
                
                    <Flex>
                        <TableContainer>
                        <Table variant="simple" colorScheme="purple" textAlign="center">
                            <Thead>
                            <Tr>
                                <Th>Logo</Th>
                                <Th>Tittle</Th>
                                <Th>Owner</Th>
                                <Th>isOffline</Th>
                                <Th>type</Th>
                                <Th>location</Th>
                                <Th>timeStartSale</Th>
                                <Th>timeEndSale</Th>
                                <Th>timeStartConcert</Th>
                                <Th>totalTicketSupply</Th>
                                <Th>maxTicketPurchase</Th>
                            </Tr>
                            </Thead>
                            <Tbody>
                            {data.map( (element, index) => {
                                return(
                                <Tr key={element._id} bg={index%2?"#eeeeee":"#ffffff"}>
                                <Image 
                                    src={element.logo} 
                                    alt="Image" 
                                    boxSize="30px" 
                                    objectFit="cover" 
                                    borderRadius="lg"
                                />
                                <Td>{element.title}</Td>
                                <Td>{element.owner}</Td>
                                <Td>{element.isOffline ? "true" : "false"}</Td>
                                <Td>{element.type}</Td>
                                <Td>{element.location}</Td>
                                <Td>{element.timeStartSale}</Td>
                                <Td>{element.timeEndSale}</Td>
                                <Td>{element.timeStartConcert}</Td>
                                <Td>{element.totalTicketSupply}</Td>
                                <Td>{element.maxTicketPurchase}</Td>
                                <Button onClick={() => handleApprove(element._id, 1, index)} cursor="pointer"> Approve </Button>
                                <Button onClick={() => handleApprove(element._id, 0, index)} cursor="pointer"> Reject </Button>        
                                </Tr>
                            )
                            })}
                            </Tbody>
                        </Table>
                        </TableContainer>
                    </Flex>
                    
            </Flex>
        </>
    )
}
export default RequestNewEvent