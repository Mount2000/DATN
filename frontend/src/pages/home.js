import {CardBody, Card, Text, Heading, Divider, Image, Flex, Icon, Input, Button} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { apiGetAllConcerts } from "../apis/concert"
import {CiSearch} from "react-icons/ci"
import { FaCalendarCheck } from "react-icons/fa";
import Header from "../components/header"
import Footer from "../components/footer"

function Home(){
    const navigate = useNavigate()
    const concertType = ["All", "Music", "Sport", "Art", "Theater & Comedy", "Workshop", "Other"]
    const [concerts, setConcerts] = useState([])
    const [filterConcerts, setFilterConcerts] = useState([])
    const [select, setSelect] = useState(0)
    const [searchKey, setsearchKey] = useState("")
    const handleSearch = ()=>{
        navigate("/concert?search=" + searchKey)
    }
    async function fetchConcertsData() {
        const result = await apiGetAllConcerts()
        if(result.success){
            setConcerts(result.metadata)
            setFilterConcerts(result.metadata.filter(concert => concert.type == 0))
        }
    }
    useEffect( () => {
        fetchConcertsData()
    }, [])
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
    return(
        <>
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
                        <Icon as={CiSearch}/>
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
                {/* search */}
                
                <Flex
                gap="20px"
                h="100%"
                >
                {(filterConcerts ? filterConcerts : concerts).map((element, index) => {
                    return(
                        <Card 
                        as = {Link}
                        to = {`/concert/` + element._id}
                        textDecor="none"
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
                            boxSize="200px"
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
                      </Card>)
                })}
                </Flex>
                </Flex>
                <Footer />
            </Flex>
        </>
    )
}

export default Home