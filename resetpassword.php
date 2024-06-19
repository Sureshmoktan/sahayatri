<?php
// Assuming you have a database connection
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'sahayatri';

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];

    // Query to check if email exists in the database
    $query = "SELECT * FROM signpu WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Email found, generate a new password
        $newPassword = generateRandomString(10); // Function to generate random password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        // Update user's password in the database
        $updateQuery = "UPDATE users SET password = ? WHERE email = ?";
        $stmt = $conn->prepare($updateQuery);
        $stmt->bind_param("ss", $hashedPassword, $email);
        $stmt->execute();

        // Send the new password to the user's email (not implemented in this example)
        // In a real application, you would send an email to the user with the new password.

        $response = array('success' => true, 'message' => 'New password generated and sent to your email.');
    } else {
        // Email not found
        $response = array('success' => false, 'message' => 'Email does not exist in our database.');
    }

    echo json_encode($response);
}

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
?>
