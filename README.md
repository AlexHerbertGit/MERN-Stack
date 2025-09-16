# MERN-Stack

This repository contains the MERN stack prototype for the **Kobra Kai charity project**, developed as part of **WEB701 – Web Technologies** at NMIT.  
The prototype demonstrates the required website functionality for Assignment 1:

1. **Authentication:** Beneficiaries and Members can register, log in, and manage their accounts (via JWT).  
2. **Meals & Token Transactions:** Members list meals; beneficiaries browse meals and order them using tokens; members accept/reject orders.  
3. **Interactive Features:** Dashboards for both user types, token balances, order history, and real-time updates.  

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) (comes with Node)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (local or Atlas cloud)
- [Postman](https://www.postman.com/) (optional, for API testing)

---

## 🔧 Installation & Setup

Clone the repository:

```bash
git clone https://github.com/yourusername/MERN-Stack.git
cd MERN-Stack

## Install API npm packages
cd api
npm install
npm run dev

## Install the React Client npm packages
cd ../client
npm install
npm run dev

Client will run on http://localhost:3000