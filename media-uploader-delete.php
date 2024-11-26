<?php
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $path = $_GET['path'];
    $filename = basename($_GET['filename']); // Get the filename from the URL
    $filePath = "$path/$filename"; // Define the path

    if (file_exists($filePath)) {
        unlink($filePath); // Delete the file
        echo json_encode(['statusCode' => 200, 'msg' => 'File deleted successfully.']);
    } else {
        echo json_encode(['statusCode' => 404, 'msg' => 'File not found.']);
    }
    
}
?>
