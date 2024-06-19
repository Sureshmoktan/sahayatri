<nav class="row ">

    <div class="logo col">
        <h1> Our Thrift </h1>
        <p>Say yes to thrift</p>
    </div>

    <div class="navbar row">
        <a href="../index.php" style="color:black">Home</a>
        <div class="dropdown"><button class="dropbtn" ><?php echo $_SESSION['email'] ?></button>
            <div class="dropdown-content">
                <a href="../include/logout.php">Logout</a>
            </div>
        </div>
    </div>

</nav>