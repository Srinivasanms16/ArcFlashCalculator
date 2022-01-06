const { mod } = require("mathjs")

const calculate_AFBvforABF = (table,arcTime,faultCurrent,conductorGap,Iarc_v,CF)=>{
    let k1 = Number(table.k1)
    let k2 = Number(table.k2)
    let k3 = Number(table.k3)
    let k4 = Number(table.k4)
    let k5 = Number(table.k5)
    let k6 = Number(table.k6)
    let k7 = Number(table.k7)
    let k8 = Number(table.k8)
    let k9 = Number(table.k9)
    let k10 = Number(table.k10)
    let k11 = Number(table.k11)
    let k12 = Number(table.k12)
    let k13 = Number(table.k13)
    
    const top1 = k1+(k2*Math.log10(conductorGap))
    const top2_1 =(k3*Iarc_v)
    const top2_2 = ((k4*Math.pow(faultCurrent,7))+(k5*Math.pow(faultCurrent,6))+(k6*Math.pow(faultCurrent,5))
                    +(k7*Math.pow(faultCurrent,4))
                    +(k8*Math.pow(faultCurrent,3)) + (k9*Math.pow(faultCurrent,2)) +(k10*faultCurrent))
    const top2 = top2_1/top2_2;
    const top3 = (k11*Math.log10(faultCurrent))+(k13*Math.log10(Iarc_v))+Math.log10(1/CF)-Math.log10(20/arcTime)
    const top = (top1+top2+top3)/-(k12);
    const AFBv = Math.pow(10,top);
    return AFBv;
}

module.exports = calculate_AFBvforABF;