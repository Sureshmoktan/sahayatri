<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/dash.css">
    <script src="https://kit.fontawesome.com/fa042b9f9d.js" crossorigin="anonymous"></script>
    <title>Workshop</title>
</head>

<body>

    <div class="dash">
        <header>
            <div class="header">
                <div class="logo">

                </div>

                <div class="logout">
                    <a href="login.php"> <i class="fa-solid fa-right-from-bracket logout"></i></a>
                </div>
            </div>

            <div class="content">
                <div class="side">
                    <a href="index.php"> <i class="fa-solid fa-house-chimney sidei"></i></a> <br>
                    <a href="./dashboard.php"><i class="fa-solid fa-user sideuser"></i></a>
                    <i class="fa-solid fa-shop sideuser"></i>
                </div>

                <div class="user">

                    <h2>User Data</h2>
                    <?php
                    include('./connection.php');
                    $sql = "SELECT id, name, Latitude, Longitude  FROM workshop ";
                    $result = $con->query($sql);
                    
                    if ($result->num_rows > 0) {
                        echo "<table>";
                        echo "<tr><th>ID</th><th>Full Name</th><th>Latitude</th><th>Langitude</th><th>Action</th></tr>";
                        // Output data of each row
                        while ($row = $result->fetch_assoc()) {
                            echo "<tr><td>" . $row["id"] . "</td><td>" . $row["name"] . "</td><td>" . $row["Latitude"] . "</td><td>" . $row["Longitude"] .   "</td> <td><a href='workshop.php?delete_id=" . $row["id"] . "'>Delete</a></td></tr>" ;
                        }
                        echo "</table>";
                    } else {
                        echo "0 results";
                    }
                    $con->close();
                    ?>
                    <?php
                    include('./connection.php');
                    if (isset($_GET['delete_id'])) {
                        $delete_id = $_GET['delete_id'];
                        $sql_delete = "DELETE FROM workshop WHERE id=$delete_id";
                        if ($con->query($sql_delete) === TRUE) {
                            echo "Record deleted successfully";
                            header('Location:./workshop.php');
                        } else {
                            echo "Error deleting record: " . $con->error;
                        }
                    }


                    ?>


                </div>

            </div>
        </header>



    </div>

</body>

</html>