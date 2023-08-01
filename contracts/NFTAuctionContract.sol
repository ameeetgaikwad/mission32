// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTAuctionContract is Ownable, ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    uint256 public maxDurationAuction = block.timestamp + 120 hours;

    struct Auction {
        uint256 tokenId;
        address payable owner;
        uint256 startPrice;
        uint256 endPrice;
        uint256 startTime;
        uint256 duration;
    }

    mapping(uint256 => Auction) public auctions;

    event AuctionStarted(
        uint256 indexed tokenId,
        uint256 startPrice,
        uint256 endPrice,
        uint256 startTime,
        uint256 duration
    );
    event AuctionEnded(uint256 indexed tokenId, address winner, uint256 amount);

    constructor() ERC721("Dutch Auction", "DutchAuction") {}

    function mint(address to) external {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        _safeMint(to, newItemId);
    }

    function startAuction(
        uint256 _tokenId,
        uint256 _startPrice,
        uint256 _endPrice,
        uint256 _duration
    ) external {
        require(
            block.timestamp <= maxDurationAuction,
            "The auction has ended, it was for 5 days"
        );
        require(
            ownerOf(_tokenId) == msg.sender,
            "Only the owner can start the auction"
        );
        require(
            _startPrice > _endPrice,
            "Start price must be greater than end price"
        );

        Auction storage auction = auctions[_tokenId];
        auction.tokenId = _tokenId;
        auction.owner = payable(msg.sender);
        auction.startPrice = _startPrice;
        auction.endPrice = _endPrice;
        auction.startTime = block.timestamp;
        console.log(block.timestamp);
        auction.duration = _duration * 1 minutes;
        console.log(auction.duration);
        emit AuctionStarted(
            _tokenId,
            _startPrice,
            _endPrice,
            block.timestamp,
            _duration
        );
    }

    function bidOnAuction(uint256 _tokenId) external payable {
        Auction storage auction = auctions[_tokenId];
        require(auction.owner != address(0), "Auction does not exist");
        require(
            ownerOf(_tokenId) != msg.sender,
            "Owner cannot bid on their own auction"
        );
        require(auction.startTime < block.timestamp, "Auction has not started");
        require(
            block.timestamp < auction.startTime + auction.duration,
            "Auction has ended"
        );

        uint256 currentPrice = getCurrentPrice(auction);
        require(
            msg.value >= currentPrice * (10 ** 18),
            "Insufficient bid amount"
        );

        if (msg.value > currentPrice) {
            uint256 refundAmount = msg.value - currentPrice;
            (bool success, ) = msg.sender.call{value: refundAmount}("");
            require(success, "transfer failed");
        }
        (bool success1, ) = ownerOf(_tokenId).call{value: currentPrice}("");
        require(success1, "transfer failed");

        _endAuction(auction, msg.sender);
    }

    function getCurrentPrice(
        Auction memory _auction
    ) internal view returns (uint256) {
        uint256 elapsedTime = block.timestamp - _auction.startTime;
        if (elapsedTime >= _auction.duration) {
            return _auction.endPrice;
        }
        int256 priceDifference = int256(
            _auction.startPrice - _auction.endPrice
        );
        int256 currentPrice = int256(_auction.startPrice) -
            (priceDifference * int256(elapsedTime)) /
            int256(_auction.duration);
        return uint256(currentPrice);
    }

    function _endAuction(Auction memory _auction, address _winner) internal {
        delete auctions[_auction.tokenId];
        emit AuctionEnded(_auction.tokenId, _winner, _auction.endPrice);
    }

    fallback () external payable{}
    receive () external payable{}
}
