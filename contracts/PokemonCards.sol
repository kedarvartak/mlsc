// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PokemonCards is ERC1155, ERC1155Supply, Ownable {
    using Strings for uint256;

    // Card Types (Constants)
    uint256 public constant BULBASAUR = 1;
    uint256 public constant CHARMANDER = 2;
    uint256 public constant SQUIRTLE = 3;
    uint256 public constant PIKACHU = 4;
    uint256 public constant MEWTWO = 5;

    struct CardAttributes {
        string name;
        string element;
        uint8 power;
        uint8 defense;
        string special;
        uint8 rarity;
        string imageUrl;
        uint256 maxSupply;
    }

    // Mappings
    mapping(uint256 => CardAttributes) private _cardAttributes;
    mapping(uint256 => uint256) private _currentSupply;
    mapping(address => bool) private _hasClaimedStarterPack;
    mapping(uint256 => bool) private _cardTypeExists;

    // Events
    event CardMinted(uint256 indexed tokenId, address indexed owner, uint256 amount);
    event StarterPackClaimed(address indexed player, uint256 tokenId);

    constructor() ERC1155("https://your-metadata-uri/{id}.json") Ownable(msg.sender) {
        // Initialize base card types
        _initializeCardType(
            BULBASAUR,
            "Bulbasaur",
            "Grass",
            45,
            49,
            "Vine Whip",
            1,
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            1000
        );

        _initializeCardType(
            CHARMANDER,
            "Charmander",
            "Fire",
            52,
            43,
            "Ember",
            1,
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
            1000
        );

        _initializeCardType(
            SQUIRTLE,
            "Squirtle",
            "Water",
            48,
            65,
            "Water Gun",
            1,
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
            1000
        );

        _initializeCardType(
            PIKACHU,
            "Pikachu",
            "Electric",
            55,
            40,
            "Thunder Shock",
            2,
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
            500
        );

        _initializeCardType(
            MEWTWO,
            "Mewtwo",
            "Psychic",
            110,
            90,
            "Psystrike",
            5,
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
            100
        );
    }

    function _initializeCardType(
        uint256 cardId,
        string memory name,
        string memory element,
        uint8 power,
        uint8 defense,
        string memory special,
        uint8 rarity,
        string memory imageUrl,
        uint256 maxSupply
    ) private {
        require(!_cardTypeExists[cardId], "Card type already exists");
        require(rarity >= 1 && rarity <= 5, "Rarity must be between 1 and 5");
        require(power <= 100 && defense <= 100, "Power and defense must be <= 100");

        _cardAttributes[cardId] = CardAttributes({
            name: name,
            element: element,
            power: power,
            defense: defense,
            special: special,
            rarity: rarity,
            imageUrl: imageUrl,
            maxSupply: maxSupply
        });

        _cardTypeExists[cardId] = true;
    }

    function mintCard(uint256 cardId) public {
        require(_cardTypeExists[cardId], "Card type does not exist");
        require(_currentSupply[cardId] < _cardAttributes[cardId].maxSupply, "Card supply limit reached");

        _currentSupply[cardId] += 1;
        _mint(msg.sender, cardId, 1, "");
        emit CardMinted(cardId, msg.sender, 1);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        for (uint256 i = 0; i < ids.length; i++) {
            require(_cardTypeExists[ids[i]], "Card type does not exist");
            require(
                _currentSupply[ids[i]] + amounts[i] <= _cardAttributes[ids[i]].maxSupply,
                "Card supply limit reached"
            );
            _currentSupply[ids[i]] += amounts[i];
        }
        _mintBatch(to, ids, amounts, data);
    }

    function claimStarterPack() public {
        require(!_hasClaimedStarterPack[msg.sender], "Starter pack already claimed");
        _hasClaimedStarterPack[msg.sender] = true;
        
        // Mint a Squirtle card as starter
        mintCard(SQUIRTLE);
        emit StarterPackClaimed(msg.sender, SQUIRTLE);
    }

    // View Functions
    function getCardAttributes(uint256 cardId) public view returns (CardAttributes memory) {
        require(_cardTypeExists[cardId], "Card type does not exist");
        return _cardAttributes[cardId];
    }

    function getCurrentSupply(uint256 cardId) public view returns (uint256) {
        require(_cardTypeExists[cardId], "Card type does not exist");
        return _currentSupply[cardId];
    }

    function getMaxSupply(uint256 cardId) public view returns (uint256) {
        require(_cardTypeExists[cardId], "Card type does not exist");
        return _cardAttributes[cardId].maxSupply;
    }

    function hasClaimedStarterPack(address user) public view returns (bool) {
        return _hasClaimedStarterPack[user];
    }

    function cardExists(uint256 cardId) public view returns (bool) {
        return _cardTypeExists[cardId];
    }

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        require(_cardTypeExists[tokenId], "URI query for nonexistent token");
        return string(abi.encodePacked(super.uri(tokenId), tokenId.toString()));
    }

    // Required overrides
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}