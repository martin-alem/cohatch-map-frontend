/**
 * Gets the value of a select input element
 * @param {Event} e HTMLDOM event
 * @returns return the value of the select input element
 */
export const getSelectedValue = e => {
  const selectedIndex = e.target.options.selectedIndex;
  const option = e.target.options[selectedIndex];
  return option.value;
};

/**
 * Makes an api call to backend
 * @param {String} endpoint backend api endpoint
 * @returns a promise
 */
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

/**
 * Asynchronously gets the user's geographical location
 * @param {Function} success function to be call when promise fulfills
 * @param {Function} error function to be call when promise rejects
 */
export const getCurrentPosition = (success, error) => {
  navigator.geolocation.getCurrentPosition(success, error);
};

/**
 * Picks a random element from the array
 * @param {Array} array array
 * @returns The randomly picked element
 */
export const pickRandom = array => {
  const len = array.length;
  const random = Math.floor(Math.random() * len);
  return array[random];
};

/**
 * Generated random HEX colors
 * @returns a string representing a HEX color
 */
const randomHexColor = () => {
  const hex = ["A", "B", "C", "D", "E", "F", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let color = "#";

  for (let i = 0; i < 3; i++) {
    const randomChar = pickRandom(hex);
    color += `${randomChar}`;
  }

  return color;
};

/**
 * Renders a place or multiple places on google's map
 * @param {Array} arrayOfCoordinates array of geographical coordinates
 */
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

    const randomStrokeColor = randomHexColor();
    const randomFillColor = randomHexColor();
    new google.maps.Circle({
      strokeColor: randomStrokeColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: randomFillColor,
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

/**
 * Filters the response by extracting the location and viewport coordinates
 * @param {Array} arrayOfPlaces An array of places return from places api
 * @returns An array of geographical coordinates
 */
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

/**
 * Handles the response return from fetch call
 * @param {FetchResponse} response response return from fetch call
 * @param {Array} places array to hold the currently fetched places
 * @param {Number} numberOfMarkups number of markups
 * @param {Boolean} nearMe Determine if the request was near me request
 */
export const handleResponse = async (response, numberOfMarkups, nearMe) => {
  if (response.ok) {
    const jsonResponse = await response.json();
    const { results } = jsonResponse.payload;
    const arrayOfCoordinates = filterPlaces(results);
    if (numberOfMarkups === "single" && nearMe === false) {
      renderMap([arrayOfCoordinates[0]]);
    } else {
      renderMap(arrayOfCoordinates);
    }
    return arrayOfCoordinates;
  } else {
    console.error(response);
    return [];
  }
};
