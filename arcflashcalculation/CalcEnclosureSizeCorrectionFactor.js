const { mod } = require("mathjs");

const calculate_width1_height1 = (width,height,btype,Econfig,voltage)=>{
    // A = Constant, equal to 4 for VCB and 10 for VCBB and HCB
   //B = Constant, equal to 20 for VCB, 24 for VCBB and 22 for HCB
   let A;
   if(Econfig === "VCB")
   {
       A = 4;
   }
   if(Econfig ==="VCBB" || Econfig === "HCB")
   {
       A=10;
   }
   let B;
   if(Econfig === "VCB")
   {
       B = 20;
   }
   if(Econfig ==="VCBB")
   {
       B=24;
   }
   if(Econfig === "HCB")
   {
       B=22
   }

   let width1;
   let height1;
   if(Econfig ==="VCB")
   {
      if(width < 508){
          if(btype == "Typical"){
              width1 = 20;
              height1 = 20
          }
          if(btype == "Shallow"){
              width1 = 0.03937 * width;
              height1 =  0.03937 * height;
          }
      }
      if(width >= 508 && width <= 660.4){
       width1 = 0.03937 * width;
       height1 =  0.03937 * height; 
   }
      
      if(width > 660.4 && width <= 1244.6){
       width1 = (660.4+(width-660.4)*((voltage+A)/B))*Math.pow(25.4,-1)
       height1 =  0.03937 * height;
   }
      
      if(width > 1244.6){
       width1 = (660.4+(1244.6-660.4)*((voltage+A)/B))*Math.pow(25.4,-1)
       height1 = 49
   }
      }
   
   if(Econfig ==="VCBB")
   {
       if(width < 508){if(btype == "Typical"){
           width1 = 20;
           height1 = 20
       }
       if(btype == "Shallow"){
           width1 = 0.03937 * width;
           height1 =  0.03937 * height;
       }}
       if(width >= 508 && width <= 660.4){
           width1 = 0.03937 * width;
           height1 =  0.03937 * height;
       }
       if(width > 660.4 && width <= 1244.6){
           width1 = (660.4+(width-660.4)*((voltage+A)/B))*Math.pow(25.4,-1)
           height1 = (660.4 +(height-660.4)*((voltage+A)/B)) *Math.pow(25.4,-1)
       }
       if(width > 1244.6){
           width1 = (660.4+(1244.6-660.4)*((voltage+A)/B))*Math.pow(25.4,-1)
       height1 = (660.4 +(1244.6-660.4)*((voltage+A)/B)) *Math.pow(25.4,-1)
       }
   }
   if(Econfig ==="HCB")
   {
       if(width < 508){if(btype == "Typical"){
           width1 = 20;
           height1 = 20
       }
       if(btype == "Shallow"){
           width1 = 0.03937 * width;
           height1 =  0.03937 * height;
       }}
      if(width >= 508 && width <= 660.4){
       width1 = 0.03937 * width;
       height1 =  0.03937 * height;
      }
      if(width > 660.4 && width <= 1244.6){
       width1 = (660.4+(width-660.4)*((voltage+A)/B))*Math.pow(25.4,-1)
       height1 = (660.4 +(height-660.4)*((voltage+A)/B)) *Math.pow(25.4,-1)
      }
      if(width > 1244.6){
       width1 = (660.4+(1244.6-660.4)*((voltage+A)/B))*Math.pow(25.4,-1)
       height1 = (660.4 +(1244.6-660.4)*((voltage+A)/B)) *Math.pow(25.4,-1)
      }
   }

   return {width1,height1,A,B};
}

const calculate_EnclosureSizeCorrectionFactor = (table7,Econfig,EES)=>{

    let b1,b2,b3;
    if(Econfig === "VCB")
    {
        b1 = Number(table7.VCB.b1);
        b2 = Number(table7.VCB.b2);
        b3 = Number(table7.VCB.b3);
    }
    if(Econfig === "VCBB")
    {
        b1 = Number(table7.VCBB.b1);
        b2 = Number(table7.VCBB.b2);
        b3 = Number(table7.VCBB.b3);
    }
    if(Econfig === "HCB")
    {
        b1 = Number(table7.HCB.b1);
        b2 = Number(table7.HCB.b2);
        b3 = Number(table7.HCB.b3);
    }
    let CF;
    switch(table7.BType)
    {
        case "Typical":
            {
             CF = (b1 * (EES * EES)) + (b2 * EES) + b3; 
             break;
            }
         case "Shallow":
             {
             CF = 1/((b1 * (EES * EES)) + (b2 * EES) + b3);
             break;
             }
    }
    return CF;
}

module.exports.calculate_width1_height1 = calculate_width1_height1;
module.exports.calculate_EnclosureSizeCorrectionFactor = calculate_EnclosureSizeCorrectionFactor;