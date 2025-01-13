import {Box, Flex, Heading, Text} from "@chakra-ui/react"
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaTiktok } from "react-icons/fa";

function Footer() {
    return(
        <>
            <Flex
            w="100vw"
            bg="black"
            textColor="white"
            p="20px 40px"
            justifyContent="space-between"
            >
                <Flex
                direction="column"
                >
                    <Heading fontSize="60px">TICKBIT</Heading>
                    <Flex fontSize="26px" gap="6px" p="8px">
                        <FaFacebook />
                        <FaInstagram />
                        <FaYoutube />
                        <FaTelegram />
                        <FaTiktok />
                    </Flex>
                </Flex>

                <Flex direction="column" pt="18.5px" gap="12px">
                    <Box>
                        <Text fontWeight="bold">For Customer</Text>
                        <Text>Customer terms of use</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold">For Organizer</Text>
                        <Text>Organizer terms of use</Text>
                    </Box>
                </Flex>

                <Flex direction="column" pt="18.5px" gap="12px">
                    <Box>
                        <Text fontWeight="bold">Email</Text>
                        <Text>Tickbitticket@gmail.com</Text>
                    </Box>
                    <Box>
                        <Text fontWeight="bold">Hotline</Text>
                        <Text>19001900</Text>
                    </Box>
                </Flex>
                
            </Flex>
        </>
    )
}

export default Footer