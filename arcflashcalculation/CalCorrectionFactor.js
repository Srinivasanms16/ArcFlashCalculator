const calculate_CorrectionFactor = (table2,voltage)=>{

    const result = (Number(table2.k1)*Math.pow(voltage,6))+
    (Number(table2.k2)*Math.pow(voltage,5))+
    (Number(table2.k3)*Math.pow(voltage,4))
    +(Number(table2.k4)*Math.pow(voltage,3)) 
    +(Number(table2.k5)*Math.pow(voltage,2))
    +(Number(table2.k6)*voltage)+Number(table2.k7);
const VarCf = 1 - (0.5*result);
return VarCf; 

}

module.exports = calculate_CorrectionFactor;