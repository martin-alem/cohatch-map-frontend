import { makeAPIRequest, getSelectedValue, getCurrentPosition, pickRandom, handleResponse } from "./util.js";

(function () {
  const numberOfMarkupInput = document.querySelector("#markup");
  const categoryInput = document.querySelector("#category");
  const nearMeInput = document.querySelector("#near_me");
  const searchButton = document.querySelector("#search");

  //Search variables
  let numberOfMarkups = "single";
  let category = "shop";

  //current position
  let longitude = null;
  let latitude = null;

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

  /**
   * Handles when the user clicks the search button.
   * Uses the category value.
   */
  async function handleSubmit() {
    let endpoint = `place?query=${category}&type=${category}`;
    if (latitude && longitude) {
      endpoint = `place?query=${category}&location=${latitude},${longitude}&type=${category}`;
    }
    const response = await makeAPIRequest(endpoint);
    places = await handleResponse(response, numberOfMarkups, false);
  }

  /**
   * Executes when the user select a near me option
   * It uses the current search places by picking a random
   * And determining the location of the other places
   */
  async function handleFilterChange() {
    const radius = 16093;
    const { location } = pickRandom(places);
    const { lat: latitude, lng: longitude } = location;
    const endpoint = `place?query=${category}&location=${latitude},${longitude}&type=${category}&radius=${radius}`;
    const response = await makeAPIRequest(endpoint);
    places = await handleResponse(response, numberOfMarkups, true);
    nearMeInput.selectedIndex = 0;
  }

  /**
   * Executes on application load.
   * uses the default search variables
   */
  async function init() {
    let endpoint = `place?query=${category}&type=${category}`;
    if (latitude && longitude) {
      endpoint = `place?query=${category}&location=${latitude},${longitude}&type=${category}`;
    }
    const response = await makeAPIRequest(endpoint);
    places = await handleResponse(response, numberOfMarkups, false);
  }

  //Get users location on application load
  getCurrentPosition(
    position => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      init();
    },
    error => {
      init();
      console.error(error);
    }
  );
})();
