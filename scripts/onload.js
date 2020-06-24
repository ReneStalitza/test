/*
 * Basic on-load functionality for the application. 
 * Loads all trees from data, displays those which are relevant (= close enough) to the current position. 
 */
var places;
// Set max/min coordinates to interact in a smaller area TODO: change to var values
var maxLat = 51.968956;
var minLat = 51.962976;
var maxLon = 7.636953;
var minLon = 7.620886;

var active;

window.onload = () => {
    fetch('https://raw.githubusercontent.com/snavas/InteractionWithGeoinformation/master/assets/osmtrees.geojson')
        .then(response => response.json())
        .then(data => places = data);

    setTimeout(() => {
        scene = document.querySelector('a-scene');
        places.features.forEach((place) => {
            const latitude = place.geometry.coordinates[1];
            const longitude = place.geometry.coordinates[0];
            const species = place.species;
            // just add trees of selected area
            if (latitude < maxLat && latitude > minLat && longitude < maxLon && longitude > minLon) {
                var array = [];
                
                const icon = document.createElement('a-text');
                icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
                icon.setAttribute('look-at', '[gps-camera]');
                icon.setAttribute('clickable','');
                icon.setAttribute('description', '');
                icon.setAttribute('scale', '10 10 10');
                icon.setAttribute('geometry', 'primitive: ring; radiusInner: 0.11; radiusOuter: 0.14');
                icon.setAttribute('align', 'center');
                if (species == "" || species == undefined) {
                    icon.setAttribute('species', rdmSpecies());
                } else {
                    icon.setAttribute('species', species);
                }
               // console.log(icon.getAttribute('species'));
                checkIfEndangered(icon);
                scene.appendChild(icon);
            } else {};
        });
        distanceMsg = document.querySelector('[gps-entity-place]').getAttribute('distance');
    }, 3000);
};


function openInfobox() {
    let infobox = document.querySelector("#infobox");
    infobox.classList.toggle("opened");
    let button = document.querySelector(".button-in");
    button.classList.toggle("open");
}

 AFRAME.registerComponent('clickable', {
            init: function(){
                let el = this.el;
                
                // set color on click dependent on index component
                el.addEventListener('click', e =>{ 
                
                 el.setAttribute('geometry', 'radiusOuter: 0.2');
                 if(active == "" || active == undefined){
                 }
                 else{
                     active.setAttribute('geometry', 'radiusOuter: 0.14' );
                 };
                    
                    active = el; 
                   
                   document.getElementById('treeSpecies').innerHTML= el.getAttribute('species');
                   
                  document.getElementById("myList").innerHTML='';
                  let len = el.components.description.data.length;
                   if(len > 0){ 
                       for(var i =0; i < len; i++ ){
                           document.getElementById("myList").appendChild(el.components.description.data[i]);
                    }
                   }
                    else {
                        document.getElementById("myList").innerHTML='';
                    }
            
                });
             }
      });

AFRAME.registerComponent('description', {
    schema: {type: 'array', default:[]}
      });


function addInfo() {
  var node = document.createElement("LI");
  var text = document.getElementById('des').value;
  console.log(active);
  var textnode = document.createTextNode(text);
  node.appendChild(textnode);
  document.getElementById("myList").appendChild(node);
  
  active.components.description.data.push(node);
    
  document.getElementById('des').value = "";
}


/*
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
    
    document.getElementById("info").innerHTML =`Latitude : ${crd.latitude} Longitude: ${crd.longitude} max: ${crd.longitude + 0.5} ` ;
  
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

*/
