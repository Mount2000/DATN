// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./ConcertFactory.sol";

contract Platform is AccessControl{
    struct ListDetail{
        address ticketOwner;
        uint listPrice;
    }
    mapping (address concert => mapping (uint tokenId => ListDetail)) public listDetail;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
    uint transferfee;

    constructor(){
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(USER_ROLE, ADMIN_ROLE);
    }

    function setTranferFee(uint _transferFee) external {
        require(_transferFee < 100, "Transfer fee must be less than 100");
        transferfee = _transferFee;
    }

    function listTicket(address concertAddress, uint ticketId, uint price) external onlyRole(USER_ROLE){
        require(ConcertFactory(concertAddress).ticketOwner(ticketId) == msg.sender,"Only owner can list ticket");
        ConcertFactory(concertAddress).transferTicket(ticketId, msg.sender, address(this));
        listDetail[concertAddress][ticketId] = ListDetail(msg.sender, price);
    }

    function unlistTicket(address concertAddress, uint ticketId) external onlyRole(USER_ROLE){
        require(ConcertFactory(concertAddress).ticketOwner(ticketId) == msg.sender,"Only owner can unlist ticket");
        ConcertFactory(concertAddress).transferTicket(ticketId, address(this), msg.sender);
        delete (listDetail[concertAddress][ticketId]);
    }

    function changeListPrice(address concertAddress, uint ticketId, uint newPrice) external onlyRole(USER_ROLE) {
        require(listDetail[concertAddress][ticketId].ticketOwner == msg.sender,"Only owner can change list price");
        listDetail[concertAddress][ticketId].listPrice = newPrice;
    }

    function buyTicket(address concertAddress, uint ticketId) external payable onlyRole(USER_ROLE){
        address oldOwner = listDetail[concertAddress][ticketId].ticketOwner;
        require(msg.value == listDetail[concertAddress][ticketId].listPrice,"Payment wrong");
        delete (listDetail[concertAddress][ticketId]);
        ConcertFactory(concertAddress).transferTicket(ticketId, address(this), msg.sender);
        bool sent = payable(oldOwner).send(msg.value * (100 - transferfee) / 100);
        require(sent, "Fail to send ether");
    }
    function checkUser(address account) external view returns(bool){
        return hasRole(USER_ROLE, account);
    } 

    function cancelConcert(address concert) external onlyRole(ADMIN_ROLE){
        ConcertFactory(concert).cancelConcert();
    }
    function withdrawConcert(address concert) external onlyRole(ADMIN_ROLE){
        ConcertFactory(concert).withdraw();
    }

    function withdrawPlatformFee() external onlyRole(DEFAULT_ADMIN_ROLE){
        bool success = payable(msg.sender).send(address(this).balance);
        require(success,"Send fail");
    }
    
    receive() external payable { }
}