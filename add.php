<?php
require 'connection.php';

if(isset($_POST["submit"])){
  $name = $_POST["wname"];
  $latitude = $_POST["Latitude"];
  $longitude = $_POST["Longitude"];
  $query = "INSERT INTO workshop (name,Latitude,Longitude) VALUES('$name','$latitude','$longitude')";
  $result=mysqli_query($con,$query);
  
  
  if($result){
    echo
    "
   alert('Workshop Inserted Successfully'); 
    ";
    header('Location:./index.php');
  }
  
}
?>




<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/signup.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">

    

    <title>Sign Up</title>
</head>

<body>

    <div class="signup">
        <div class="container">
        
            <form id="form" method="POST" onsubmit="return validateForm();">
                <h1>Sign Up</h1>
                <div class="input-control">
                    <label class="lable" for="wname">Workshop Name</label>
                    <input id="wname" name="wname" type="text">
                    <div class="error"></div>
                </div>
                <div class="input-control">
                    <label class="lable" for="Latitude">Latitude</label>
                    <input id="Latitude" name="Latitude" type="float">
                    <div class="error"></div>
                </div>
                <div class="input-control">
                    <label class="lable" for="Longitude">Longitude</label>
                    <input id="Longitude" name="Longitude" type="float">
                    <div class="error"></div>
                </div>
                
                <button type="submit" name="submit" class="button">Add Workshop</button>
                
            </form>
        </div>


    </div>




</body>
<script src="./js/12.js"></script>


</html>