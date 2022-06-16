<?php

// Initialize the session
session_start();

// Check if the user is already logged in, if yes then redirect him to welcome page
if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true){
    header("location: index.php");
    exit;
}

// Paramètres
$password_tpl = "123456789";
$secret_key_reCaptcha = '6LdNdncgAAAAAFDupV_18mLBtxb0gXvbw_3a8Mxn';
$site_key_reCaptcha = '6LdNdncgAAAAAFQPnkvhhyX41c8IaI7exi5IpQtX';

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
        if($response->success) {
            if($password === $password_tpl){
                session_start();
                $_SESSION["loggedin"] = true;
                header("location: index.php");
            } else{
                $password_err = "Mot de passe incorrect";
            }
        }else {
            echo '<p class="error">Error: invalid form submission</p>';
            header($_SERVER['SERVER_PROTOCOL'] . ' 405 Method Not Allowed');
            exit;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Programme TPL - Strasbourg Eckbolsheim</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        body{ font: 1rem sans-serif; }
        .wrapper{ width: 100%; }
        .wrapper .row{ min-height: 100vh; }
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
                        <button class="g-recaptcha btn btn-primary" data-sitekey="<?php echo $site_key_reCaptcha; ?>" data-callback="submitForm">Valider</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src='https://www.google.com/recaptcha/api.js'></script>
    <script>
        function submitForm() {
            document.getElementById('passForm').submit();
        }
        document.getElementById("pass").focus();

    </script>

</body>
</html>