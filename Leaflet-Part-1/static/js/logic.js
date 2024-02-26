
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(response => response.json())
  .then(data => {
    let earthquakes = data.features;
    let map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    earthquakes.forEach(earthquake => {
      let coords = earthquake.geometry.coordinates;
      let lon = coords[0];
      let lat = coords[1];
      let depth = coords[2];
      let mag = earthquake.properties.mag;

      let markerSize = mag * 5;

      let markerColor;
      if (depth < 10) {
        markerColor = '#1a9850'; //green
      } else if (depth < 30) {
        markerColor = '#91cf60'; //lightgreen
      } else if (depth < 50) {
        markerColor = '#d9ef8b'; //superlightgreen
      } else if (depth < 70) {
        markerColor = '#fee08b'; //yellow
      } else if (depth < 90) {
        markerColor = '#fc8d59'; //orange
      } else {
        markerColor = '#d73027'; //red
      }

      let circleMarker = L.circleMarker([lat, lon], {
        radius: markerSize,
        fillColor: markerColor,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      circleMarker.bindPopup(`Magnitude: ${mag}<br>Depth: ${depth} km`);
    });

    //legend
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      const depths = [0, 10, 30, 50, 70, 90];
      const colors = ['#1a9850', '#91cf60', '#d9ef8b', '#fee08b', '#fc8d59', '#d73027'];
      let labels = [];

      div.innerHTML += '<h4>Depth</h4>';

      // label + color loop
      for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
      }

      return div;
    };

    legend.addTo(map);

  });