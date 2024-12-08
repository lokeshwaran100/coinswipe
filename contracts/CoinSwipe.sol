// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract CoinSwipe is Ownable {
    uint256 public feePercentage; // Fee percentage in basis points (e.g., 100 = 1%)
    address public feeCollectionAddress; // Address where fees are sent
    IUniswapV2Router02 public uniswapRouter;
    
    address private constant WETH = 0x4200000000000000000000000000000000000006;
    // IERC20 private weth = IERC20(WETH);

    event FeePercentageUpdated(uint256 oldFee, uint256 newFee);
    event FeeCollectionAddressUpdated(address oldAddress, address newAddress);
    event SwapETHToToken(address indexed user, uint256 ethAmount, address token);
    event SwapTokenToETH(address indexed user, uint256 tokenAmount, address token);

    constructor(
        uint256 _initialFeePercentage,
        address _feeCollectionAddress,
        address _uniswapRouter
    ) Ownable(msg.sender) {
        require(_initialFeePercentage <= 10000, "Fee percentage too high");
        require(_feeCollectionAddress != address(0), "Invalid fee address");

        feePercentage = _initialFeePercentage;
        feeCollectionAddress = _feeCollectionAddress;
        // feeCollectionAddress = msg.sender;
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
    }

    // Update the fee percentage
    function setFeePercentage(uint256 _newFeePercentage) external onlyOwner {
    // function setFeePercentage(uint256 _newFeePercentage) external {
        require(_newFeePercentage <= 10000, "Fee percentage too high");
        emit FeePercentageUpdated(feePercentage, _newFeePercentage);
        feePercentage = _newFeePercentage;
    }

    // Update the fee collection address
    function setFeeCollectionAddress(address _newFeeCollectionAddress) external onlyOwner {
        require(_newFeeCollectionAddress != address(0), "Invalid fee address");
        emit FeeCollectionAddressUpdated(feeCollectionAddress, _newFeeCollectionAddress);
        feeCollectionAddress = _newFeeCollectionAddress;
    }

    // Swap ETH to token and collect fees
    // function swapETHToToken(address _token, uint256 amountIn, uint256 _minTokens) external {
    //     require(amountIn > 0, "ETH required for swap");

    //     uint256 fee = (amountIn * feePercentage) / 10000;
    //     uint256 amountToSwap = amountIn - fee;

    //     IERC20 weth = IERC20(_token);
    //     weth.transferFrom(msg.sender, address(this), amountToSwap);
    //     // weth.approve(address(uniswapRouter), amountToSwap);

    //     // Send fee to the fee collection address
    //     // payable(feeCollectionAddress).transfer(fee);

    //     // // Perform the swap
    //     // address[] memory path = new address[](2);
    //     // path[0] = uniswapRouter.WETH();
    //     // path[1] = _token;

    //     // uniswapRouter.swapExactTokensForTokens(
    //     //     amountToSwap,
    //     //     _minTokens,
    //     //     path,
    //     //     msg.sender,
    //     //     block.timestamp
    //     // );

    //     emit SwapETHToToken(msg.sender, amountIn, _token);
    // }

    function swapETHToToken(address _token, uint256 _ethAmount, uint256 _minTokens) external {
        require(_ethAmount > 0, "ETH required for swap");

        uint256 fee = (_ethAmount * feePercentage) / 10000;
        uint256 amountToSwap = _ethAmount - fee;

        // require(IERC20(WETH).balanceOf(msg.sender) >= amountToSwap, "Insufficient WETH balance");

        // Send fee to the fee collection address
        // payable(feeCollectionAddress).transfer(fee);

        IERC20 weth = IERC20(WETH);
        weth.transferFrom(msg.sender, address(this), _ethAmount);
        weth.approve(address(uniswapRouter), amountToSwap);

        // Perform the swap
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = _token;

        // uniswapRouter.swapExactETHForTokens{value: amountToSwap}(
        //     _minTokens,
        //     path,
        //     msg.sender,
        //     block.timestamp
        // );
        uniswapRouter.swapExactTokensForTokens(amountToSwap, _minTokens, path, msg.sender, block.timestamp);

        emit SwapETHToToken(msg.sender, _ethAmount, _token);
    }

    // Swap token to ETH and collect fees
    function swapTokenToETH(
        address _token,
        uint256 _tokenAmount,
        uint256 _minETH
    ) external {
        require(_tokenAmount > 0, "Token amount required");

        // uint256 fee = (_tokenAmount * feePercentage) / 10000;
        // uint256 amountToSwap = _tokenAmount - fee;

        // Transfer tokens to the contract
        IERC20(_token).transferFrom(msg.sender, address(this), _tokenAmount);

        // Approve Uniswap to spend tokens
        // IERC20(_token).approve(address(uniswapRouter), amountToSwap);
        IERC20(_token).approve(address(uniswapRouter), _tokenAmount);

        // Perform the swap
        address[] memory path = new address[](2);
        path[0] = _token;
        path[1] = WETH;

        uniswapRouter.swapExactTokensForETH(
            // amountToSwap,
            _tokenAmount,
            _minETH,
            path,
            msg.sender,
            block.timestamp
        );

        // Send fee in ETH to the fee collection address
        // IERC20(_token).transfer(feeCollectionAddress, fee);

        emit SwapTokenToETH(msg.sender, _tokenAmount, _token);
    }
}
