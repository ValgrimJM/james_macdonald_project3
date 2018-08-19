const animal = {};

animal.flickity_gallery = () => {
    $(".gallery").flickity({
        cellAlign: "left",
        contain: true,
        wrapAround: true,
        autoPlay: 6000,
    })
}

animal.get_param = () => {

    let queryString = window.location.href.split("?")[1];
    let animal_name = queryString.split("=")[1];
    console.log(animal_name);
    animal.get_info(animal_name);
    
}

animal.get_info = (name) => {

    $.ajax({
        url: "http://paleobiodb.org/data1.2/taxa/single.json",
        method: "GET",
        dataType: "json",
        data: {
            taxon_name: name,
            show: "full"
        }
    }).then((res) => {
        console.log(res);
        let animal = res.records[0];
        console.log(animal);
        let $animal_name = $("<h2>").text(animal.nam);
        let $animal_name_common = $("<h4>").text(animal.nm2);
        $taxonomy = ""
        if (animal.odl == undefined) {
            $taxonomy = $("<h3>").text(`${animal.phl} > ${animal.cll} > ${animal.fml} > ${animal.gnl}`);
        }
        else {
            $taxonomy = $("<h3>").text(`${animal.phl} > ${animal.cll} > ${animal.odl} > ${animal.fml} > ${animal.gnl}`);
        }
        $(".animal-header").append($animal_name, $animal_name_common, $taxonomy);
        $(".animal_header").append($("<h1>").text("test"));
        

        $.ajax({
            url: "http://en.wikipedia.org/w/api.php?action=query&format=json",
            method: "GET",
            dataType: "jsonp",
            data: {
                titles: animal.gnl,
                prop: "extracts|images",
                exintro: true
            }
        
        }).then((res) => {
            let animal_info = Object.values(res.query.pages)[0];
            console.log(animal_info);
            let img_list = [];
            if(animal_info.hasOwnProperty("missing") || animal_info.extract == ""){
                $wiki_link = $("<a>").attr("href", "https://en.wikipedia.org/wiki/Wikipedia:Articles_for_creation").text("here");
                $no_results = $("<p>").text("Sorry, this animal does not have a wikipedia article, check back later or ask for it to made ").append($wiki_link);
                $wiki_link = $("<a>").attr("href", "https://en.wikipedia.org/wiki/Wikipedia:Articles_for_creation").text("here");
                $(".animal-desc").append($no_results, $wiki_link);
                $(".gallery").flickity("append", $("<div>").addClass("carousel-cell").append($("<img>").attr("src", "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg")));
            }
            else{

            
                animal_info.images.forEach((image) => {
                    img_list.push(image.title);
                });
                // let img_list = Object.values(animal_info.images);
                console.log(img_list);
                let img_animal = img_list.filter((img) => {
                    if (img.includes(animal.nam) || img.includes(animal.nm2) || img.includes("NT") || img.includes("DB") || img.includes("BW") )
                    {
                        return true
                    }
                    else{
                        return false
                    }
                });
                if(img_animal.length > 0 ){
                    img_animal.forEach((img_name) => {
                        $.ajax({
                            url: "http://en.wikipedia.org/w/api.php?action=query&format=json",
                            method: "GET",
                            dataType: "jsonp",
                            data:{
                                titles: img_name,
                                prop: "imageinfo",
                                iiprop: "url|extmetadata"
                            }
                        }).then((res) =>{
                            console.log(res);
                            let img_url = Object.values(res.query.pages)[0].imageinfo[0];
                            let $animal_img = $("<img>").attr("src", img_url.url);
                            let $img_div = $("<div>").addClass("carousel-cell").append($animal_img);
                            $(".gallery").flickity("append", $img_div);
                            // $(".gallery").append($img_div);
                        });
                        
                    });
                }
                else{
                    $(".gallery").flickity("append", $("<div>").addClass("carousel-cell").append($("<img>").attr("src", "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg")));
                }
                console.log(img_animal);
            }
            

            $(".animal-desc").append(animal_info.extract);
        });
    });
}
animal.init = () => {
    animal.get_param();
}

// **********On page load**********
$(function () {
    animal.init();
    animal.flickity_gallery();
});