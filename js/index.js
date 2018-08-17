
const paleo = {};
// *************Array of Time Periods *****************
paleo.time_periods = [
    {},
    {
        name: "Cambrian",
        abr: "Cm",
        id: 22,
        animals: 185, 
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
        animals: 1241
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

paleo.new_width = $(".accordion").width() - 250;
paleo.active_panel = $(".accordion li.panel:first");
paleo.accordion = $("#accordion").position().top - 50;
paleo.last_panel = 0;

paleo.wrap_scroll = () => {

    $("#wrap").on("scroll", function(e){
        
        console.log($("#accordion").height(), (this).scrollTop, $("#wrap")[0].scrollTop);
        
        if ($("#accordion").height() < (this.scrollTop + 150) && (this.scrollTop + 150) > paleo.last_panel) {
            paleo.last_panel = $("accordion").height();
            const panel = paleo.active_panel[0].classList[1]
            const panel_val = panel.substring(panel.lastIndexOf("-") + 1);
            paleo.get_animals(panel_val);
            paleo.last_panel = 0;
        }
        if(this.scrollTop > 147) {
            $("#wrap").addClass("fixed-search");
        }
        else{
            $("#wrap").removeClass("fixed-search");
        }
    });
}
// initialization
paleo.init = () => {
    paleo.panel_click();
    paleo.panel_key_nav();
    paleo.window_resize();
    paleo.wrap_scroll();
    paleo.more_animals();
    
    $(paleo.active_panel).addClass('active');
    paleo.active_panel.focus();
}

paleo.animal_panel = (panel) =>{
    
    const panel_val = panel.substring(panel.lastIndexOf("-") + 1);
    if (panel_val > 0) {
        $(`.${panel} .panel-content`).empty();
            paleo.get_animals(panel_val);
    }
    paleo.clear_inactive();
        
    $(".wrap").animate({scrollTop: paleo.accordion}, 500);
    // let accordion = document.getElementById("accordion");
    // accordion.scrollIntoView({behavior: "smooth"});
}
// get animal to display
paleo.get_animals = (panel_id) => {
    paleo.clear_inactive();
    $(`.panel-${panel_id} .panel-content .more-animals`).remove();
    
    for (let i = 0; i < 12; i++) {
    let $loading_div = $("<div>").addClass(`animal-block loading`);
    let $loading_img = $("<img>").attr("src", "assets/Wedges-3s-200px.svg");
    let $loading_dots = $("<h3>").append($("<img>").attr("src","assets/Ellipsis-1s-50px.svg"));
    $loading_div.append($loading_img, $loading_dots);
    $(`.panel-${panel_id} .panel-content`).append($loading_div);
    }
    $(`.panel-${panel_id} .panel-content`).append($("<h3>").addClass("loading").append($("<img>").attr("src", "assets/Ellipsis-1s-50px.svg")));
    $.ajax({
        url: "http://paleobiodb.org/data1.2/occs/taxa.json",
        format: "GET",
        dataType: "json",
        data: {
            interval_id: paleo.time_periods[panel_id].id,
            base_name: paleo.base_names[panel_id],
            rank: "genus",
            show: "img",
            limit: paleo.time_periods[panel_id].animals,

        }
    }).then((res) => {
        console.log(res);
        console.log(paleo.time_periods[panel_id].animals);
        
        $(`.panel-${panel_id} .panel-content .loading`).remove();
        for(let i = 0; i < 12; i++){
            let record_num = Math.floor(Math.random() * paleo.time_periods[panel_id].animals)
            res.records[record_num]

            let img_id = res.records[record_num].img.substring(res.records[record_num].img.lastIndexOf(":") + 1);
            let $animal_block = $("<div>").addClass("animal-block");
            let $animal_img = $("<img>").attr("src", `http://paleobiodb.org/data1.2/taxa/thumb.png?id=${img_id}`);
            let $animal_name = $("<h3>").append(res.records[record_num].nam);
            $animal_block.append($animal_img, $animal_name);
            $(`.panel-${panel_id} .panel-content`).append($animal_block);
        }
        let $animals_but = $("<button>").addClass(`more-animals ${panel_id}`).text("More Animals");
        $(`.panel-${panel_id} .panel-content`).append($animals_but);

        
        // let img_id = res.records[0].img.substring(res.records[0].img.lastIndexOf(":") + 1);
        // let $animal_block = $("<div>").addClass("animal-block");
        // let $animal_img = $("<img>").attr("src", `http://paleobiodb.org/data1.2/taxa/thumb.png?id=${img_id}`);
        // let $animal_name = $("<h3>").append(res.records[0].nam);
        // $animal_block.append($animal_img, $animal_name);
        // $(`.panel-${panel_id} .panel-content`).append($animal_block);
        
    });
    
}
// button click for backup
paleo.more_animals = () => {
    $(".panel-content").on("click",".more-animals", function(){
        let panel = $(".more-animals").attr("class").split(" ")[1];
        console.log(panel);
        
        paleo.get_animals(panel);
    })
}
// key press event handler
paleo.panel_key_nav = () => {

    $(document).keydown(function (e) {

        if (e.keyCode == 39 && paleo.active_panel[0].classList[1] != "panel-10") {
            
            paleo.move_panel(paleo.active_panel.next()[0]);
        }
        if (e.keyCode == 37 && paleo.active_panel[0].classList[1] != "panel-0") {
            paleo.move_panel(paleo.active_panel.prev()[0]);
        }
    })
}
// click event handler for panel
paleo.panel_click = function(){
    $(".accordion").on("click", ".panel", function () {
        if (!$(this).is('.active')) {
            // fade out old content
            $(paleo.active_panel).find(".panel-content").empty();
            paleo.move_panel(this);
        };
    });
}
// method that changes panels
paleo.move_panel = (next_item) => {

    // set height
    if (next_item.classList[1] == "panel-0") {
        $(".panel").animate({ height: "16vh" }, 300);
    }
    else {
        // $(".panel").animate({ height: "100vh" }, 300);
        $(".panel").css("height", "100vh");
    }

    // shrink old panel, grow new panel
    $(paleo.active_panel).animate({ width: "25px" }, 300);
    $(next_item).animate({ width: paleo.new_width }, 300);

    

    // change new panel to active panel
    $('.accordion .panel').removeClass('active');
    $(next_item).addClass('active');
    paleo.active_panel = $(".accordion li.panel.active");
    paleo.animal_panel(paleo.active_panel[0].classList[1]);
    $(".panel").css("height", "auto");
    
}
// make all panels the hight of the tallest element
paleo.adjust_height = () => {
    console.log('get height');
    
    let element_heights = $(".panel").map( function (){
        return $(this).height();
    }).get();
    let max_height = Math.max.apply(null, element_heights);
    $(".panel").animate({ height: max_height}, 300);
    console.log(max_height);
    
}
//when the window is resized
paleo.window_resize = () => {
    $(window).on("resize", function () {
        // update all variables that you need
        paleo.new_width = $(".accordion").width() - 250;
        $(".panel.active").animate({ width: paleo.new_width }, 1);
    });
}
// fade out old content
paleo.clear_inactive = () => {
    $(":not(.active)>.panel-content").empty();
}

// **********On page load**********
$(function () {  
    paleo.init();
});
