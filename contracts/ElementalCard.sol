// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ElementalCard is ERC721, Ownable {
    uint256 private _nextTokenId;

    struct CardAttributes {
        string element;   
        uint8 power;     
        uint8 defense;   
        string special;  
        uint8 rarity;   
    }

    mapping(uint256 => CardAttributes) public cardAttributes;
    mapping(address => uint256[]) private _ownedTokens;

    event CardMinted(uint256 indexed tokenId, address indexed owner);
    event MintAttempted(address indexed minter);
    event Error(string message);

    constructor() ERC721("ElementalCard", "ELEM") Ownable(msg.sender) {}

    function mintCard(
        string memory element,
        uint8 power,
        uint8 defense,
        string memory special,
        uint8 rarity
    ) public {
        emit MintAttempted(msg.sender);

        require(bytes(element).length > 0, "Element cannot be empty");
        require(power <= 100, "Power must be <= 100");
        require(defense <= 100, "Defense must be <= 100");
        require(rarity <= 5 && rarity > 0, "Rarity must be between 1 and 5");
        
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(msg.sender, tokenId);
        
        cardAttributes[tokenId] = CardAttributes(
            element,
            power,
            defense,
            special,
            rarity
        );
        
        _ownedTokens[msg.sender].push(tokenId);
        
        emit CardMinted(tokenId, msg.sender);
    }

    function getTokensByOwner(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function getCardAttributes(uint256 tokenId) public view returns (CardAttributes memory) {
        require(_ownerOf(tokenId) != address(0), "Card does not exist");
        return cardAttributes[tokenId];
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
} 