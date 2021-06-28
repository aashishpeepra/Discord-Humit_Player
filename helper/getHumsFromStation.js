const axios = require('axios')
module.exports = async (station,lastId = null)=>{
    const prefix = "http://localhost:5000/";
    try{
        const response =await axios.get(prefix+"content_stream/v2/public/station_stream/?station_name="+station);
    const {data}  =await response;
    return data.data;
    }catch(err){
        console.error(err,"WHILE FETCHING THE STATION");
        return [];
    }
    
  
   
}