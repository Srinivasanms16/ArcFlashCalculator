const calculate_Intermediate_123 = (voltage,v600,v2700,v14300)=>{

    const v1 = (((v2700 - v600)/2.1) * (voltage - 2.7))+v2700
    const v2 = (((v14300 - v2700)/11.6) * (voltage - 14.3))+v14300
    const v3 = ((v1 * (2.7 - voltage))/2.1) + ((v2 * (voltage-0.6))/2.1)
    return {v1,v2,v3};
}

module.exports = calculate_Intermediate_123;