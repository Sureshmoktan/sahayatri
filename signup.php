<?php
require 'connection.php';

if(isset($_POST["submit"])){
  $name = $_POST["username"];
  $email = $_POST["email"];
  $password = $_POST["password"];
  $query = "INSERT INTO signpu (fullName,email,password) VALUES('$name','$email','$password')";
  $result=mysqli_query($con,$query);
  
  
  if($result){
    echo
    "
    <script> alert('Data Inserted Successfully'); </script>
    ";
    header('Location:./login.php');
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

    <script src="./js/123.js"></script>

    <title>Sign Up</title>
</head>

<body>

    <div class="signup">
        <div class="container">
        
            <form id="form" method="POST" onsubmit="return validateInputs();">
                <h1>Sign Up</h1>
                <div class="input-control">
                    <label class="lable" for="username">Full Name</label>
                    <input id="username" name="username" type="text">
                    <div class="error"></div>
                </div>
                <div class="input-control">
                    <label class="lable" for="email">Email</label>
                    <input id="email" name="email" type="text">
                    <div class="error"></div>
                </div>
                <div class="input-control">
                    <label class="lable" for="password">Password</label>
                    <input id="password" name="password" type="password">
                    <div class="error"></div>
                </div>
                <div class="input-control">
                    <label class="lable" for="password2">Confirm Password </label>
                    <input id="password2" name="password2" type="password">
                    <div class="error"></div>
                </div>
                <button type="submit" name="submit" class="button">Sign Up</button>
                <p>Already have an account? <a href="Login.php">Login</a></p>
            </form>
        </div>


    </div>




</body>


</html>