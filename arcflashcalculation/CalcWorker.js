const { number } = require("mathjs");
const {parentPort,workerData} = require("worker_threads");
const collections = require("../db/Model/collections");
const calculate_Iarcv = require("./CalcArchingCurrentForVoltage");
const calculate_Intermediate_123 = require("./CalIntermediate123");
const {calculate_width1_height1,calculate_EnclosureSizeCorrectionFactor} = require("./CalcEnclosureSizeCorrectionFactor");
const calculate_EvforIE = require("./CalIncidentEnergyForVoltage");
const calculate_AFBvforABF = require("./CalArcFlashBoundaryForVolatage");
const calculate_CorrectionFactor = require("./CalCorrectionFactor");
const calculate_PPECategory = require("./CalPPECategory");





const calculate = async (val)=>{
    //console.log("In worker !");
    try {
        const voltage = Number(val.data.Voltage); //voc
        const faultCurrent =Number(val.data.FaultCurrent); //Ibf
        const conductorGap = Number(val.data.ConductorGap); //G
        const workingDistance = Number(val.data.WorkingDistance)//D
        const height = Number(val.data.EnclosureHeight)
        const depth = Number(val.data.EnclosureDepth)
        const width = Number(val.data.EnclosureWidth)
        const arcTime = Number(val.data.ArchingTime);
        const reducedArcTime = Number(val.data.ArchingTimeForReduced);
        const Econfig = val.data.ElectrodeConfiguration;

        const table1 = val.table.table1._doc;
        const table2 = val.table.table2._doc;
        const table3 = val.table.table3._doc;
        const table4 = val.table.table4._doc;
        const table5 = val.table.table5._doc;
        const table7 = val.table.table7._doc;

    //step 1 -  intermediate arcing currents 
        
    const Iarc_600 = calculate_Iarcv(table1.v600,faultCurrent,conductorGap);
   
    const Iarc_2700 = calculate_Iarcv(table1.v2700,faultCurrent,conductorGap);
    
    const Iarc_14300 = calculate_Iarcv(table1.v14300,faultCurrent,conductorGap);
    
    //step 2 - Final  arcing currents 

    const {v1:Iarc_1,v2:Iarc_2,v3:Iarc_3} =  calculate_Intermediate_123(voltage,Iarc_600,Iarc_2700,Iarc_14300)

    //Final Arc current
    let Iarc;
    if(0.600 < voltage <= 2.7)
    {
            Iarc = Iarc_3;
    }
    if(voltage > 2.7)
    {
            Iarc = Iarc_2
    }
    console.log(`Arc Current: ${Iarc}`)    
    //step 3 - enclosure size correction factor

    const {width1,height1,A,B}= calculate_width1_height1(width,height,table7.BType,Econfig,voltage);

    const EES = (height1 + width1)/2

    const CF = calculate_EnclosureSizeCorrectionFactor(table7,Econfig,EES);
 
    //step 4 -  intermediate values of incident energy
    
     const E600 = calculate_EvforIE(table3,arcTime,faultCurrent,conductorGap,workingDistance,Iarc_600,CF)
    
     const E2700 = calculate_EvforIE(table4,arcTime,faultCurrent,conductorGap,workingDistance,Iarc_2700,CF)
    
     const E14300 = calculate_EvforIE(table5,arcTime,faultCurrent,conductorGap,workingDistance,Iarc_14300,CF)
     
    //step 5 -  final value of incident energy

     const {v1:E1,v2:E2,v3:E3} =  calculate_Intermediate_123(voltage,E600,E2700,E14300)

    //Final incident energy
    let IE;
    if(0.600 < voltage <= 2.7)
    {
            IE = E3;
    }
    if(voltage > 2.7)
    {
            IE = E2
    }

    //console.log(`Incident energy: ${IE}`) 
    IE_calpersquare = IE *0.23901;
    console.log(`Incident energy(CalperSquare): ${IE_calpersquare}`)
    const PPE_Category = calculate_PPECategory(IE_calpersquare)
    //Step 6 -  intermediate values of arc-flash boundary

    const AFB600 = calculate_AFBvforABF(table3,arcTime,faultCurrent,conductorGap,Iarc_600,CF)

    const AFB2700 = calculate_AFBvforABF(table4,arcTime,faultCurrent,conductorGap,Iarc_2700,CF)

     const AFB14300 = calculate_AFBvforABF(table5,arcTime,faultCurrent,conductorGap,Iarc_14300,CF)

    //step 7 -  final value of the arc-flash boundary
   const {v1:AFB1,v2:AFB2,v3:AFB3} =  calculate_Intermediate_123(voltage,AFB600,AFB2700,AFB14300)

    //Final incident energy
    let AFB;
    if(0.600 < voltage <= 2.7)
    {
        AFB = AFB3;
    }
    if(voltage > 2.7)
    {
        AFB = AFB2
    }
    console.log(`Arc Flash Boundary: ${AFB}`) 

    //step 8 -  To find arcing current variation, find the correction factor.

     const VarCf = calculate_CorrectionFactor(table2,voltage) 

    //step 9 - Adjust the intermediate values of arcing current using the correction factor

    const Iarc_600_min = Iarc_600 * VarCf;

    const Iarc_2700_min = Iarc_2700 * VarCf;

    const Iarc_14300_min = Iarc_14300 * VarCf;
    //Step 10 -  Reduced final arcing current 

    const {v1:Iarc_min1,v2:Iarc_min2,v3:Iarc_min3} = calculate_Intermediate_123(voltage,Iarc_600_min,Iarc_2700_min,Iarc_14300_min);
      //Final Reduced Arc current
      let Iarc_min;
      if(0.600 < voltage <= 2.7)
      {
        Iarc_min = Iarc_min3;
      }
      if(voltage > 2.7)
      {
        Iarc_min = Iarc_min2
      }
      console.log(`Reduced Arc Current:${Iarc_min}`);

    //step 11 -  Repeat step 4 using the reduced intermediate currents

    const reduced_E600 = calculate_EvforIE(table3,reducedArcTime,faultCurrent,conductorGap,workingDistance,Iarc_600_min,CF);

    const reduced_E2700 = calculate_EvforIE(table4,reducedArcTime,faultCurrent,conductorGap,workingDistance,Iarc_2700_min,CF);

    const reduced_E14300 = calculate_EvforIE(table5,reducedArcTime,faultCurrent,conductorGap,workingDistance,Iarc_14300_min,CF);

    //step 12 -  Repeat Step 5 using the reduced arcing currents.

    const {v1:reduced_E1,v2:reduced_E2,v3:reduced_E3} = calculate_Intermediate_123(voltage,reduced_E600,reduced_E2700,reduced_E14300)
     //Final incident energy
     let IE_min;
     if(0.600 < voltage <= 2.7)
     {
        IE_min = reduced_E3;
     }
     if(voltage > 2.7)
     {
        IE_min = reduced_E2
     }
     IE_min_calpersquare = IE_min *0.23901
     console.log(`Reduced Incident energy(CalperSquare): ${IE_min_calpersquare}`) 

     const PPE_Category_min = calculate_PPECategory(IE_min_calpersquare)

    //Step 13: Repeat Step 6 using the reduced arcing currents.

    const AFB600_min = calculate_AFBvforABF(table3,reducedArcTime,faultCurrent,conductorGap,Iarc_600_min,CF)

    const AFB2700_min = calculate_AFBvforABF(table4,reducedArcTime,faultCurrent,conductorGap,Iarc_2700_min,CF)

     const AFB14300_min = calculate_AFBvforABF(table5,reducedArcTime,faultCurrent,conductorGap,Iarc_14300_min,CF)


    //Step 14: Repeat Step 7 using the reduced arcing currents.

    const {v1:reduced_AFB1,v2:reduced_AFB2,v3:reduced_AFB3} = calculate_Intermediate_123(voltage,AFB600_min,AFB2700_min,AFB14300_min)
    //Final incident energy
    let AFB_min;
    if(0.600 < voltage <= 2.7)
    {
        AFB_min = reduced_AFB3;
    }
    if(voltage > 2.7)
    {
        AFB_min = reduced_AFB2
    }
    console.log(`Reduced Arc Flash Boundary: ${AFB_min}`) 
    
    parentPort.postMessage({ArcCurrent_KA:Math.round(Iarc*100)/100,
                            IncidentEnergy_calperSquare:Math.round(IE_calpersquare*100)/100,
                            ArcFlashBoundary_mm:Math.round(AFB*100)/100,
                            PPE_Category:PPE_Category,
                            ReducedArcCurrent_KA:Math.round(Iarc_min*100)/100,
                            ReducedIncidentEnergy_calperSquare:Math.round(IE_min_calpersquare*100)/100,
                            ReducedArcFlashBoundary_mm:Math.round(AFB_min*100)/100,
                            ReducedPPE_Category:PPE_Category_min});
  
    } catch (error) {
        //this error will be cached by parent using calcWorker.on("error")
        throw error;
    }

}


parentPort.on("message",calculate);
