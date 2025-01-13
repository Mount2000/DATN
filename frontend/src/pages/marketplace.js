import { Flex, Card, CardBody, Image, Heading, Text, Divider, Grid, GridItem, Button, Input } from "@chakra-ui/react";
import { FaCalendarCheck } from "react-icons/fa";
import Header from "../components/header";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGetListedConcerts } from "../apis/marketplace";
import { CiSearch } from "react-icons/ci";
import Footer from "../components/footer";

export function Marketplace(){
    const concertType = ["All", "Music", "Sport", "Art", "Theater & Comedy", "Workshop", "Other"]
    const [concerts, setConcerts] = useState([])
    const [filterConcerts, setFilterConcerts] = useState([])
    const [select, setSelect] = useState(0)
    const [searchKey, setsearchKey] = useState("")
    const handleSearch = ()=>{
        const data = concerts.filter(concert => (concert.title.toUpperCase()).includes(searchKey.toUpperCase()))
        setFilterConcerts(data)
        setSelect(0)
    }
    async function fetchListedConcerts() {
        const result = await apiGetListedConcerts()
        if(result.success){
            setConcerts(result.metadata)
            setFilterConcerts(result.metadata)
        }
    }
    function selectType(index){
        if(index != 0){
            const data = concerts.filter(concert => concert.type == index)
            setFilterConcerts(data)
        }
        else{
            setFilterConcerts(concerts)
        }
        setSelect(index)
    }
    useEffect(()=>{
        fetchListedConcerts()
    }, [])
    return(
        <Flex
        w="100vw"
        minH="100vh"
        flexDirection="column"
        >
            <Header />
            <Flex
            minH="90vh"
            direction="column"
            >
            <Flex
            w="100%"
            h="10%"
            bg="black"
            alignItems="center"
            pl="20px"
            gap="20px"
            >
                {concertType.map((type, index) =>{
                    return(
                        <Text onClick={()=>selectType(index)} cursor="pointer" textColor={select==index?"gray":"white"}>{type}</Text>
                    )
                })}
                <Flex
                justifyContent="center"
                alignItems="center"
                bg="white"
                borderRadius="5px"
                p="0 8px"
                ml="auto"
                >
                    <CiSearch />
                    <Input 
                    p="10px"
                    w="100%"
                    placeholder="Search event"
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
            </Flex>
            
            <Grid templateColumns='repeat(4, 1fr)' p="10px">  
            {(filterConcerts.length != 0 ? filterConcerts.map((element, index) => {
                return(
                    <GridItem
                    as = {Link}
                    to = {`/marketdetail/` + element._id}
                    background="#dddddd"
                    m="20px 10px"
                    borderRadius="4px"
                    borderColor="black"
                    overflow="hidden"
                    key={index}
                    w="280px"
                    >
                        <Card >
                        <CardBody>
                        <Image
                            src={element.logo}
                            alt='image'
                            borderRadius='lg'
                            boxSize="280px"
                        />
                        <Flex
                        flexDirection="column"
                        >
                            <Heading 
                            size='sm' 
                            margin="0px"
                            textAlign="center"
                            >
                                {element.title}
                            </Heading>
                            <Flex m="4px">
                                <FaCalendarCheck/>
                                <Text margin="0px 4px">{element.timeStartSale.split("T")[0]}</Text>
                            </Flex>
                        </Flex>
                        </CardBody>
                        <Divider />
                        </Card>
                    </GridItem>
                    )
            })
            :
                <Text m="10px" fontSize="20px" > Do not have any event!</Text>
        )
        }
            </Grid>
            </Flex>
            <Footer />
        </Flex>
    )
}