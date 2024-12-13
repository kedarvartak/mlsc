// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ElementalCard is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    struct CardAttributes {
        string element;   
        uint8 power;     
        uint8 defense;   
        string special;  
        uint8 rarity;   
        string imageUrl;
    }

    struct StarterPokemon {
        string name;
        string element;
        uint8 power;
        uint8 defense;
        string special;
        uint8 rarity;
        string imageUrl;
    }

    mapping(uint256 => CardAttributes) private _cardAttributes;
    mapping(address => uint256[]) private _ownedTokens;
    mapping(address => bool) private _hasClaimedStarterPack;
    StarterPokemon[] private starterPokemon;

    event CardMinted(uint256 indexed tokenId, address indexed owner);
    event MintAttempted(address indexed minter);

    constructor() ERC721("ElementalCard", "ELEM") Ownable(msg.sender) {
        starterPokemon.push(StarterPokemon({
            name: "Bulbasaur",
            element: "Grass",
            power: 45,
            defense: 49,
            special: "Vine Whip",
            rarity: 1,
            imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
        }));
        
        starterPokemon.push(StarterPokemon({
            name: "Charmander",
            element: "Fire",
            power: 52,
            defense: 43,
            special: "Ember",
            rarity: 1,
            imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
        }));
        
        starterPokemon.push(StarterPokemon({
            name: "Squirtle",
            element: "Water",
            power: 48,
            defense: 65,
            special: "Water Gun",
            rarity: 1,
            imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
        }));
    }

    function mintCard(
        string memory element,
        uint8 power,
        uint8 defense,
        string memory special,
        uint8 rarity
    ) public {
        emit MintAttempted(msg.sender);
        
        require(power <= 100, "Power must be <= 100");
        require(defense <= 100, "Defense must be <= 100");
        require(rarity >= 1 && rarity <= 5, "Rarity must be between 1 and 5");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(msg.sender, tokenId);

        string memory generatedImageUrl;
        if (keccak256(abi.encodePacked(element)) == keccak256(abi.encodePacked("Water"))) {
            generatedImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png";
        } else if (keccak256(abi.encodePacked(element)) == keccak256(abi.encodePacked("Fire"))) {
            generatedImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png";
        } else if (keccak256(abi.encodePacked(element)) == keccak256(abi.encodePacked("Grass"))) {
            generatedImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png";
        } else {
            generatedImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png";
        }

        _cardAttributes[tokenId] = CardAttributes({
            element: element,
            power: power,
            defense: defense,
            special: special,
            rarity: rarity,
            imageUrl: generatedImageUrl
        });

        _ownedTokens[msg.sender].push(tokenId);
        emit CardMinted(tokenId, msg.sender);
    }

    function getCardAttributes(uint256 tokenId) public view returns (CardAttributes memory) {
        require(_exists(tokenId), "Token does not exist");
        return _cardAttributes[tokenId];
    }

    function getTokensByOwner(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function claimStarterPack() public {
        require(!_hasClaimedStarterPack[msg.sender], "Starter pack already claimed");
        
        _hasClaimedStarterPack[msg.sender] = true;
        
        // Randomly select a starter Pokemon (using block timestamp as randomness source)
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % starterPokemon.length;
        StarterPokemon memory starter = starterPokemon[randomIndex];
        
        // Mint the selected starter Pokemon
        mintCard(
            starter.element,
            starter.power,
            starter.defense,
            starter.special,
            starter.rarity
        );
    }

    function hasClaimedStarterPack(address user) public view returns (bool) {
        return _hasClaimedStarterPack[user];
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId < _tokenIdCounter;
    }
}