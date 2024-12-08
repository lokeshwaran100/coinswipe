# <img src="doc/logo-with-no-bg.png" width="23px" alt="coin-swipe-logo"> CoinSwipe

*"Swipe into the world of tokens – Powered by Base."*

---
## **Project Vision**  
CoinSwipe revolutionizes the way users explore and trade cryptocurrencies by combining intuitive swiping mechanics with robust token data. Whether you're a seasoned trader or new to the world of crypto, CoinSwipe provides a gamified yet effective way to discover and invest in tokens while managing your portfolio effortlessly.  

---

## **Core Features**  

### **1. Category Selection**  
- Users can filter tokens based on predefined categories:  
  - **Solid Meme Coins**  
  - **Risky Degen**  
  - **Newly Launched**  
  - **Blue Chips**  
  - **Community Favorites**  

This ensures personalized token recommendations aligned with user interests.  

### **2. Swipe Mechanism**  
- **Right Swipe:**  
  - Instantly swaps a predefined amount of ETH for the selected token.  
  - A small **platform fee** (e.g., 1%) is deducted before executing the swap.  
- **Left Swipe:**  
  - Adds the token to a “Not Interested” list to ensure users don't encounter it again.  

### **3. Portfolio Management Screen**  
- Comprehensive portfolio display with:  
  - **Tokens Owned:** Current price, quantity, profit/loss.  
  - **Sell Option:** Sell tokens back to ETH instantly.  
  - **Buy More Option:** Add funds to increase token holdings.  

### **4. Token Information on Swipe Cards**  
Each swipe card provides essential token details:  
- Token name, category, and description.  
- Real-time price, market cap, and 24-hour performance.  
- Community score based on aggregated sentiment from the Base ecosystem.  

---

## **Technical Architecture**  

### **Frontend**  
- Built with **Next.js** for seamless web and mobile experiences.  
- Swiping animations powered by **Framer Motion**.  

### **Backend**  
- **Coinbase MPC Wallet Kit** for wallet management and smart contract interactions.  
- Real-time token data aggregation using APIs like **Dexscreener**.  

### **Smart Contract Integration**  
- Utilizes **Uniswap v2** for token swaps.  
- Implements a platform fee (e.g., 1%) within the smart contract before executing transactions.  

---

## **User Flow**  

1. **Onboarding:**  
   - Users sign in with Google to generate a Coinbase MPC wallet upon first registration.  
   - Set a default swap amount in ETH.  

2. **Category Selection:**  
   - Users choose token categories that match their interests.  

3. **Swiping:**  
   - **Right Swipe:** Buys tokens and adds them to the portfolio.  
   - **Left Swipe:** Sends tokens to the “Not Interested” list.  

4. **Portfolio Management:**  
   - View, sell, or buy more tokens directly from the portfolio screen.  

---

## **Potential Revenue Streams**  

1. **Platform Fee:**  
   A small fee (e.g., 1%) on every token swap executed through the platform.  

2. **Premium Features:**  
   - Advanced analytics and token recommendations.  
   - Early access to newly launched tokens.  

3. **Sponsored Tokens:**  
   - Projects pay to feature their tokens in specific categories for increased visibility.  

---

## **Demo Video**  
[Demo Video Link](#) *(Replace with the actual demo link)*  

---

## **Deployment Links**  
- **Live App:** [CoinSwipe Platform](https://justswipe.vercel.app/)
- **Frontend Repository:** [GitHub Repository](https://github.com/lokeshwaran100/justswipe/application)
- **Smart Contract Repository:** [GitHub Repository](https://github.com/lokeshwaran100/justswipe)

---

## **Team Contact Information**  

| **Name**         | **Role**               | **Email**                    | **Twitter**           |  
|-------------------|------------------------|------------------------------|-----------------------|  
| Lokeshwaran B     | Smart Contract Developer   | lokeshwaran100@gmail.com     | [@cryptowithloki](https://x.com/cryptowithloki)  |  
| Adithya NG     | Frontend Developer   | adithyanandi009@gmail.com     | [@_Adithya_n_g](https://x.com/_Adithya_n_g)  |  
| Dharshan S        | Full Stack Developer   | dharshan2457@gmail.com       | [@capGoblin](https://x.com/capGoblin)       |  

---

**Join us on the journey to revolutionize token trading. Swipe smart with CoinSwipe!**  
