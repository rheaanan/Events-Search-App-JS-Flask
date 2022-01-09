window.onload=func;
var latitude, longitude;
var func_map = {'Date':'date', 'Icon':'icon', 'Event':'event', 'Genre': 'genre', 'Venue':'venue'}
var func_map2 = {'Date':'date', 'Artist/Team':'artist', 'Venue':'venue', 'Genres':'genre','Price Ranges':'price_ranges','Ticket Status':'ticket_status' ,'Buy Ticket At:': 'buy_ticket'}

function func(){
	call_ipapi();
	document.getElementById("g_location").addEventListener("click", enable_location);
	document.getElementById("here").addEventListener("click", disable_location);
	document.getElementById("location").addEventListener("change", call_gapi);
    document.getElementById("search").addEventListener("click", get_table);
    document.getElementById("clear").addEventListener("click", clear_search);
    document.getElementById("form").addEventListener("submit", event => {
    event.preventDefault();

});

}


async function get_json(endpoint) {
    const response = await fetch(endpoint);
    //console.log("got here atleast")
    return await response.json();
}
async function load_info(element) {
    url = "/load?id=";
    url += element.id
    const response = await get_json(url);
    //console.log(response);
    display_info(response);
    return
}

var myFuncs2 = {
  date: function (event) { try{text = event['dates']['start']['localDate']+" "+event['dates']['start']['localTime']; } catch(err){text = 'N/A'}},
  artist: function (event) { try{ text=""; var names = [];attr = event['_embedded']['attractions']; for (var i=0;i<attr.length;i++){ var s = "<a target=\"_blank\" href=\""+attr[i]["url"]+"\">"+attr[i]['name']+"</a>" ; names.push(s)};text=names.join(" | ")} catch(err){text="N/A"} },
  venue: function (event) { try{text = event["_embedded"]["venues"][0]['name']}catch(err){text="N/A"}},
  genre: function (event) { try{var genre_parts = ['subGenre','genre','segment','subType','type']; var names =[]; for (var i=0;i<genre_parts.length;i++){try{if(event['classifications'][0][genre_parts[i]]['name']!== "Undefined"){names.push(event['classifications'][0][genre_parts[i]]['name']);}}catch(err){}};text=names.join(" | ")}catch(err){text="N/A"}},
  price_ranges: function (event) { try{text = event['priceRanges'][0]['min'] + "-"+event['priceRanges'][0]['max']+" USD";} catch(err){text="N/A"}},
  ticket_status: function (event) { try{text = event['dates']["status"]["code"]}catch(err){text="N/A"}},
  buy_ticket: function (event) { try{text = "<a target=\"_blank\" href=\""+event['url']+"\">Ticketmaster<a>";} catch(err){text="N/A"}}

};

var myFuncs = {
  date: function (event) { try{text = event['dates']['start']['localDate']+" "+event['dates']['start']['localTime']; } catch(err){text = 'N/A'}},
  icon: function (event) { try{text = "<img src=\""+event['images'][0]['url']+"\"\\>";} catch(err){text="N/A"} },
  event: function (event) { try{text = "<a href=\"#info_table\" id=\""+event['id']+"\" onClick=\"load_info(this)\">"+event['name']+"</a>";}catch(err){text="N/A"} },
  genre: function (event) { try{text = event['classifications'][0]['segment']['name']}catch(err){text="N/A"} },
  venue: function (event) { try{text = event["_embedded"]["venues"][0]['name'];} catch(err){text="N/A"} }
};
// execute the one specified in the 'funcToRun' variable:

function get_from_json(attr, event){
    funcToRun = func_map[attr];
    myFuncs[funcToRun](event);
}

async function get_from_json2(attr, event){
    funcToRun = func_map2[attr];
    myFuncs2[funcToRun](event);
}

async function display_info(response){
    try{
        var info_div = document.getElementById("info_table");
        info_div.innerHTML="";
        var inner_div = document.createElement('div');
        inner_div.setAttribute("id", "inner_div");
        var event_heading = document.createElement('h2');
        event_heading.innerHTML=response['name'];
        info_div.appendChild(event_heading)
        var div_left = document.createElement('div');
        div_left.setAttribute("id", "div_left");
        var headings = ['Date' ,'Artist/Team', 'Venue', 'Genres', 'Price Ranges','Ticket Status','Buy Ticket At:'];

        for (var i = 0; i < headings.length; i++){
            console.log(headings[i]+i)
            var header_name = document.createElement('h3');
            header_name.innerHTML = headings[i];


            console.log("calling gettingjson2 with"+headings[i]+response)
            value = get_from_json2(headings[i],response);
            if (text!=="N/A"){
                div_left.appendChild(header_name);
                var curr_val = document.createElement('p');
                curr_val.innerHTML = text;
                div_left.appendChild(curr_val);
            }

        }
        inner_div.appendChild(div_left)

        try{
        var div_right = document.createElement('div');
        div_right.setAttribute("id", "div_right");
        var sm_img = document.createElement('img');
        sm_img.setAttribute("src",response["seatmap"]["staticUrl"])
        sm_img.setAttribute("id", "sm_img");
        div_right.appendChild(sm_img)
        inner_div.appendChild(div_right)
        }
        catch(err){
        console.log("missing image")
        }

        info_table.appendChild(inner_div)

    }
    catch(err){
        console.log(err,"infor was partially missing")
    }

}

async function make_table(response){
    try{
        var res_div = document.getElementById("results_table");
        res_div.innerHTML="";
        var info_div = document.getElementById("info_table");
        info_div.innerHTML="";
        var table = document.createElement('table');
        table.setAttribute("id", "table");
        var first_row = document.createElement('tr');
        var header_row = ['Date' ,'Icon', 'Event', 'Genre', 'Venue'];
        var curr_val = "";
        for (var i = 0; i < header_row.length; i++){
            curr_val = document.createElement('th');
            curr_val.innerHTML = header_row[i];
            first_row.appendChild(curr_val);
        }

        table.appendChild(first_row);
        var next_row = document.createElement('tr');
        events = response['_embedded']['events']
        for (var i = 0; i < events.length; i++){
            next_row = document.createElement('tr');
            for (var j = 0; j < header_row.length; j++){
                curr_val = document.createElement('td');
                value = get_from_json(header_row[j],events[i]);
                curr_val.innerHTML = text;
                next_row.appendChild(curr_val);
            }
            /*curr_val.innerHTML=events[i]['name']
            next_row.appendChild(curr_val)*/
            table.appendChild(next_row)

            console.log(events[i]['name'])

        }
        res_div.appendChild(table)
    }
    catch(err){
        var res_div = document.getElementById("results_table");
        var error_message = document.createElement('div');
        error_message.setAttribute("id", "error_message");
        var error_text = document.createElement('p');
        error_text.innerHTML = "No Records have been found"
        error_message.appendChild(error_text)
        res_div.appendChild(error_message)
        var line = document.createElement('hr');
        line.setAttribute("id", "line");
        res_div.appendChild(line)

    }

}

async function get_table(){
    document.getElementById("d_box").click()
    if(check_values()){  //TBD decide if you need check_values because you already have tooltip doing that now
        const keyword = document.getElementById("keyword").value.trim();
        const category = document.getElementById("category").value;
        const distance = document.getElementById("distance").value.trim();
        var lat = latitude
        var lng  = longitude
        const params = {
            keyword: keyword,
            category: category,
            distance:  distance,
            lat: lat,
            lng: lng
        };
        if (params['distance'] ==""){
            params['distance'] = 10
        }

        url = "/search"
        url += '?' + ( new URLSearchParams( params ) ).toString()
        console.log("printing url: "+url)
        const response = await get_json(url);
        console.log("response", response)
        make_table(response)
        //const { error, result } = response;
        /*if(error) {
            displayError(error);
        }
        else {
            resLength = result.length;
            displayResults(result);
        }*/
    }

}
function check_values() {
    const keyword = document.getElementById("keyword");
    const distance = document.getElementById("distance");
    //const category = document.getElementById("category");
    if(keyword.value== "" )
    {
        return false;
    }
    if(keyword.value!= "" && keyword.value.trim() == "")
    {   alert("Keyword is empty");
        return false;
    }
    const regex = new RegExp(/^[1-9][0-9]*$/)
    console.log(distance.value);
    if(distance.value!="" && !regex.test(distance.value.trim())){
        console.log("Distance is invalid");
        return false;
    }

    //if(category.value == "") return false;

    return true;
}
function clear_search(){
    const keyword = document.getElementById("keyword");
    const category = document.getElementById("category");
    const distance = document.getElementById("distance");
    const here = document.getElementById("here");
    const location = document.getElementById("location");
    const default_op = document.getElementById("default_op")

    keyword.value = "";
    default_op.selected = true;

    distance.value = "";
    here.checked = "checked";
    location.value = "";
    var res_div = document.getElementById("results_table");
    res_div.innerHTML="";
    var info_div = document.getElementById("info_table");
    info_div.innerHTML="";

    // clear the results in the table below whenever polpulated clearElement(searchResults);
}

async function call_ipapi(){
	var returned_data = await get_json('https://ipinfo.io/?token=e43d77bd882bf5');
    //console.log(returned_data['loc'].split(","));
    returned_data = returned_data['loc'].split(",")
    latitude = returned_data[0]
    longitude = returned_data[1]
    //console.log("latitude"+latitude+"longitude"+longitude)
    //TBD handle error case
    document.getElementById('search').disabled = false;

}

async function enable_location(){
    const location = document.getElementById("location");
    location.disabled = false;
}
async function disable_location(){
    const location = document.getElementById("location");
    location.disabled = true;
    call_ipapi();
}


async function call_gapi(){
    const location = document.getElementById("location");
    var location_string = location.value.trim()
    location_string = location_string.split(' ').join('+')
    console.log(location.value)
    console.log("https://maps.googleapis.com/maps/api/geocode/json?address="+location_string+"&key=AIzaSyC1IQkjNRBcenezJ8ukQEZXrXZe1t3I9jQ")

	const returned_data = await get_json("https://maps.googleapis.com/maps/api/geocode/json?address="+location.value+"&key=AIzaSyC1IQkjNRBcenezJ8ukQEZXrXZe1t3I9jQ");

    var returned_data1 = returned_data['results'][0]['geometry']['location'];
    latitude = returned_data1['lat'];
    longitude = returned_data1['lng'];
    console.log(latitude,longitude);
}
