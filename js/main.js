mapboxgl.accessToken ='pk.eyJ1Ijoia25lbDIiLCJhIjoiY21rdTlkYmx5MThyZjNmcHVrMDYzdXJ4dyJ9.HrXpvWOlXxo7fGCGnGQG6A';

// declare the map object
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 5, // starting zoom
    minZoom: 5,
    center: [-96, 37] // starting center
});

const grades = [4,5,6],
colors = ['rgb()', 'rgb()', 'rgb()'],
radii = [5, 10, 20]

const legend = document.getElementById('legend');

let labels = ['<strong>Magnitude</strong>'],vbreak;

for(var i = 0; i < grades.length; i++) {
    console.log("hi")
    vbreak = grades[i];
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class = "break"><i class = "dot" style = "background"' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' + dot_radii + 'px; "> <span class = "dot-label" style = "top: ' + dot_radii / 2 + 'px;"' + vbreak + '</span></p>');

    }


async function geojsonFetch() {
 console.log("hello")
    let response;
    response = await fetch('assets/DNR_Fire_Statistics_2008-Present.geojson');
    fires = await response.json();

    map.on('load', () => {

        map.addSource('fires', {
            type: 'geojson',
            data: fires
        })

        map.addLayer({
            'id': 'fires-point',
            'type': 'circle',
            'source': 'fires',
            'minzoom': 5,
            'paint':{
                'circle-radius': {
                    'property' : 'mag',
                    'stops':[
                        [grades[0], colors[0]],
                        [grades[1], colors[1]],
                        [grades[2], colors[2]],
                        [grades[0], colors[0]],
                    ]
                },
                'circle-stroke-color' : 'white',
                'circle-stroke-width': 1,
                'circle-opacity': 0.6
            }
        },
        'waterway-label'
    )
    })
    map.on('click', 'fires-point', (event) => {
        new mapboxgl.Popup()
            .setlngLat(event.features[0].geometry.coordinates)
            print(features[0].geometry.coordinates)
    })
}

