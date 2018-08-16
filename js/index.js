
const paleo = {};
// *************Array of Time Periods *****************
paleo.time_periods = [
    {},
    {
        name: "Cambrian",
        abr: "Cm",
        id: 22,
        animals: 186, 
    }, 
    {
        name: "Devonian",
        abr: "D",
        id: 19,
        animals: 133
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
paleo.base_names =["","Chordata,Radiodonta,Asaphida", "Chordata,Radiodonta,Asaphida", "Chordata", "Tetrapoda", "Tetrapoda", "Tetrapoda", "Tetrapoda", "Perissodactyla,Artiodactyla,Aves,Embrithopoda,Proboscidea", "Perissodactyla,Artiodactyla,Aves,Embrithopoda,Proboscidea","Perissodactyla,Artiodactyla,Aves,Embrithopoda,Proboscidea,Carnivora"]

paleo.new_width = $(".accordion").width() - 275;
paleo.activePanel = $(".accordion li.panel:first");

// initialization
paleo.init = () => {
    paleo.panel_click();
    paleo.panel_key_nav();
    paleo.window_resize();
    $(paleo.activePanel).addClass('active');
    paleo.activePanel.focus();
}
paleo.animal_panel = (panel) =>{
    const panel_val = panel.substring(panel.lastIndexOf("-") + 1);
    if (panel_val > 0) {
        $(`.${panel} .panel-content`).empty();
        for(let i = 0; i < 4; i++){
            paleo.get_animals(panel_val, i);
        }
    }
    
}
// get animal to display
paleo.get_animals = (panel_id, num) => {
    
        let $loading_div = $("<div>").addClass(`loading-${num}`);
        let $loading_img = $("<img>").attr("src", "assets/Wedges-3s-200px.svg");
        let $loading_dots = $("<h3>").append($("<img>").attr("src","assets/Ellipsis-1s-50px.svg"));
        $loading_div.append($loading_img, $loading_dots);
        $(`.panel-${panel_id} .panel-content`).append($loading_div);
        $.ajax({
            url: "http://paleobiodb.org/data1.2/occs/taxa.json",
            format: "GET",
            dataType: "json",
            data: {
                interval_id: paleo.time_periods[panel_id].id,
                base_name: paleo.base_names[panel_id],
                rank: "genus",
                show: "img",
                limit: 1,
                offset: Math.floor(Math.random() * paleo.time_periods[panel_id].animals)
            }
        }).then((res) => {
            $(`.panel-${panel_id} .panel-content .loading-${num}`).remove();
            let img_id = res.records[0].img.substring(res.records[0].img.lastIndexOf(":") + 1);
            let $animal_block = $("<div>").addClass("animal-block");
            let $animal_img = $("<img>").attr("src", `http://paleobiodb.org/data1.2/taxa/thumb.png?id=${img_id}`);
            let $animal_name = $("<h3>").append(res.records[0].nam);
            $animal_block.append($animal_img, $animal_name);
            $(`.panel-${panel_id} .panel-content`).append($animal_block);
        });
}
// key press event handler
paleo.panel_key_nav = function(){
    $(document).keydown(function (e) {
        if (e.keyCode == 39 && paleo.activePanel[0].classList[1] != "panel-10") {
            paleo.move_panel(paleo.activePanel.next());
        }
        if (e.keyCode == 37 && paleo.activePanel[0].classList[1] != "panel-0") {
            paleo.move_panel(paleo.activePanel.prev());
        }
    })
}
// click event handler for panel
paleo.panel_click = function(){
    $(".accordion").on('click', '.panel', function () {
        if (!$(this).is('.active')) {
            paleo.move_panel(this);
        };
    });
}
// method that changes panels
paleo.move_panel = (next_item) => {
    $(paleo.activePanel).animate({ width: "25px" }, 300);
    $(next_item).animate({ width: paleo.new_width }, 300);
    $('.accordion .panel').removeClass('active');
    $(next_item).addClass('active');
    paleo.activePanel = $(".accordion li.panel.active");
    paleo.activePanel.focus();
    paleo.animal_panel(paleo.activePanel[0].classList[1]);
}
//when the window is resized
paleo.window_resize = () => {
    $(window).on("resize", function () {
        // update all variables that you need
        paleo.new_width = $(".accordion").width() - 250;
        $(".panel.active").animate({ width: paleo.new_width }, 1);
    });
}

// **********On page load**********
$(function () {  
    paleo.init();
});
