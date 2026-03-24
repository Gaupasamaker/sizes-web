<?php
/**
 * form-handler.php
 * Handles Early Access sign-ups for sizes.es
 */

header('Content-Type: application/json');

// 1. Get the email from POST
$email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : null;

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
    exit;
}

// 2. Configuration
$to = "info@sizes.es";
$subject = "Nuevo Registro Early Access - Sizes.es";
$message = "Has recibido una nueva solicitud de acceso temprano:\n\nEmail: " . $email . "\nFecha: " . date("Y-m-d H:i:s");
$headers = "From: web@sizes.es\r\n" .
           "Reply-To: " . $email . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

// 3. Send Email
$mailSent = mail($to, $subject, $message, $headers);

// 4. Backup (Optional: Append to a TXT file)
file_put_contents('leads.txt', date("Y-m-d H:i:s") . " - " . $email . PHP_EOL, FILE_APPEND);

// 5. Response
if ($mailSent) {
    echo json_encode(['status' => 'success', 'message' => 'Subscription successful.']);
} else {
    // Note: mail() might fail if the server is not configured, but leads.txt still works as backup
    echo json_encode(['status' => 'error', 'message' => 'Email could not be sent.']);
}
?>
