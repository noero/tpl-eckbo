<?php
// Initialize the session
session_start();
 
// Check if the user is logged in, if not then redirect him to login page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>

    <meta name="robots" content="noindex">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Programme TPL - Strasbourg Eckbolsheim</title>
    <link rel="icon" type="image/png" href="logo.png" />

    <!-- Custom fonts for this template-->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">

    <!-- Custom styles for this template-->
    <link href="css/sb-admin-2.css" rel="stylesheet">
    <link rel="stylesheet" href="css/main.css">

</head>

<body id="page-top">

    <!-- Page Wrapper -->
    <div id="wrapper">

        <!-- Sidebar -->
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

            <!-- Sidebar - Brand -->
            <a class="sidebar-brand d-none d-md-flex align-items-center justify-content-center d-none d-md-flex" href="/">
                <div class="sidebar-brand-icon">
                    <i class="fab fa-black-tie"></i>
                </div>
                <div class="sidebar-brand-text mx-3">TPL Eckbo</div>
            </a>

            <!-- Divider -->
            <hr class="sidebar-divider my-0 d-none d-md-flex">

            <!-- Nav Item - Calendriers -->
            <li class="nav-item">
                <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseCalendars"
                   aria-expanded="true" aria-controls="collapseCalendars">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Calendriers</span>
                </a>
                <div id="collapseCalendars" class="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
                    <div id="calendars_menu_el" class="bg-white py-2 collapse-inner rounded">
                    </div>
                </div>
            </li>

<!--            &lt;!&ndash; Nav Item - Cartes &ndash;&gt;-->
<!--            <li class="nav-item">-->
<!--                <a class="nav-link" href="">-->
<!--                    <i class="fas fa-map-marked"></i>-->
<!--                    <span>Carte</span></a>-->
<!--            </li>-->

<!--            &lt;!&ndash; Nav Item - Informations &ndash;&gt;-->
<!--            <li class="nav-item">-->
<!--                <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages"-->
<!--                    aria-expanded="true" aria-controls="collapsePages">-->
<!--                    <i class="fas fa-info-circle"></i>-->
<!--                    <span>Informations</span>-->
<!--                </a>-->
<!--                <div id="collapsePages" class="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">-->
<!--                    <div class="bg-white py-2 collapse-inner rounded">-->

<!--                    </div>-->
<!--                </div>-->
<!--            </li>-->

            <!-- Divider -->
            <hr class="sidebar-divider d-none d-md-block">


            <!-- Sidebar Message -->
            <div class="sidebar-card d-none d-lg-flex">
                <p class="text-center mb-2"><strong>N'oublie pas de trouver un co??quipier !</strong></p>
            </div>

        </ul>
        <!-- End of Sidebar -->

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">

                <!-- Topbar -->
                <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                    <!-- Sidebar Toggle (Topbar) -->
                    <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                        <i class="fa fa-bars"></i>
                    </button>

                    <!-- Date Navbar -->
                    <ul class="navbar-nav ">

                        <!-- Nav Item - User Information -->
                        <li class="nav-item dropdown no-arrow mr-2 ml-2">
                            <a href="javascript:;" id="prev_el" class="btn btn-primary">
                                <span class="icon">
                                    <i class="fas fa-arrow-left"></i>
                                </span>
                            </a>
                        </li>
                        <li class="nav-item dropdown no-arrow mr-2">
                            <a href="javascript:;" id="next_el" class="btn btn-primary">
                                <span class="icon">
                                    <i class="fas fa-arrow-right"></i>
                                </span>
                            </a>
                        </li>

                    </ul>

                    <!-- Date -->
                    <div class="d-sm-flex align-items-center justify-content-between ml-2">
                        <h1 id="date_el" class="h3 mb-0 text-uppercase text-gray-800"></h1>
                    </div>

                </nav>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <div id="cards_el" class="container-fluid">
                </div>
                <!-- /.container-fluid -->

            </div>
            <!-- End of Main Content -->

            <!-- Footer -->
            <footer class="sticky-footer bg-white">
                <div class="container my-auto">
                    <div class="copyright text-center my-auto">
                        <span>Copyright &copy; Strasbourg Eckbolsheim</span>
                    </div>
                </div>
            </footer>
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a>

    <div id="myModal" class="modal">
        <div id="modal_el" class="modal-content rounded border-left-danger"></div>
    </div>

    <div class="alert alert-success" role="alert">
        Le mode RPP est activ?? !
    </div>

    <!-- Bootstrap core JavaScript-->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- Core plugin JavaScript-->
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>

    <!-- Custom scripts for all pages-->
    <script src="js/sb-admin-2.js"></script>
    <script src="js/main.js"></script>

</body>

</html>