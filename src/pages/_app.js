import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  Chain,
  polygonMumbai,
} from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const ShardeumLiberty = {
  id: 8081,
  name: "Shardeum Liberty 2.1",
  network: "Shardeum Liberty 2.1",
  iconUrl:
    "https://img.api.cryptorank.io/coins/150x150.shardeum1665056595732.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Shardeum Liberty 2.1",
    symbol: "SHM",
  },
  rpcUrls: {
    default: {
      http: ["https://liberty20.shardeum.org/"],
    },
  },
  blockExplorers: {
    default: {
      name: "ShardeumLiberty",
      url: "https://explorer-liberty20.shardeum.org/",
    },
    etherscan: {
      name: "ShardeumLiberty",
      url: "https://explorer-liberty20.shardeum.org/",
    },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [ShardeumLiberty],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://liberty20.shardeum.org/`,
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Mint NFT",
  projectId: "2455679236dbec241fec394feb4fe62d",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={darkTheme()}
      >
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
