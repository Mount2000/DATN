import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiSearchConcert } from "../../apis/concert";

function SearchConcert(){
    const [concerts, setConcerts] = useState([])
    const [searchParams, setSearchParams] = useSearchParams();
    const searchKey = searchParams.get("search")
    const searchConcert = async () => {
        const result = await apiSearchConcert({searchKey})
        if(result.success == true){
            setConcerts(result.metadata)
        }
    }
    useEffect(()=>{
        searchConcert()
    }, [])
    return(
        <>
        {searchKey}
        </>
    )
}

export default SearchConcert