function validateForm() {
    // Get the values from the form fields
    const name = document.getElementById('wname').value;
    const latitude = document.getElementById('Latitude').value;
    const longitude = document.getElementById('Longitude').value;

    // Regular expression to validate latitude and longitude
    const latLongRegex = /^-?([1-8]?[0-9](\.\d+)?|90(\.0+)?),\s*-?(180(\.0+)?|((1[0-7][0-9])|([1-9]?[0-9]))(\.\d+)?)$/;

    // Name validation: check if it's empty
    if (name.trim() === "") {
        alert("Name is required.");
        return false;
    }

    // Latitude validation: check if it's a valid number within range
    if (!isValidLatitude(latitude)) {
        alert("Please enter a valid latitude between -90 and 90.");
        return false;
    }

    // Longitude validation: check if it's a valid number within range
    if (!isValidLongitude(longitude)) {
        alert("Please enter a valid longitude between -180 and 180.");
        return false;
    }

    // If all validations pass
    return true;
}

function isValidLatitude(lat) {
    const num = parseFloat(lat);
    return !isNaN(num) && num >= -90 && num <= 90;
}

function isValidLongitude(lon) {
    const num = parseFloat(lon);
    return !isNaN(num) && num >= -180 && num <= 180;
}
