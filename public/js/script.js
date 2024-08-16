//initialises socket io , and sends a connection req at backend
const socket = io();

//checking if browser supports geolocation
if(navigator.geolocation){ 
    //gives current altitudes
    navigator.geolocation.watchPosition((position)=>{
       const { longitude, latitude } = position.coords;
       
       //trigerring a send-location event
        socket.emit("send-location", {longitude, latitude});
    },
    (err)=> { console.log(err);},
    {
        enableHighAccuracy:true,
        timeout:3000,  // it watches lcatio after every 4sec
        maximumAge:0,  // no storing of data , no caching
    });
    
}

//leaflet map [long, lat] , zoom
const map=L.map("map").setView([0,0], 3)

// view of map
L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,{
    attribution:'Ritik'
}).addTo(map);

//creating markers
const markers =[];

// receving back location
socket.on("receive-location",(data)=>{
    const {longitude, latitude, id} = data;
    map.setView([latitude, longitude], 15);

    //already having marker with particular socket
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]); //setting location af marker
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);  //creating new marker and adding it to map
    }
    console.log(markers);
})

socket.on("user-disconnect", (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]); // removing from map
        delete markers[id]; //deleting marker 
    }
})

