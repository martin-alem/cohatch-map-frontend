export const getSelectedValue = e => {
  const selectedIndex = e.target.options.selectedIndex;
  const option = e.target.options[selectedIndex];
  return option.value;
};

export const makeAPIRequest = endpoint => {
  const url = `http://localhost:8080/api/v1/${endpoint}`;
  const init = {
    headers: {
      Accept: "application/json",
    },
    mode: "cors",
    method: "GET",
  };

  return window.fetch(url, init);
};

export const getCurrentPosition = (success, error) => {
  navigator.geolocation.getCurrentPosition(success, error);
};

export const renderMap = arrayOfCoordinates => {
  if (!Array.isArray(arrayOfCoordinates) && arrayOfCoordinates.length > 0) throw new TypeError("Invalid coordinates: Must be an Array with at least one coordinate");

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: arrayOfCoordinates[0].location,
  });

  for (const coordinates of arrayOfCoordinates) {
    const marker = new google.maps.Marker({
      position: coordinates.location,
      map: map,
    });

    // const { northeast, southwest } = coordinates.viewport;
    // const bounds = new google.maps.LatLngBounds(northeast, southwest);
    // const rectangle = new google.maps.Rectangle({
    //   strokeColor: "#FF0000",
    //   strokeOpacity: 0.8,
    //   strokeWeight: 2,
    //   fillColor: "#FF0000",
    //   fillOpacity: 0.35,
    //   map,
    //   bounds,
    // });

    const cityCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center: coordinates.location,
      radius: 1000,
    });

    marker.addListener("click", e => {
      const { lat, lng } = e.latLng;
      console.log(lat(), lng());
    });
  }
};

export const filterPlaces = arrayOfPlaces => {
  const arrayOfCoordinates = [];
  for (const place of arrayOfPlaces) {
    const { geometry } = place;
    const { location, viewport } = geometry;
    const aPlace = { location, viewport };
    arrayOfCoordinates.push(aPlace);
  }
  return arrayOfCoordinates;
};

export const pickRandom = array => {
  const len = array.length;
  const random = Math.floor(Math.random() * len);
  return array[random];
};
