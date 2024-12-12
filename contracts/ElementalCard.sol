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

    constructor() ERC721("ElementalCard", "ELEM") Ownable(msg.sender) {}

    function mintCard(
        string calldata element,
        uint8 power,
        uint8 defense,
        string calldata special,
        uint8 rarity
    ) public {
        require(bytes(element).length > 0, "Element cannot be empty");
        require(power > 0 && power <= 100, "Power must be between 1 and 100");
        require(defense > 0 && defense <= 100, "Defense must be between 1 and 100");
        require(bytes(special).length > 0, "Special cannot be empty");
        require(rarity > 0 && rarity <= 5, "Rarity must be between 1 and 5");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        cardAttributes[tokenId] = CardAttributes({
            element: element,
            power: power,
            defense: defense,
            special: special,
            rarity: rarity
        });
        
        _ownedTokens[msg.sender].push(tokenId);
        
        emit CardMinted(tokenId, msg.sender);
    }

    function getTokensByOwner(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function getCardAttributes(uint256 tokenId) public view returns (CardAttributes memory) {
        require(_exists(tokenId), "Card does not exist");
        return cardAttributes[tokenId];
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
} 