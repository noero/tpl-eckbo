<?php

// Initialize the session
session_start();

// Check if the user is already logged in, if yes then redirect him to welcome page
if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true){
    header("location: index.php");
    exit;
}

// Paramètres
$password_tpl = '';
$site_key_reCaptcha = '';
$secret_key_reCaptcha = '';

// Define variables and initialize with empty values
$password = $password_err = "";
$request_method = strtoupper($_SERVER['REQUEST_METHOD']);

if ($request_method === 'GET') {
    $_SESSION['token'] = bin2hex(random_bytes(35));
}

// Processing form data when form is submitted
if (isset($_POST['g-recaptcha-response'])) {
    $secret_key = $secret_key_reCaptcha;
    $url = 'https://www.google.com/recaptcha/api/siteverify?secret='.$secret_key.'&response='.$_POST['g-recaptcha-response'];
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HEADER, false);
    $data = curl_exec($curl);
    curl_close($curl);
    $response = json_decode($data);

    if(empty(filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING))){
        $password_err = "Merci d'écrire un mot de passe";
    } else{
        $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
    }

    $token = filter_input(INPUT_POST, 'token', FILTER_SANITIZE_STRING);
    if (!$token || $token !== $_SESSION['token']) {
        echo '<p class="error">Error: invalid form submission</p>';
        header($_SERVER['SERVER_PROTOCOL'] . ' 405 Method Not Allowed');
        exit;
    }

    if(empty($password_err)){
//        if($response->success) {
        if(true) {
            if($password === $password_tpl){
                session_start();
                $_SESSION["loggedin"] = true;
                header("location: index.php");
            } else{
                $password_err = "Mot de passe incorrect";
            }
//        }else {
//            $password_err = "Il semblerait que tu sois un bot";
        }
    }
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

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">

    <style>
        body{ font: 1rem sans-serif; }
        .wrapper{ width: 100%; }
        .wrapper .row{ min-height: 100vh; }
        /* The Modal (background) */
        .modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
        }

        /* Modal Content/Box */
        .modal-content {
            background-color: #fefefe;
            padding: 20px;
            width: 60%; /* Could be more or less, depending on screen size */
        }

        /* The Close Button */
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }

        /* Modal Header */
        .modal-header {
            padding: 2px 16px;
            background-color: #fefefe;
        }

        /* Modal Body */
        .modal-body {padding: 2px 16px;}

        /* Modal Footer */
        .modal-footer {
            padding: 2px 16px;
            background-color: #fefefe;
        }

        /* Modal Content */
        .modal-content {
            position: relative;
            background-color: #fefefe;
            margin: 15% auto;
            padding: 0;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
            animation-name: animatetop;
            animation-duration: 0.4s;
            width: 400px;
            z-index: 2;
        }

        /* Add Animation */
        @keyframes animatetop {
            from {top: -300px; opacity: 0}
            to {top: 0; opacity: 1}
        }

        .btn_modal{
            width: 48px;
        }
    </style>
</head>
<body>
    <div class="wrapper text-center">
        <div class="row align-items-center">
            <div class="mx-auto">
                <h2>TPL Eckbo</h2>

                <form id="passForm" action="?" method="POST">
                    <div class="form-group">
                        <label>Mot de passe</label>
                        <input id="pass" type="password" name="password" class="form-control <?php echo (!empty($password_err)) ? 'is-invalid' : ''; ?>" >
                        <span class="invalid-feedback"><?php echo $password_err; ?></span>
                    </div>
                    <div class="form-group">
                        <input type="hidden" name="token" value="<?= $_SESSION['token'] ?? '' ?>">
                        <p><input id="cookie-request" type="checkbox" name="cookie-request"> J'accepte l’utilisation de <a href="javascript:;" id="cookie-modal">cookies<br>strictement nécessaires</a></p>
                        <button id="submit-btn" class="g-recaptcha btn btn-primary" data-sitekey="<?php echo $site_key_reCaptcha; ?>" data-callback="submitForm" data-action='submit' disabled="disabled">Valider</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div id="myModal" class="modal">
        <div id="modal_el" class="modal-content rounded border-left-primary">
            <div class="modal-header text-center">
                <h4 class="mt-2" style="margin-left: auto;margin-right: -10%;"><i class="fas fa-cookie-bite" style="color: #cf7b4d;"></i> COOKIES</h4>
                <span class="close" onclick=''>&times;</span>
            </div>
            <div class="modal-body text-center pt-3">
                <p>
                    Ce site Web utilise des cookies pour savoir si vous vous êtes déjà connecté au site.
                    Il s'agit de cookies strictement nécessaires, indispensables pour que vous puissiez utiliser le site.
                    Ils n’enregistrent aucune information vous concernant qui pourrait être utilisée à des fins commerciales.
                    En continuant à naviguer sur ce site, vous acceptez l’utilisation des cookies.
                </p>
            </div>
            <div class="modal-footer justify-content-center">
                <a href="javascript:;" id="ok" class="btn btn-success btn_modal">
                    <span class="icon">
                        <i class="fas fa-check"></i>
                    </span>
                </a>
            </div>
        </div>
    </div>

    <script src="vendor/jquery/jquery.min.js"></script>
    <script src='https://www.google.com/recaptcha/api.js?trustedtypes=true'></script>
    <script>
        let modal = $("#myModal");
        let submitBtn = $("#submit-btn");
        function submitForm(token) {
            $('#passForm').submit();
        }
        $("#pass").focus();
        window.onload = function () {
            submitBtn.attr('disabled','disabled');
        };
        $("#cookie-request").change(function (event){
            if (event.currentTarget.checked){
                submitBtn.removeAttr('disabled')
            }else {
                submitBtn.attr('disabled','disabled');
            }
        });
        $("#cookie-modal").click(function (event){
            event.preventDefault();
            modal.css('display', "block");
            $(".close, #ok").click(function () {
                modal.css('display', "none");
            });
        });
        $(window).click(function(event) {
            let mod = document.getElementById("myModal");
            if (event.target === mod) {
                modal.css('display', "none");
            }
        });
    </script>

</body>
</html>