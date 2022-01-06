const mongoose = require("mongoose");


const table1 = mongoose.model("Table1",{},"Table1");
const table2 = mongoose.model("Table2",{},"Table2");
const table3 = mongoose.model("Table3",{},"Table3");
const table4 = mongoose.model("Table4",{},"Table4");
const table5 = mongoose.model("Table5",{},"Table5");
const table7 = mongoose.model("Table7",{},"Table7");

module.exports.table1 = table1;
module.exports.table2 = table2;
module.exports.table3 = table3;
module.exports.table4 = table4;
module.exports.table5 = table5;
module.exports.table7 = table7;
