<?php
//adjust as needed

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the posted data
    $path = $_POST['path'];
    $oldFilename = $_POST['oldFilename'];
    $newFilename = $_POST['newFilename'];


    // Validate input
    if (empty($path) || empty($oldFilename) || empty($newFilename)) {
        echo json_encode(['statusCode' => 400, 'message' => 'Invalid input.']);
        exit;
    }

    // Ensure the new filename does not contain invalid characters
    if (preg_match('/[\/:*?"<>|]/', $newFilename)) {
        echo json_encode(['statusCode' => 400, 'message' => 'Invalid filename.']);
        exit;
    }

    // Construct full file paths
    $oldFilePath = rtrim($path, '/') . '/' . $oldFilename;
    $newFilePath = rtrim($path, '/') . '/' . $newFilename;

    // Check if the old file exists
    if (!file_exists($oldFilePath)) {
        echo json_encode(['statusCode' => 404, 'message' => 'File not found.']);
        exit;
    }

    // Attempt to rename the file
    if (rename($oldFilePath, $newFilePath)) {
        echo 'Success';
    } else {
        echo json_encode(['statusCode' => 500, 'message' => 'Error renaming file.']);
    }
} else {
    echo json_encode(['statusCode' => 405, 'message' => 'Method not allowed.']);
}
?>