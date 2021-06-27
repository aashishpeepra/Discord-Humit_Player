const ytsr = require("ytsr");

module.exports = async (title)=>{
    const search = await ytsr(title, { pages: 1 });
    console.log(search.items[0])
    if (search.items.length==0) return [];
    return search.items[0]
}