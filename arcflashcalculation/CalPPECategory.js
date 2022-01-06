const calculate_PPECategory = (IE)=>{
    if(IE < 1.2 )
    {
       return "0"; 
    }
    else if(IE < 4){
        return "1";
    }
    else if(IE < 8)
    {
        return "2";
    }
    else if(IE < 25)
    {
        return "3";
    }
    else if(IE < 40)
    {
        return "4";
    }
    else{
        return ">4"
    }
}

module.exports = calculate_PPECategory;