const calculate_Iarcv = (tablev,faultCurrent,conductorGap)=>{
    let k1 = Number(tablev.k1)
    let k2 = Number(tablev.k2)
    let k3 = Number(tablev.k3)
    let k4 = Number(tablev.k4)
    let k5 = Number(tablev.k5)
    let k6 = Number(tablev.k6)
    let k7 = Number(tablev.k7)
    let k8 = Number(tablev.k8)
    let k9 = Number(tablev.k9)
    let k10 = Number(tablev.k10)
   
    const left =Math.pow(10,(k1+(k2*Math.log10(faultCurrent))+(k3*Math.log10(conductorGap))))

    const right = (k4*Math.pow(faultCurrent,6))
                  + (k5*Math.pow(faultCurrent,5))
                  + (k6*Math.pow(faultCurrent,4))
                  + (k7*Math.pow(faultCurrent,3))
                  + (k8*Math.pow(faultCurrent,2))
                  + (k9*faultCurrent)
                  +k10

    Iarc_v = left * right;

   return Iarc_v;
}

module.exports = calculate_Iarcv;