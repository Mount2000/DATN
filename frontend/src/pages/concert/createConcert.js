import { Flex, Button, Input, FormControl, FormLabel, Text, Menu, MenuButton, MenuList, MenuItem} from '@chakra-ui/react'
import { useState, useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { apiCreateConcert } from '../../apis/concert'
import DatePicker from 'react-datepicker';
import { IoClose } from "react-icons/io5";
import { FaChevronDown } from 'react-icons/fa'
import Header from '../../components/header'
import Swal from 'sweetalert2'
import "react-datepicker/dist/react-datepicker.css";

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
    const concertType = {
      1:"Music", 
      2:"Sport", 
      3:"Art", 
      4:"Theater & Comedy", 
      5:"Workshop", 
      6:"Other",
    }
    const [file, setFile] = useState(null);
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      console.log(selectedFile)
      setFile(selectedFile);
    };
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
        type: 1,
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
        return account.userName ? 
        ( <Flex
          w="100vw"
          minH="100vh"
          flexDirection="column"
          >
              <Header />
              <Flex
              p="20px 0px"
              direction="column"
              bg="#bbb"
              justifyContent="center"
              alignItems="center"
              >
                <Flex
                flexDirection="column"
                textColor="white"
                gap="8px"
                >
                  {/* concert form */}
                  <Flex
                  bg="black"
                  p="8px 20px"
                  borderRadius="8px"
                  border="2px solid black"
                  direction="column"
                  gap="8px"
                  >
                    <FormControl>
                      <FormLabel>Event name</FormLabel>
                      <Input
textColor="black" 
                      borderRadius="4px"
                      p="0px 4px"
                      w="100%"
                      h="36px"
                      placeholder="title"
                      onChange={e => setConcertInfor(prev => ({
                        ... prev,
                        title: e.target.value,
                      }))}
                      />
                    </FormControl>
                    <Flex gap="40px">
                      <FormControl>
                        <FormLabel>Type</FormLabel>
                        <Menu>
                        <MenuButton 
                        as={Button} 
                        rightIcon={<FaChevronDown />}
                        bg="#eee"
                        textColor="black"
                        p="0 4px"
                        borderRadius="4px"
                        >
                          {concertType[concertInfor.type]}
                        </MenuButton>
                        <MenuList bg="#333" borderRadius="4px" overflow="hidden">
                          {Object.keys(concertType).map(type => {
                            return(
                              <MenuItem
                              p="0px 4px"
                              _hover={{
                                bg:"#666"
                              }}
                              onClick={() => setConcertInfor(prev => ({
                                ... prev,
                                type,
                              }))}
                              >{concertType[type]}</MenuItem>
                            )
                          })}
                        </MenuList>
                      </Menu>
                      </FormControl>
                      <Flex flexDirection="column">
                        <label>Banner</label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </Flex>
                    </Flex>
                    <FormControl>
                      <FormLabel>Location</FormLabel>
                      <Input
textColor="black" 
                      borderRadius="4px"
                      p="0px 4px"
                      w="100%"
                      h="36px"
                      placeholder="location"
                      onChange={e => setConcertInfor(prev => ({
                        ... prev,
                        location: e.target.value,
                      }))}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Input
textColor="black" 
                      borderRadius="4px"
                      p="0px 4px"
                      w="100%"
                      h="36px"
                      placeholder="description"
                      onChange={e => setConcertInfor(prev => ({
                        ... prev,
                        description: e.target.value,
                      }))}
                      />
                    </FormControl>
                    <Flex gap="8px">
                      <FormControl>
                        <FormLabel htmlFor="date">Start sale</FormLabel>
                        <DatePicker
                        selected={concertInfor.timeStartSale}
                        onChange={date =>{
                            setConcertInfor( prev =>({
                                ... prev,
                                timeStartSale: toGMT(date),
                            }))
                        }}
                        customInput={<Input
textColor="black" 
                        borderRadius="4px"
                        p="0px 4px"id="date" />}
                        dateFormat="MM/dd/yyyy"  // You can customize the date format
                        minDate={toGMT(today)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel htmlFor="date">End sale</FormLabel>
                        <DatePicker
                        selected={concertInfor.timeEndSale}
                        onChange={date =>{
                            setConcertInfor( prev =>({
                                ... prev,
                                timeEndSale: toGMT(date),
                            }))
                        }}
                        customInput={<Input
textColor="black" 
                        borderRadius="4px"
                        p="0px 4px"id="date" />}
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
                        customInput={<Input
textColor="black" 
                        borderRadius="4px"
                        p="0px 4px"id="date" />}
                        dateFormat="MM/dd/yyyy"  // You can customize the date format
                        minDate={concertInfor.timeEndSale}
                        />
                      </FormControl>
                    </Flex>
                    <FormControl>
                      <FormLabel>Max ticket can buy</FormLabel>
                      <Input
                      type="number"
                      textColor="black" 
                      borderRadius="4px"
                      p="0px 4px"
                      w="100%"
                      h="36px"
                      placeholder="Max ticket can buy"
                      onChange={e => setConcertInfor(prev => ({
                        ... prev,
                        maxTicketPurchase: e.target.value,
                      }))}
                      />
                    </FormControl>
                  </Flex>
                  {/* tickets form*/}
                  <Flex
                  bg="black"
                  p="8px 20px"
                  borderRadius="8px"
                  border="2px solid black"
                  direction="column"
                  gap="8px"
                  >
                    {tickets.map( (ticket, index) => {
                      return (
                        <Flex
                        w="100%"
                        minH="36px"
                        key={index}
                        alignItems="end"
                        gap="4px"
                        >
                          <Flex gap="4px">
                            <Flex direction="column">
                              <label>Ticket name</label>
                              <Input
textColor="black" 
                              borderRadius="4px"
                              p="0px 4px"
                              placeholder="Ticket name"
                              onChange={e => {
                                ticket.name = e.target.value
                                
                              }}
                              />
                            </Flex>
                            <Flex direction="column">
                              <label>Ticket price</label>
                              <Input
                              type="number"
                              textColor="black" 
                              borderRadius="4px"
                              p="0px 4px"
                              placeholder="Ticket price"
                              onChange={e => {
                                ticket.price = e.target.value
                                
                              }}
                              />
                            </Flex>
                            <Flex direction="column">
                              <label>Ticket supply</label>
                              <Input
                              type="number"
                              textColor="black" 
                              borderRadius="4px"
                              p="0px 4px"
                              placeholder="Ticket supply"
                              onChange={e => {
                                ticket.supply = e.target.value
                                
                              }}
                              />
                            </Flex>
                          </Flex>
                          <IoClose
                          fontSize="32px"
                          cursor="pointer"
                          onClick={()=>delTicket(index)}
                          />
                        </Flex>
                      )
                    })}
                    <Button
                    cursor="pointer"
                    onClick={addTicket}
                    >
                      add ticket
                    </Button>
                  </Flex>
                  {Object.keys(invalidFields).map((element) => {
                    return( invalidFields[element] &&
                      <Text m="0px" w="100%">
                        {invalidFields[element]}
                      </Text>
                    )
                  })}
                  <Button
                  w="20%"
                  h="32px"
                  m="0 40%"
                  cursor="pointer"
                  onClick={handleCreateEvent}
                  borderRadius="4px"
                  bg="blue"
                  >
                    Create event
                  </Button>
                </Flex>
              </Flex>
          </Flex>
    )
    :
    (<Navigate to="/login" replace={true}/>)
    
}
export default CreateEvent