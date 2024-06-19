<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Information</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            background-color: #f9f9f9;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
        }
        .form-group input {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
        }
        .form-group button {
            padding: 10px 15px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .form-group button:hover {
            background-color: #218838;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>User Information</h1>
        <?php
            // Database connection
            $con = new mysqli('localhost', 'root', '', 'sahayatri');

            if ($con->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }

            // Fetch user information
            $userId = 1; // Assuming we are fetching user with ID 1
            $sql = "SELECT fullName, email FROM signpu WHERE id = $userId";
            $result = $con->query($sql);

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $fullName = $row['name'];
                $email = $row['email'];
            } else {
                echo "No user found.";
                $con->close();
                exit();
            }

            // Update user information
            if ($_SERVER['REQUEST_METHOD'] == 'POST') {
                $newFullName = $_POST['name'];
                $newEmail = $_POST['email'];

                $updateSql = "UPDATE signpu SET full_name = '$newFullName', email = '$newEmail' WHERE id = $userId";
                if ($conn->query($updateSql) === TRUE) {
                    echo "Record updated successfully";
                    $fullName = $newFullName;
                    $email = $newEmail;
                } else {
                    echo "Error updating record: " . $conn->error;
                }
            }

            $conn->close();
        ?>

        <form method="POST" action="">
            <div class="form-group">
                <label for="full_name">Full Name</label>
                <input type="text" id="full_name" name="full_name" value="<?php echo htmlspecialchars($fullName); ?>" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email); ?>" required>
            </div>
            <div class="form-group">
                <button type="submit">Update</button>
            </div>
        </form>
    </div>
</body>
</html>
