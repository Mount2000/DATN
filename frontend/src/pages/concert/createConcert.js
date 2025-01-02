import { Flex, Button, Input, FormControl, FormLabel, Image, Text } from '@chakra-ui/react'
import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { IoHome } from 'react-icons/io5'
import { apiCreateConcert } from '../../apis/concert'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Header from '../../components/header'
import Swal from 'sweetalert2'

function CreateEvent(){
  const toGMT = (date) => {
    if (!date) return null;
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      )
    );
  };
    const today = new Date();
    const [file, setFile] = useState(null);
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      console.log(selectedFile)
      setFile(selectedFile); // Save the file in state
    };
    // const navigate = useNavigate()
    const account = useSelector((state) => state.account)
    const [tickets, setTickets] = useState([{name:"", price: "", supply: ""}])
    const [invalidFields, setInvalidFields] = useState({
      title: "",
      ifOffline: "",
      logo: "",
      type: "",
      location: "",
      description: "",
      timeStartSale: "",
      timeEndSale: "",
      timeStartConcert: "",
      maxTicketPurchase: "",
      tickets: "",
    });
    const [concertInfor, setConcertInfor] = useState({
        title: "",
        ifOffline: true,
        type: "",
        location: "",
        description: "",
        timeStartSale: "",
        timeEndSale: "",
        maxTicketPurchase: 50,
    })
    function validate () {
      let invalid = true
      Object.keys(concertInfor).map( (element) => {
        if(!concertInfor[element]){
          invalid = false
          setInvalidFields(prev => ({
            ...prev,
            [element]: `miss ` + element + ` infor`}))
        }
        else{
          setInvalidFields(prev => ({
            ...prev,
            [element]: ""}))
        }
      })
      if(!tickets){
        invalid = false
        setInvalidFields(prev => ({
          ...prev,
          tickets: `miss tickets infor`}))
      }
      else{
        setInvalidFields(prev => ({
          ...prev,
          tickets: ""}))
      }
      if(!file){
        invalid = false
        setInvalidFields(prev => ({
          ...prev,
          logo: `miss logo`}))
      }
      else{
        setInvalidFields(prev => ({
          ...prev,
          logo: ""}))
      }
      return invalid;
    }
    function addTicket(){
      setTickets(prev => ([... prev, {name:"", price:"", supply: ""}]))
    }
    function delTicket(index){
      setTickets(prev => prev.filter((_ , i) => i !=index))
    }
    const handleCreateEvent= useCallback(async ()=>{
        const isValid = validate()
        if(isValid){
          const formData = new FormData();
          Object.keys(concertInfor).map((element) => {
            formData.append(String(element), concertInfor[element])
          })
          formData.append("tickets", JSON.stringify(tickets));
          formData.append("file", file);
          console.log(formData)
          const result = await apiCreateConcert(formData)
          if(result.success){
              Swal.fire('Success!', result.message, 'success')
          }
          else{
            Swal.fire('Oops!', result.message, 'error')
          }
        }
    })
        return account ? 
        (<>
        <Header />
        <Flex
        w="30vw"
        h="80vh"
        position="absolute"
        top="10%"
        right="35%"
        bg="red"
        alignItems="center"
        flexDirection="column"
        >
          <Link to="/">
            <IoHome/>
          </Link>
          <Input 
          w="80%"
          h="36px"
          placeholder="title"
          onChange={e => setConcertInfor(prev => ({
            ... prev,
            title: e.target.value,
          }))}
          />
          <Input 
          w="80%"
          h="36px"
          placeholder="type"
          onChange={e => setConcertInfor(prev => ({
            ... prev,
            type: e.target.value,
          }))}
          />
          <Flex flexDirection="column" alignItems="center" gap={4}>
            <Image
              src={file?.path}
              alt="Uploaded Preview"
              boxSize="150px"
              objectFit="cover"
              borderRadius="md"
              shadow="md"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="file-input"
            />
          </Flex>
          <Input 
          w="80%"
          h="36px"
          placeholder="location"
          onChange={e => setConcertInfor(prev => ({
            ... prev,
            location: e.target.value,
          }))}
          />
          <Input 
          w="80%"
          h="36px"
          placeholder="description"
          onChange={e => setConcertInfor(prev => ({
            ... prev,
            description: e.target.value,
          }))}
          />
          <FormControl>
            <FormLabel htmlFor="date">start sale</FormLabel>
            <DatePicker
            selected={concertInfor.timeStartSale}
            onChange={date =>{
                setConcertInfor( prev =>({
                    ... prev,
                    timeStartSale: toGMT(date),
                }))
            }}
            customInput={<Input id="date" />}
            dateFormat="MM/dd/yyyy"  // You can customize the date format
            minDate={toGMT(today)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="date">end sale</FormLabel>
            <DatePicker
            selected={concertInfor.timeEndSale}
            onChange={date =>{
                setConcertInfor( prev =>({
                    ... prev,
                    timeEndSale: toGMT(date),
                }))
            }}
            customInput={<Input id="date" />}
            dateFormat="MM/dd/yyyy"  // You can customize the date format
            minDate={concertInfor.timeStartSale}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="date">Start concert</FormLabel>
            <DatePicker
            selected={concertInfor.timeStartConcert}
            onChange={date =>{
                setConcertInfor( prev =>({
                    ... prev,
                    timeStartConcert: toGMT(date),
                }))
            }}
            customInput={<Input id="date" />}
            dateFormat="MM/dd/yyyy"  // You can customize the date format
            minDate={concertInfor.timeEndSale}
            />
          </FormControl>
          <Input 
          w="80%"
          h="36px"
          placeholder="max ticket purchase"
          onChange={e => setConcertInfor(prev => ({
            ... prev,
            maxTicketPurchase: e.target.value,
          }))}
          />
          {/* tickets */}
          {tickets.map( (ticket, index) => {
            return (
              <Flex
              w="80%"
              h="36px"
              key={index}>
                <Input 
                placeholder="Ticket name"
                onChange={e => {
                  ticket.name = e.target.value
                  
                }}
                />
                <Input 
                placeholder="Ticket price"
                onChange={e => {
                  ticket.price = e.target.value
                  
                }}
                />
                <Input 
                placeholder="Ticket supply"
                onChange={e => {
                  ticket.supply = e.target.value
                  
                }}
                />
                <Button
                cursor="pointer"
                onClick={()=>delTicket(index)}
                >
                  remove ticket
                </Button>
              </Flex>
            )
          })}
          <Button
          cursor="pointer"
          onClick={addTicket}
          >
            add ticket
          </Button>
          {Object.keys(invalidFields).map((element) => {
            return( invalidFields[element] &&
              <Text m="0px" w="100%">
                {invalidFields[element]}
              </Text>
            )
          })}
          <Button
          cursor="pointer"
          onClick={handleCreateEvent}
          >
            Create event
          </Button>
        </Flex>
      </>
    )
    :
    (<Navigate to="/login" replace={true}/>)
    
}
export default CreateEvent