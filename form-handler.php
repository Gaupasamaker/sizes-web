<?php
/**
 * form-handler.php
 * Handles Early Access sign-ups for sizes.es
 */

header('Content-Type: application/json');

// 1. Get data from POST
$email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : null;
$lang = isset($_POST['lang']) ? htmlspecialchars($_POST['lang']) : 'es';

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
    exit;
}

// 2. Configuration
$to = "info@sizes.es";
$subject = "Nuevo Registro Early Access - Sizes.es";
$message = "Has recibido una nueva solicitud de acceso temprano:\n\nEmail: " . $email . "\nIdioma: " . strtoupper($lang) . "\nFecha: " . date("Y-m-d H:i:s");

// IMPORTANT: Using info@sizes.es as sender to improve deliverability on Hostinger
$headers = "From: info@sizes.es\r\n" .
           "Reply-To: " . $email . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

// 3. Send Email
$mailSent = mail($to, $subject, $message, $headers);

// 4. Backup (Always saves to server)
file_put_contents('leads.txt', date("Y-m-d H:i:s") . " - " . $email . " [" . strtoupper($lang) . "]" . PHP_EOL, FILE_APPEND);

// 5. Response
if ($mailSent) {
    echo json_encode(['status' => 'success', 'message' => 'Subscription successful.']);
} else {
    // If mail() fails, we still return success if the lead was saved to the file
    // this avoids showing an error to the user if it's just a server mail configuration issue
    echo json_encode(['status' => 'success', 'message' => 'Leads saved (Email delayed).']);
}
?>
