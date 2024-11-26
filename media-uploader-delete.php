<?php
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $path = $_GET['path'];
    $filename = basename($_GET['filename']); // Get the filename from the URL
    $filePath = "$path/$filename"; // Define the path
    
    // for security reason this protected not be delete. remove before adding to your project...
    if (is_fileProtected($filename)) {
        echo json_encode(['statusCode' => 403, 'msg' => 'File deletion is not allowed.']);
        exit;
    }

    if (file_exists($filePath)) {
        unlink($filePath); // Delete the file
        echo json_encode(['statusCode' => 200, 'msg' => 'File deleted successfully.']);
    } else {
        echo json_encode(['statusCode' => 404, 'msg' => 'File not found.']);
    }
    
}

function is_fileProtected($filename) {
    $protectedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.mp4', '.mp3'];

    $fileExtension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

    foreach ($protectedExtensions as $ext) {
        if (strpos($filename, $ext) !== false) {
            return true; // File is protected
        }
    }

    return false; // File is not protected
}
?>
