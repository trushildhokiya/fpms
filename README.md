# Faculty Profile Management System 
---

## Description
---

Faculty Profile Management System is a web based application for managing Faculty Information in a centralizd way and to generate reports based on those data and give visual analytis for the same. The web app is fully mobile frindly and is supported on all devices

## Techonlogies
---
- **Frontend** : ![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=flat)  ![React Router Badge](https://img.shields.io/badge/React%20Router-CA4245?logo=reactrouter&logoColor=fff&style=flat) ![React Hook Form Badge](https://img.shields.io/badge/React%20Hook%20Form-EC5990?logo=reacthookform&logoColor=fff&style=flat) ![Vite Badge](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff&style=flat) ![shadcn/ui Badge](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff&style=flat) ![Redux Badge](https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=fff&style=flat) ![Axios Badge](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=fff&style=flat) ![JSON Web Tokens Badge](https://img.shields.io/badge/JSON%20Web%20Tokens-000?logo=jsonwebtokens&logoColor=fff&style=flat) ![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff&style=flat) ![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=flat)![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
- **Backend** : ![Node.js Badge](https://img.shields.io/badge/Node.js-393?logo=nodedotjs&logoColor=fff&style=flat) ![Nodemon Badge](https://img.shields.io/badge/Nodemon-76D04B?logo=nodemon&logoColor=fff&style=flat) ![Express Badge](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=flat) ![Mongoose Badge](https://img.shields.io/badge/Mongoose-800?logo=mongoose&logoColor=fff&style=flat)  ![Swagger Badge](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=000&style=flat)
- **Database** : ![MongoDB Badge](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff&style=flat)

## Getting Started 
---
### Installation

> [!NOTE]
> Node must be installed on your device
> Make sure you have typescript installed on your device if not run the following command on your terminal

``` bash
npm i -g typescript
```

Clone the project
```bash
git clone 'https://github.com/trushildhokiya/fpms.git'
```

Go to project directory
```bash
cd fpms
```

#### Setting up Frontend

Go to frontend directory and install dependencies

```bash
cd frontend
npm install
```

To run the frontend run the following command
```bash
npm run dev
```

#### Setting up Backend

Go to backend directory and install dependencies
```bash
cd backend
npm install
```
Create a env file with following fields
```env
PORT = 5000
CONNECTION_STRING = <your mongodb connection string>
JWT_SECRET = any random bytes 
GMAIL_USER = <gmail account>
GMAIL_APP_KEY = < gmail app key >
```

To run the backend server run the following command
```bash
npm run dev # development server
npm start # prod server
```
> [!TIP]
> To read backend documentation and try it run backend server and goto url 

```txt
http://localhost:5000/api-docs
```