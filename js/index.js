
const animal = {};
// *************Array of Time Periods *****************
const time_periods = [
    {
        name: "Cambrian",
        abr: "Cm",
        id: 22,
        animals: 1330
    }, 
    {
        name: "Devonian",
        abr: "D",
        id: 19,
        animals: 526
    }, 
    // only chordata
    {
        name: "Carboniferous",
        abr: "C",
        id: 18,
        animals: 296
    }, 
    {
        name: "Permian",
        abr: "P",
        id: 17,
        animals: 359
    }, 
    {
        name: "Triassic",
        abr: "Tr",
        id: 16,
        animals: 397
    }, 
    {
        name: "Jurassic",
        abr: "J",
        id: 15,
        animals: 404
    }, 
    {
        name: "Cretaceous",
        abr: "K",
        id: 14,
        animals: 1149
    }, 
    {
        name: "Paleogene",
        abr: "Pg",
        id: 26,
        animals: 1123
    }, 
    {
        name: "Neogene",
        abr: "Ng",
        id: 25,
        animals: 1244
    },
    {
        name: "Quaternary",
        abr: "Q",
        id: 12,
        animals: 1086
    }
];

// *************Array of Search Terms *****************
const base_names =["Chordata,Arthropoda", "Chordata,Arthropoda", "Chordata", "Tetrapoda", "Tetrapoda", "Tetrapoda", "Tetrapoda", "Perissodactyla,Artiodactyla,Aves,Embrithopoda,Proboscidea", "Perissodactyla,Artiodactyla,Aves,Embrithopoda,Proboscidea","Perissodactyla,Artiodactyla,Aves,Embrithopoda,Proboscidea,Carnivora"]

animal.init = () => {
    console.log('Getting Animal Data');
    for (let i = 0; i < time_periods.length; i++) {
        
        
        $.ajax({
            url: "http://paleobiodb.org/data1.2/occs/taxa.json",
            format: "GET",
            dataType: "json",
            data: {
                interval_id: time_periods[i].id,
                base_name: base_names[i],
                rank: "genus",
                show: "img",
                limit: 1,
                offset: Math.floor(Math.random() * time_periods[i].animals)
            }
        }).then((res) =>{
            console.log(time_periods[i].name, res);
            let img_id = res.records[0].img.substring(res.records[0].img.lastIndexOf(":")+1);
            console.log(img_id);
            $(`.animal${i + 1} img`).attr("src", `http://paleobiodb.org/data1.2/taxa/thumb.png?id=${img_id}`);
            $(`.animal${i + 1} h3`).append(res.records[0].nam);

            // $.ajax({
            //     url: "http://paleobiodb.org/data1.2/taxa/thumb.png",
            //     format: "GET",
            //     dataType: "png",
            //     data: {
            //         id: img_id
            //     }
            // }).then((res) => {
               
                
            // });
        });
    }
}

// **********On page load**********
$(function () {
    animal.init();
});