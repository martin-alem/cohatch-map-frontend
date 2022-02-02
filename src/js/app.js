import { makeAPIRequest, getSelectedValue, getCurrentPosition, renderMap, filterPlaces, pickRandom } from "./util.js";

(function () {
  const numberOfMarkupInput = document.querySelector("#markup");
  const categoryInput = document.querySelector("#category");
  const nearMeInput = document.querySelector("#near_me");
  const searchButton = document.querySelector("#search");

  //Search variables
  let numberOfMarkups = "single";
  let category = "shop";

  //current position
  let longitude = 0;
  let latitude = 0;

  let places = [];

  numberOfMarkupInput.addEventListener("change", e => {
    if (getSelectedValue(e) !== "") {
      numberOfMarkups = getSelectedValue(e);
    }
  });

  categoryInput.addEventListener("change", e => {
    if (getSelectedValue(e) !== "") {
      category = getSelectedValue(e);
    }
  });

  nearMeInput.addEventListener("change", e => {
    const nearMe = getSelectedValue(e);
    if (nearMe === "yes") {
      handleFilterChange();
    } else {
      init();
    }
  });

  searchButton.addEventListener("click", handleSubmit);

  async function handleSubmit() {
    let endpoint = `place?query=${category}&location=${latitude},${longitude}&type=${category}`;

    const response = await makeAPIRequest(endpoint);
    if (response.ok) {
      const jsonResponse = await response.json();
      const { results } = jsonResponse.payload;
      const arrayOfCoordinates = filterPlaces(results);
      places = arrayOfCoordinates;
      if (numberOfMarkups === "single") {
        renderMap([arrayOfCoordinates[0]]);
      } else {
        renderMap(arrayOfCoordinates);
      }
    } else {
      console.error(response);
    }
  }

  async function handleFilterChange() {
    const radius = 16093;
    const { location } = pickRandom(places);
    const { lat: latitude, lng: longitude } = location;
    const endpoint = `place?query=${category}&location=${latitude},${longitude}&type=${category}&radius=${radius}`;

    const response = await makeAPIRequest(endpoint);
    if (response.ok) {
      const jsonResponse = await response.json();
      const { results } = jsonResponse.payload;
      const arrayOfCoordinates = filterPlaces(results);
      places = arrayOfCoordinates;
      if (numberOfMarkups === "single") {
        renderMap([arrayOfCoordinates[0]]);
      } else {
        renderMap(arrayOfCoordinates);
      }
    } else {
      console.error(response);
    }
  }

  async function init() {
    const endpoint = `place?query=${category}&location=${latitude},${longitude}&type=${category}`;

    const response = await makeAPIRequest(endpoint);
    if (response.ok) {
      const jsonResponse = await response.json();
      const { results } = jsonResponse.payload;
      const arrayOfCoordinates = filterPlaces(results);
      places = arrayOfCoordinates;
      if (numberOfMarkups === "single") {
        renderMap([arrayOfCoordinates[0]]);
      } else {
        renderMap(arrayOfCoordinates);
      }
    } else {
      console.error(response);
    }
  }

  //Get users location on application load
  getCurrentPosition(
    position => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      // init();
    },
    error => console.error(error)
  );
})();
