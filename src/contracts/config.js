export const CARD_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CARD_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "CardMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "minter",
        "type": "address"
      }
    ],
    "name": "MintAttempted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "Error",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "element",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "power",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "defense",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "special",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "rarity",
        "type": "uint8"
      }
    ],
    "name": "mintCard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getCardAttributes",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "element",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "power",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "defense",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "special",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "rarity",
            "type": "uint8"
          }
        ],
        "internalType": "struct ElementalCard.CardAttributes",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "getTokensByOwner",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  }
]; 