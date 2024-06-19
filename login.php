<?php
session_start();
include("connection.php");



if (isset($_POST['submit'])) {
    $email=$_POST['email'];
    $password =$_POST['password'];
    
    // $sql = "SELECT * FROM signpu WHERE email= 'moktansulove7@gmail.com' AND password ='123456789'";
    
    if($email=='admin@gmail.com' && $password=='suresh@123'){
        echo "Hello";
        header('Location:./index.php');
    }else{
        $sql = "SELECT * FROM signpu WHERE email= '$email' AND password ='$password'";
        $result = mysqli_query($con,$sql);
        $row = mysqli_fetch_array($result, MYSQLI_ASSOC);  
        $count = mysqli_num_rows($result);  
        
          
        if($count == 1){  
    
    
     
            session_start();
            $_SESSION['username'] = $row['fullName'];
            header('Location:./index.php');
        }  else{
            $message = "Invalid try again!";
        }
           
    }

}
   
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/login.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">

    <title>Login</title>
    <script src="./js/test123.js"></script>
   
</head>

<body>

    <div class="signup">
        <div class="container">
               
                <form class="login_form"  method="post" onsubmit="return sig();">
                <h1>SahaYatri</h1>
                
                <h2>Login</h2>
                <div class="input-control">
                    <label class="lable" for="email">Email</label>
                    <input id="email" name="email" type="email"/>
                    <div class="error"></div>
                </div>
                <div class="input-control">
                    <label class="lable" for="password">Password</label>
                    <input id="password" name="password" type="password"/>
                    <div class="error"></div>
                </div>
                <div class="error" style="text-align: center;color:red;font-size:15px"><?php  if(isset($message)): ?>
        <div id="message">
            <?php echo $message; ?>
            <script type="text/javascript">
                // Call the JavaScript function to hide the message
                hideMessage();
            </script>
        </div>
    <?php endif; ?> </div>
                   
                    <input type="submit" name="submit" value="Login">
                    <p ><a href="./forgot.php" class="forgot">Forgot Password?</a></p>

                    <p>Do not have an account? <a href="signup.php">Signup</a></p>
                </form>

               
        </div>
    </div>



    </div>



    
</body>

</html>