import Head from "next/head";

import {
  Box,
  Button,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Input,
} from "@chakra-ui/react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { Contract } from "ethers";
import {
  useSigner,
  useAccount,
  useNetwork,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import { ABI, ContractAddress } from "@/constants/constants";
import { parseEther } from "ethers/lib/utils.js";

export default function Home() {
  // Wagmi hooks
  const { data: signer } = useSigner();
  const { connector: activeConnector, isConnected } = useAccount();
  const { chain, chains } = useNetwork();

  const [balance, setBalance] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [successMint, setSuccessMint] = useState(false);
  const [failMint, setFailMint] = useState(false);

  const [tokenId, setTokenId] = useState();
  const [startPrice, setStartPrice] = useState();
  const [endPrice, setEndPrice] = useState();
  const [duration, setDuration] = useState();
  const [bidValue, setBidValue] = useState();
  const [bidTokenId, setBidTokenId] = useState();
  useEffect(() => {
    setFailMint(false);
    console.log(signer?._address);
  }, [chain, signer]);

  // Function to mint NFT
  const mintNft = async () => {
    try {
      if (isConnected) {
        setIsLoading(true);
        const nftContract = new Contract(ContractAddress, ABI, signer);
        console.log(signer?._address);
        const tx = await nftContract.mint(
          "0x93104E260cb74E94038F4325098d31EE426C6F85"
        );
        await tx.wait();
        const receipt = await tx.wait();
        setIsLoading(false);
      } else {
        alert("Connect your wallet");
      }
    } catch (error) {
      console.log(`An error occurred: ${error.message}`);

      setIsLoading(false);
    }
  };

  const startAuction = async () => {
    try {
      if (isConnected) {
        setIsLoading(true);
        const nftContract = new Contract(ContractAddress, ABI, signer);
        const tx = await nftContract.startAuction(
          tokenId,
          startPrice,
          endPrice,
          duration
        );
        await tx.wait();
        const receipt = await tx.wait();
        setIsLoading(false);
      } else {
        alert("Connect your wallet");
      }
    } catch (error) {
      console.log(`An error occurred: ${error.message}`);

      setIsLoading(false);
    }
  };

  const bidAuction = async () => {
    try {
      if (isConnected) {
        setIsLoading(true);
        const nftContract = new Contract(ContractAddress, ABI, signer);
        const tx = await nftContract.bidOnAuction(bidTokenId, {
          value: parseEther(bidValue),
        });

        await tx.wait();
        const receipt = await tx.wait();
        setIsLoading(false);
      } else {
        alert("Connect your wallet");
      }
    } catch (error) {
      console.log(`An error occurred: ${error.message}`);

      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Mint NFT</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        bgGradient={
          "linear-gradient( 113deg,  rgba(251,250,205,1) 24.4%, rgba(247,163,205,1) 53.7%, rgba(141,66,243,1) 99.2% )"
        }
        height={"100vh"}
        fontFamily="Courier New, Courier, monospace"
        textAlign={"center"}
      >
        {/* navigation */}
        <Box
          padding={"25px 20px"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box></Box>
          <Box
            display={"flex"}
            justifyContent={"space-evenly"}
            alignItems={"center"}
            position={"relative"}
            right={"35"}
          >
            <ConnectButton
              label="Connect Wallet"
              accountStatus="full"
              showBalance={true}
            />
          </Box>
        </Box>
        {/* main content */}
        <Box
          display={"flex"}
          flexDir={"column"}
          position={"fixed"}
          top={"50%"}
          left={"50%"}
          transform={"translate(-50%,-50%)"}
        >
          <Box
            display={"flex"}
            flexDirection={{ base: "column", md: "column" }}
            justifyContent={"center"}
            alignItems={"center"}
            transition={"backgroundImage 5s ease-in-out"}
          >
            <Button
              width={{ base: "65%", sm: "50%", md: "80%" }}
              marginBottom={{ base: "1rem", md: "2rem" }}
              marginRight={{ base: "0", md: "8" }}
              backgroundImage={
                "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
              }
              _hover={{
                backgroundImage:
                  "linear-gradient(43deg, #FFCC70 0%, #C850C0 46%, #4158D0 100%)",
              }}
              onClick={() => mintNft()}
            >
              Mint NFT
            </Button>
            <Box>
              <Box display={"flex"} flexDirection={"row"}>
                <Input
                  background={"white"}
                  placeholder="token id"
                  value={tokenId}
                  onChange={(event) => setTokenId(event.target.value)}
                />
                <Input
                  background={"white"}
                  placeholder="start price"
                  value={startPrice}
                  onChange={(event) => setStartPrice(event.target.value)}
                />
                <Input
                  background={"white"}
                  placeholder="end price"
                  value={endPrice}
                  onChange={(event) => setEndPrice(event.target.value)}
                />
                <Input
                  background={"white"}
                  placeholder="duration"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                />
              </Box>
              <Button
                width={{ base: "65%", sm: "50%", md: "80%" }}
                marginBottom={{ base: "1rem", md: "2rem" }}
                marginTop={{ base: "0.5rem", md: "0.5rem" }}
                marginRight={{ base: "0", md: "8" }}
                backgroundImage={
                  "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
                }
                _hover={{
                  backgroundImage:
                    "linear-gradient(43deg, #FFCC70 0%, #C850C0 46%, #4158D0 100%)",
                }}
                onClick={startAuction}
              >
                Start Auction
              </Button>
            </Box>
            <Box>
              <Box display={"flex"} flexDirection={"row"}>
                <Input
                  background={"white"}
                  placeholder="token id"
                  value={bidTokenId}
                  onChange={(event) => setBidTokenId(event.target.value)}
                />
                <Input
                  background={"white"}
                  placeholder="bid amount (in ethers)"
                  value={bidValue}
                  onChange={(event) => setBidValue(event.target.value)}
                />
              </Box>
              <Button
                width={{ base: "65%", sm: "50%", md: "80%" }}
                marginBottom={{ base: "1rem", md: "1rem" }}
                marginRight={{ base: "0", md: "8" }}
                backgroundImage={
                  "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
                }
                _hover={{
                  backgroundImage:
                    "linear-gradient(43deg, #FFCC70 0%, #C850C0 46%, #4158D0 100%)",
                }}
                onClick={bidAuction}
              >
                Bid on Auction
              </Button>
            </Box>
          </Box>
          {isLoading ? <Spinner /> : ""}
        </Box>
      </Box>
    </>
  );
}
