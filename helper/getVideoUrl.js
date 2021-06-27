const ytsr = require("ytsr");

module.exports = async (title)=>{
    let search;
    try{
         search = await ytsr(title, { pages: 1 });
    }catch(e){
        console.error(e,"WHILE GETTING VIDEO INFO")
    }
   

    if (search.items.length==0) return [];
    return [search.items[0]]
}