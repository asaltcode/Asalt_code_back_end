import app from './src/app.js'; // Assuming app is exported as default from app.js
import connectDatabase from './src/config/database.js';
import dotenv from 'dotenv'
dotenv.config()

connectDatabase();

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`My Server listening to the port: ${PORT} in  ${process.env.NODE_ENV} `);
});

process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled rejection error');
    server.close(()=>{
        process.exit(1);
    })
})

process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception error');
    server.close(()=>{
        process.exit(1);
    })
})

