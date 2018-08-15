
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

let newWidth = $(".accordion").width() - 250;
let activePanel = $(".accordion li.panel:first");

animal.init = () => {
    $(activePanel).addClass('active');
    activePanel.focus();
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
            $(`.panel-${i + 1} img`).attr("src", `http://paleobiodb.org/data1.2/taxa/thumb.png?id=${img_id}`);
            $(`.panel-${i + 1} h3`).append(res.records[0].nam);
            
            // $(`.panel-${i + 1} panel-content`).append($img, $animal_name);
        });
    }
}

$(document).keydown(function(e){
    if (e.keyCode == 39 && activePanel[0].attributes.class != `class="panel panel-10 active"`){
        console.log(activePanel[0].attributes.class);
        
        resize(activePanel.next());
    }
    if (e.keyCode == 37 && activePanel[0].attributes.class.nodeValue != "panel panel-0 active") {
        console.log(activePanel[0].attributes.class.nodeValue);
        console.log(`class="panel panel-0 active"`);
        
        resize(activePanel.prev());
    }
})
$(".accordion").on('click', '.panel', function () {
    if (!$(this).is('.active')) {
        resize(this);
    };
});
const resize = (next_item) =>{
    $(activePanel).animate({ width: "25px" }, 300);
    $(next_item).animate({ width: newWidth }, 300);
    $('.accordion .panel').removeClass('active');
    $(next_item).addClass('active');
    activePanel = $(".accordion li.panel.active");
    activePanel.focus();
    console.log(activePanel);
    
}
//when the window is resized
$(window).on("resize", function () {
    // update all variables that you need
    newWidth = $(".accordion").width() - 250;
    $(".panel.active").animate({ width: newWidth }, 1);

});
// **********On page load**********
$(function () {
    console.log(activePanel);
    
    animal.init();
});
