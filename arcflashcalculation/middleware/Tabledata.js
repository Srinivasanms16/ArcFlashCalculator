const collections = require("../../db/Model/collections");


const getTablevalues =async (req,res,next)=>{

    if(!(req.body.ElectrodeConfiguration && 
        (req.body.ElectrodeConfiguration=== "VCB")))
    {
     return res.status(500).send("We are supporting Electrode Configuation of type VCB.");
    }
    const voltage =Number(req.body.Voltage)*1000;
    const depth = Number(req.body.EnclosureDepth);
    if((600 < voltage) &&(voltage <= 15000))
    {
    const Econfig = req.body.ElectrodeConfiguration;
    const table1 = await collections.table1.findOne({Econfig})
    const table2 = await collections.table2.findOne({Econfig})
    const table3 = await collections.table3.findOne({Econfig})
    const table4 = await collections.table4.findOne({Econfig})
    const table5 = await collections.table5.findOne({Econfig})
    
    const BType = ((voltage < 600) && (depth <= 203.2))? "Shallow" : "Typical"
    const table7 = await collections.table7.findOne({BType});
   
    req.table = {};
    req.table.table1 = table1;
    req.table.table2 = table2;
    req.table.table3 = table3;
    req.table.table4 = table4;
    req.table.table5 = table5;
    req.table.table7 = table7;
    next();
    }
    else{
        next("Voltage should be greater than 0.6Kv and less than equal to 15kv")
    }

}

module.exports = getTablevalues;