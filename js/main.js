mapboxgl.accessToken ='pk.eyJ1Ijoia25lbDIiLCJhIjoiY21rdTlkYmx5MThyZjNmcHVrMDYzdXJ4dyJ9.HrXpvWOlXxo7fGCGnGQG6A';

// declare the map object
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 7,
    minZoom: 5,
    center: [-120.7401, 47.7511]
});

let firesChart = null;
    magnitude = {},
    numFires = 0


const grades = [10,50,300],
colors = ['rgb(208,209,230)', 'rgb(103,169,207)', 'rgb(1,108,89)'],
radii = [5, 10, 20]

// const legend = document.getElementById('legend');

// let labels = ['<strong>Magnitude</strong>'],vbreak;

// for(var i = 0; i < grades.length; i++) {

//     vbreak = grades[i];
//     dot_radii = 2 * radii[i];
//     labels.push(
//         '<p class = "break"><i class = "dot" style = "background"' + colors[i] + '; width: ' + dot_radii +
//         'px; height: ' + dot_radii + 'px; "> <span class = "dot-label" style = "top: ' + dot_radii / 2 + 'px;"' + vbreak + '</span></p>');

//     }

async function geojsonFetch() {
    let response;
    response = await fetch('assets/DNR_Fire_Statistics_2008-Present.geojson');
    fires = await response.json();
    map.on('load', () => {

        map.addSource('fires', {
            type: 'geojson',
            data: fires
        });


        map.addLayer({
                'id': 'fire-point',
                'type': 'circle',
                'source': 'fires',
                'minzoom': 5,
                'paint': {

                    'circle-radius': {
                        'property': 'ACRES_BURNED',
                        'stops': [
                            [grades[0], radii[0]],
                            [grades[1], radii[1]],
                            [grades[2], radii[2]]
                        ]
                    },
                    'circle-color': {
                        'property': 'ACRES_BURNED',
                        'stops': [
                            [grades[0], colors[0]],
                            [grades[1], colors[1]],
                            [grades[2], colors[2]]
                        ]
                    },
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.6
                }
            },
        );


        map.on('click', 'fire-point', (event) => {
            new mapboxgl.Popup()
                //console.log(event.features[0].geometry.coordinates)
                .setLngLat(event.features[0].geometry.coordinates)

                // console.log(event.features[0].properties.ACRES_BURNED)
                .setHTML(`<strong>Magnitude:</strong> ${event.features[0].properties.ACRES_BURNED}`)
                .addTo(map)
        });

        magnitudes = calFires(fires, map.getBounds());
        console.log(magnitudes);

        numFires = magnitudes[10] + magnitudes[50] + magnitudes[300];
        console.log(magnitudes[10])
        console.log(magnitudes[50])
        console.log(magnitudes[300])
        console.log(numFires)
        // console.log(magnitudes[300])
        // console.log(numFires)

        x = Object.keys(magnitudes);
        x.unshift('ACRES_BURNED');

        document.getElementById('fires-count').innerHTML = numFires
        y = Object.keys(magnitudes);
        y.unshift('#')
        console.log(x)
        console.log(y);
        firesChart = c3.generate({

            size: {
                height: 350,
                width: 460
            },
            data: {
                columns: [["Proportion10", magnitudes[10]],
                        ["Proportion50", magnitudes[50]],
                        ["Proportion300", magnitudes[300]]
                ],

                type: 'pie',
                colors: {
                    '#': (d) => {
                        return colors[d['x']];
                    }

                },
            onclick: function (d, i) {
                console.log("onclick", d, i);
                },
            },
            bindto: "#fires-chart"
        })

        map.on('idle', () => { //simplifying the function statement: arrow with brackets to define a function

        magnitudes = calFires(fires, map.getBounds());
        numFires = magnitudes[10] + magnitudes[50] + magnitudes[300];
        document.getElementById("fires-count").innerHTML = numFires;


        x = Object.keys(magnitudes);
        x.unshift("ACRES_BURNED")
        y = Object.values(magnitudes);
        y.unshift("#")

        // after finishing each map reaction, the chart will be rendered in case the current bbox changes.
        firesChart.load({
            columns: [x, y]
        });
    });
    });
}

geojsonFetch();

function calFires(currentFires, currentMapBounds) {
    let fireClasses = {
        10: 0,
        50: 0,
        300: 0
    };
    currentFires.features.forEach(function (d) {
        if (currentMapBounds.contains(d.geometry.coordinates)) {
                //  console.log(d.properties.ACRES_BURNED)
            fireClasses[Math.floor(d.properties.ACRES_BURNED)] += 1;

        }

    })
    return fireClasses;
}

const reset = document.getElementById('reset');
reset.addEventListener('click', event => {
    map.flyTo({
        zoom: 5,
        center: [-120.7401, 47.7511]
    })

    map.setFilter('fire-point', null);
})