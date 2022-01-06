require("./db/connect");
const {Worker} = require("worker_threads");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const middleware = require("./arcflashcalculation/middleware/Tabledata");

const staticfilespath = path.join(__dirname,"public");

const viewPath = path.join(__dirname,"template","view")

const hbspartials = path.join(__dirname,"template","partial")

const workerPath = path.join(__dirname,"arcflashcalculation","CalcWorker.js");

const server = express();

server.use(express.json());

server.use(express.urlencoded({extended:false}));

server.use(express.static(staticfilespath))

server.set("views",viewPath);

server.set("view engine", "hbs");

hbs.registerPartials(hbspartials);


server.post("/calculate",middleware, async (req,res,next)=>{
    try {
        const calcWorker = new Worker(workerPath);

        calcWorker.postMessage({data:req.body,table:req.table});


        calcWorker.on("message",(value)=>{
        //console.log("Back to main");
            res.status(200).send(value)
        });

        calcWorker.on("error",(err)=>{
           // console.log("Back to main");
            next(err.message);
        });

        calcWorker.on("exit",()=>{
          //  console.log("Back to main")
            next("some exception");
        })

    } catch (err) {
        next(err)
    }
})

server.get("/",(req,res,next)=>{
    res.render("index");
})


server.use((err,req,res,next)=>{
    res.status(500).send(err);
})

server.listen(3000,()=>{
    console.log("server is listening at port 3000 !");
})