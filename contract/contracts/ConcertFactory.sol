// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Platform.sol";

contract ConcertFactory is Ownable{
    Platform platform;

    struct TypeTicket{
        uint price;
        uint total;
        uint sold;
    }

    bool isCancel;
    uint timeSellStart;
    uint timeEndConcert;
    uint fee;
    mapping (uint => TypeTicket) public typeTicket;
    mapping (uint ticketId => address) public ticketOwner;
    mapping (uint ticketId => bool) public isActive;

    event soldTicket( uint ticketId, address ticketOwner );
    event _transferTicket (address from, address to, uint ticketId);

    constructor(address _platform, uint _timeSellStart, uint _timeEndConcert, uint _fee, uint [] memory prices, uint [] memory supplies) Ownable(msg.sender){
        require(fee <= 100, "Fee must be less than 100");
        require(block.timestamp < _timeSellStart && _timeSellStart < _timeEndConcert  , "Should set the right time");
        timeSellStart = _timeSellStart;
        timeEndConcert = _timeEndConcert;
        platform = Platform(payable(_platform));
        fee = _fee;
        for(uint i; i < prices.length; i++){
            setTicket(i, prices[i], supplies[i]);
        }
    }

    function setConcertTime(uint _timeSellStart, uint _timeEndConcert) external onlyOwner{
        require(block.timestamp < _timeSellStart && _timeSellStart < _timeEndConcert  , "Should set the right time");
        timeSellStart = _timeSellStart;
        timeEndConcert = _timeEndConcert;
    }

    function setTicket(uint typeId, uint _price, uint _total) internal  onlyOwner {
        require(0 < _total, "Total ticket must be greater than 0");
        require(typeTicket[typeId].total == 0, "Type id already exsit");
        typeTicket[typeId] = TypeTicket(_price, _total, 0);
    }

    function buyTicket(uint [] calldata typeIds) external payable isNotCancel {
        // require(timeSellStart <= block.timestamp, "Sale ticket do not start");
        require(platform.checkUser(msg.sender), "Only platform user can buy ticket");
        uint totalPurchase = typeIds.length;
        uint payment;
        for(uint i; i < totalPurchase; i++)
        {
            uint typeId = typeIds[i];
            // total > sold => total > 0 => type exsit
            require( typeTicket[typeId].sold < typeTicket[typeId].total, "Do not have enought ticket" );
            payment += typeTicket[typeId].price;
            typeTicket[typeId].sold ++;
            uint ticketId = typeTicket[typeId].sold * 1000 + typeId;
            ticketOwner[ticketId] = msg.sender;
            emit soldTicket(ticketId, msg.sender);
        }
        require(msg.value == payment,"payment wrong");
    }
    function activeTicket(uint ticketId) external isNotActive(ticketId){
        require(ticketOwner[ticketId] == msg.sender, "Only ticket owner can active ticket");
        isActive[ticketId] = true;
    }

    function transferTicket(uint ticketId, address from, address to) external onlyPlatformCall isNotActive(ticketId){
        require( from == ticketOwner[ticketId], "Ticket must send from owner"); 
        ticketOwner[ticketId] = to;
        emit _transferTicket(from, to, ticketId);
    }

    function cancelConcert() external {
        require(
            msg.sender == address(platform) || msg.sender == owner(),
            "You do not have permission to cancel concert"
        );
        isCancel = true;
    }

    function withdraw() external onlyPlatformCall{
        require(timeEndConcert < block.timestamp,"Event do not end");
        uint saleAmount;
        if(!isCancel){
            saleAmount = address(this).balance * (100 - fee) / 100;
            bool sendSale = payable(owner()).send(saleAmount);
            require(sendSale, "Send failed");
        }
        uint feeAmount = address(this).balance - saleAmount;
        bool sendFee = payable(address(platform)).send(feeAmount);
        require(sendFee, "Send failed");
    }

    modifier isNotActive(uint ticketId){
        require(!isActive[ticketId] , "Ticket already active");
        _;
    }

    modifier isNotCancel(){
        require(!isCancel, "Concert cancelled");
        _;
    }

    modifier onlyPlatformCall(){
        require(
            msg.sender == address(platform), 
            "Function only can call by market place"
        );
        _;
    }

}