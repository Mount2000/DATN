import { Flex } from "@chakra-ui/react";
import Header from "../components/header";

export function Marketplace(){
    return(
        <Flex
        w="100vw"
        h="100vh"
        flexDirection="column"
        >
            <Header />
            <Flex
            h="100%"
            >
                <Flex
                w="20%"
                h="100%"
                bg="black"
                ></Flex>
                <Flex
                w="80%"
                h="100%"
                bg="red"
                ></Flex>
            </Flex>
        </ Flex>
    )
}