import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { apiVerifyEmailRegister } from "../../apis/auth";

function VerifyEmailRegister(){
    const params = useParams();
    const [success, setSuccess] = useState()
    const fetchVerify = async () => {
        const token = params.token
        console.log("token",token)
        const result = await apiVerifyEmailRegister(token)
        console.log(result)
        if(result.success){
            setSuccess(true)
            console.log("success")
        }
        else{
            setSuccess(false)
            console.log("false")
        }
    }
    useEffect( () => {
        fetchVerify()
    }, [params]) 
    return(success !== null && <>
        <Text>
            {success ? "verify success please login again" : "something went wrong"}
        </Text>
        <Link to="/">
            <IoHome/>
        </Link>
    </>)
}

export default VerifyEmailRegister