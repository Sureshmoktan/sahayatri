<?php
require_once "./config/includes.php";

if (isset($_POST['logout'])) {
    session_destroy();
    header("Location: index.php");
}


?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/header.css">
    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="./css/footer.css">
    <!-- leaflet css  -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@v0.74.0/dist/L.Control.Locate.min.css" />

    <script src="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@v0.74.0/dist/L.Control.Locate.min.js" charset="utf-8"></script>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.74.4/dist/L.Control.Locate.min.css" />


    <link rel="stylesheet" href="./css/home.css">
    <script src="https://kit.fontawesome.com/fa042b9f9d.js" crossorigin="anonymous"></script>

    <!-- <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" /> -->

    <script src="https://kit.fontawesome.com/fa042b9f9d.js" crossorigin="anonymous"></script>

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="./js/map.js"></script>
    <!-- Leaflet JavaScript -->
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>


    <title>SahaYatri</title>
</head>

<body>
    <Header>
        <div class="navbar">
            <div class="logo"> <img src="./img/logo.png" alt="" height="90px" width="90px" class="logo"> </div>
            <ul>
                <li><a class="active" href="index.php">Home</a></li>
                <li><a href="#section1">About Us</a></li>
                <li><a href="#section2">Contact</a></li>
                <li><a href="#section3">Gallery </a></li>
            </ul>
        </div>
    </Header>

    <div class="search">
        <div class="search-box">
            <input type="text" class="search-in" placeholder="Search in SahaYatri"><i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <div class=""><?php if(isset($_SESSION["username"])){echo "<a href='add.php' class='auth-link'>Add Workshop</a>";} ?></div>
        <div class="log-in">
        
            <?php echo $_SESSION['username'] ?? '' ? "<a href='user.php' class='auth-link'>" . $_SESSION['username'] . " </a> | <form method='post'><button class='auth-link' type='submit' name='logout'>Logout</button></form>" : ' <a href="login.php" class="auth-link">Login </a> | <a  class="auth-link" href="signup.php"> Singup</a>'; ?>

        </div>


    </div>

    <div class="home">
        <div id="map"></div>
        <button id="track-button" style="background-color: lightgreen; font-size:20px; border-radius: 10px;
	margin-left: 650px; margin-top: 20px;">Track My Location</button>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
            // Initialize the map and set its view to Kathmandu
            var map = L.map('map', {
                scrollWheelZoom: false
            }).setView([27.7172, 85.3240], 13);

            // Add the OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Marker data (this is sample data, replace with your actual marker data)
            var markers = [{
                    lat: 27.7215,
                    lon: 85.3620,
                    name: "Baudah workshop 9818765544"
                },
                {
                    lat: 27.7166,
                    lon: 85.3485,
                    name: "cabahil workshop 98187672200"
                },
                {
                    lat: 27.7172,
                    lon: 85.3300,
                    name: "Suresh Bike and car workshop, 9800233433"
                },
                {
                    lat: 27.7100,
                    lon: 85.3240,
                    name: "Sagarmath Bike Hospital, 98182233445"
                },
                {
                    lat: 27.6950,
                    lon: 85.3150,
                    name: "Bike sudhar kendra  9811223344"
                }
            ];

            // Add all markers to the map
            markers.forEach(function(marker) {
                L.marker([marker.lat, marker.lon]).addTo(map).bindPopup(marker.name);
            });




            // Function to calculate distance between two points (Haversine formula)
            function getDistance(lat1, lon1, lat2, lon2) {
                var R = 6371e3; // metres
                var φ1 = lat1 * Math.PI / 180;
                var φ2 = lat2 * Math.PI / 180;
                var Δφ = (lat2 - lat1) * Math.PI / 180;
                var Δλ = (lon2 - lon1) * Math.PI / 180;

                var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                var d = R * c;
                return d;
            }

            // Track button click event
            document.getElementById('track-button').addEventListener('click', function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var userLat = position.coords.latitude;
                        var userLon = position.coords.longitude;

                        // Set map view to user's location
                        map.setView([userLat, userLon], 13);

                        // Add a circle around the user's location with a 3km radius
                        var userCircle = L.circle([userLat, userLon], {
                            color: 'blue',
                            fillColor: '#30f',
                            fillOpacity: 0.2,
                            radius: 3000
                        }).addTo(map);

                        // Add a marker for the user's location
                        L.marker([userLat, userLon]).addTo(map).bindPopup("You are here").openPopup();

                        // Add markers that are within 3km of the user's location
                        markers.forEach(function(marker) {
                            var distance = getDistance(userLat, userLon, marker.lat, marker.lon);
                            if (distance <= 3000) {
                                L.marker([marker.lat, marker.lon]).addTo(map).bindPopup(marker.name);
                            }
                        });
                    }, function() {
                        alert("Geolocation is not supported by this browser or permission denied.");
                    });
                } else {
                    alert("Geolocation is not supported by this browser.");
                }
            });
            // new add

            // Function to add a marker to the map
            function addMarker(name, lat, lng, contact) {
                L.marker([lat, lng]).addTo(map)
                    .bindPopup('<b>' + name + '</b><br>Contact: ' + contact)
                    .openPopup();
            }

            // Handle form submission
            document.getElementById('markerForm').addEventListener('submit', function(e) {
                e.preventDefault();
                var name = document.getElementById('name').value;
                var lat = parseFloat(document.getElementById('latitude').value);
                var lng = parseFloat(document.getElementById('longitude').value);
                var contact = document.getElementById('contact').value;
                addMarker(name, lat, lng, contact);
                map.setView([lat, lng], 13); // Optionally, move the map to the new marker
            });
        </script>





    </div>
    <section1 id="section1">
        <div class="about">
            <div class="about-content">

                <h2>Who We Are ?</h2> <br>
                <p class="about-text">At SahaYatri, we understand that life's journey can sometimes hit unexpected
                    roadblocks. That's why
                    we've created a platform dedicated to ensuring you get back on the road swiftly and safely.
                    SahaYatri is
                    not just a service; it's your reliable companion in times of vehicular trouble.
                </p>
                <h3>Our Mission</h3> <br>
                <p class="about-text"> Our mission is simple yet powerful - to provide instant access to skilled and
                    trustworthy mechanics
                    whenever and wherever you need them. We strive to transform the way you deal with unexpected
                    breakdowns,
                    making the entire experience seamless, stress-free, and efficient.</p> <br>

                <h2>What Sets Us Apart</h2> <br>
                <h3> Expert Mechanics, On-Demand</h3>

                <p class="about-text">SahaYatri brings a network of expert mechanics right to your fingertips. No more
                    frantic phone calls or
                    long waits by the roadside. With just a few clicks, you can have a skilled mechanic on their way to
                    your
                    location, ready to diagnose and fix the issue promptly.</p> <br>

                <h3> Trust and Transparency</h3>
                <p class="about-text"> We believe in building lasting relationships with our users. That's why we
                    prioritize trust and
                    transparency in every aspect of our service. From upfront pricing to detailed service reports,
                    you'll
                    always know what to expect when you choose SahaYatri.</p> <br>

                <h3>24/7 Support</h3> <br>
                <p class="about-text">Roadside troubles don't adhere to a schedule, and neither do we. Our 24/7 customer
                    support is here to
                    assist you whenever you need it. Whether it's a flat tire at dawn or an engine malfunction at
                    midnight,
                    SahaYatri is just a call away.</p> <br>

                <h3>Our Promise</h3> <br>
                <p class="about-text">SahaYatri is more than a platform; it's a promise to be there for you when you
                    need assistance the most.
                    We understand the importance of keeping your journey smooth, and we're committed to ensuring that
                    you
                    get back on the road with confidence.
                </p>
            </div>
            <div class="about-pic">
                <div class="about-pic-one">

                </div>

                <div class="about-pic-two">
                    <img src="" alt="">
                </div>
            </div>

        </div>
    </section1>

    <section id="section2">
        <div class="contact">


            <h1> We're here to assist you 24/7</h1> <br>
            <h2> General Inquiries:</h2>
            <p class="contact-text">Have a question about our services or need more information? Our dedicated team is
                ready
                to assist you. Feel
                free to drop us an email or give us a call. <br>
                <b> Email: info@sahayatri.com <Br>
                    Phone: +1-123-456-7890</b>
            </p>



            <div class="container">

                <div class="card">
                    <h2>Customer Support:</h2>
                    <p>
                        For any issues or concerns regarding the services you've received, our customer support team is
                        here
                        to help. <br>
                        <b> Customer Support Email: support@sahayatri.com </b><br><b>Customer Support Hotline:
                            +1-876-543-2109</b>
                    </p>
                </div>
                <div class="card">
                    <h2>Emergency Roadside Assistance:</h2>
                    <p>
                        If you're in need of immediate roadside assistance, our support team is available around the
                        clock
                        to connect you with a skilled mechanic. <br>

                        <b> Emergency Hotline: +1-987-654-3210</b>
                    </p>
                </div>
                <div class="card">
                    <h2>Visit Us</h2>
                    <p>
                        Want to meet us in person or send us something by mail? <br>
                        <b> Here's our office address:
                            SahaYatri Headquarters123 Roadside LaneCityville,Bagmati Kathmandu </b>
                    </p>
                </div>
            </div>




            <div class="container">

                <div class="card">
                    <h2>Feedback and Suggestions</h2>
                    <p>
                        We value your feedback and are always looking for ways to improve. Share your thoughts and
                        suggestions with us at <b>feedback@sahayatri.com.</b> <br>

                        Feel free to reach out to us through any of the above channels, and we'll make sure to assist
                        you
                        promptly. Your journey matters to us!</p>
                </div>
                <div class="card">
                    <h2>Connect With Us Online</h2>
                    <p>
                        Stay updated on the latest news, tips, and announcements by following us on social media: <br>
                        Facebook: facebook.com/SahaYatri <br>
                        Twitter: twitter.com/SahaYatriOfficial <br>
                        Instagram: instagram.com/SahaYatri</p>
                </div>

            </div>



        </div>
    </section>

    <section id="section3">
        <div class="gallery">
            <h1> Explore SahaYatri Moments</h1> <br>
            <h2> Welcome to the SahaYatri Gallery,</h2>
            <p class="gallery-text"> Where we capture the moments that define our commitment to providing seamless
                roadside
                assistance. Scroll
                through the images below to get a glimpse of our dedicated mechanics in action, satisfied customers, and
                the
                essence of what makes SahaYatri your trusted roadside companion.</p>
            <br>

            <div class="container">


                <div class="card-gallery" style="background-image: url(./img/g1.jpg);">

                </div>

                <div class="card-gallery" style="background-image: url(./img/g2.jpg);">

                </div>

                <div class="card-gallery" style="background-image: url(./img/g3.jpg);">

                </div>
            </div>

            <div class="container">
                <div class="card-gallery" style="background-image: url(./img/g4.jpg);">

                </div>

                <div class="card-gallery" style="background-image: url(./img/g5.jpg);">

                </div>

                <div class="card-gallery" style="background-image: url(./img/g6.jpg);">

                </div>
            </div>

        </div>
    </section>


    <footer class="foot-er">
        <div class="footer">

            <div class="logo"> <img src="./img/logo.png" alt="" height="90px" width="90px" class="logo"> </div>

            <div class="ccare">
                <a href="#section2" class="foot">Coustomer Care</a> <br>
                <a href="#section1" class="foot">About Our Platform</a> <br>
            </div>

            <div class="fsign">
                <a href="signup.php" class="foot">SignUp</a> <br>
                <a href="" class="foot">Accout</a><br>
            </div>

            <div class="flinks">
                <a href="#section1 " class="foot">About Us</a> <br>
                <a href="#section2" class="foot"> Contact</a> <br>
                <a href="#section3" class="foot">Gallary</a> <br>
            </div>



        </div>
        <hr class="white-line">

        <div class="ficon">
            <a href=""><i class="fa-brands fa-facebook footiconf"></i></a>
            <a href=""><i class="fa-brands fa-linkedin footiconl"></i></a>
            <a href=""><i class="fa-brands fa-instagram footiconi"></i></a>
            <a href=""><i class="fa-brands fa-twitter footicont"></i></a> <br>
            <a href="" class="foot"><i class="fa-regular fa-copyright"></i> @SahaYatri</a>
        </div>

    </footer>



</body>



</html>