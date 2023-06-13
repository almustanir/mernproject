require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
// app.use(express.static(path.join(__dirname, 'public')))
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn')
const {logEvents} = require('./middleware/logger')



connectDB()
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV);


app.use(logger)
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public' )))
app.use(cors(corsOptions));
app.use(cookieParser())


app.use("/", require("./routes/root"));
app.use("/auth", require('./routes/authRoute'))
app.use('/users', require("./routes/userRoutes"))
app.use('/notes', require("./routes/noteRoutes"))





app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
      res.json({ err: "404 Not Found" });
    } else {
      res.type("txt").send("404 Not Found");
    }
});





app.use(errorHandler)

mongoose.connection.on('open', () => {
    console.log('connected to MongoDb');
    app.listen(PORT, () => { console.log(`server listening is on ${PORT}`)})
    
})

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
