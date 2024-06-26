import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 90354,
  "explorers": [
    {
      "name": "Block Explorer",
      "url": "https://explorerl2new-camp-network-4xje7wy105.t.conduit.xyz",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://Qmd5ux27W44fjxHP2opz7eLhJ6CJJm9WR6VcKNhbQBxiSd/QOyzwbO2_400x400.jpg",
        "width": 400,
        "height": 400,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://Qmd5ux27W44fjxHP2opz7eLhJ6CJJm9WR6VcKNhbQBxiSd/QOyzwbO2_400x400.jpg",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "name": "Camp Network",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 90354,
  "redFlags": [],
  "rpc": [
    "https://90354.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-camp-network-4xje7wy105.t.conduit.xyz/"
  ],
  "shortName": "campaign-l2",
  "slug": "camp-network",
  "testnet": false
} as const satisfies Chain;