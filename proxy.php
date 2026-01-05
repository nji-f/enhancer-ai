<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $targetUrl = "https://api.upscalepics.com/upscale-to-size";

    $postData = [
        'name' => 'upscale-' . time(),
        'imageName' => 'upscale-' . time(),
        'desiredHeight' => $_POST['desiredHeight'],
        'desiredWidth' => $_POST['desiredWidth'],
        'outputFormat' => 'png',
        'compressionLevel' => 'none',
        'anime' => $_POST['anime']
    ];

    if (isset($_FILES['image_file'])) {
        $postData['image_file'] = curl_file_create(
            $_FILES['image_file']['tmp_name'],
            $_FILES['image_file']['type'],
            $_FILES['image_file']['name']
        );
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $targetUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Origin: https://upscalepics.com",
        "Referer: https://upscalepics.com"
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    echo $response;
}
?>
