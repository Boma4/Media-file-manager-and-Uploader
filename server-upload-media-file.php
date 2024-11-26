<?php
//include("db.php"); // replace with your database connection if needed

header("X-Robots-Tag: noindex, follow", true);
header("Access-Control-Allow-Origin: https://teamboma.com"); // replace the Access-Control-Allow-Origin with your url

// let server send output when the request is from ajax if not exit
if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest'){
    http_response_code(404);
    include("../error.php");
    exit();
}

header('Content-Type: application/json');

$directoryPaths = ['images']; // Adjust these paths as needed e.g ['images','images2',.....]

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$itemsPerPage = 50;

$searchTerm = isset($_GET['search']) ? $_GET['search'] : ''; // Get the search term
$filter = isset($_GET['filter']) ? $_GET['filter'] : 'All Media'; // Get the filter parameter

$mediaFiles = [];

// Collect media files from each directory
foreach ($directoryPaths as $directoryPath) {
    if (is_dir($directoryPath)) {
        $files = scandir($directoryPath);

        $validMedia = array_filter($files, function($file) use ($directoryPath) {
            $filePath = $directoryPath . '/' . $file;
            return is_file($filePath) && preg_match('/\.(jpg|jpeg|png|gif|webp|pdf|docx|doc|webm|avi|mp2|mp3|mp4|ppt|pptx|xls|xlsx|txt|zip)$/i', $file);
        });
        $count = 1;
        
        // get file size
        foreach ($validMedia as $file) {
            $filePath = $directoryPath . '/' . $file;
            $fileSize = filesize($filePath);
            if($fileSize >= 1000000){
            $autofileSize = number_format($fileSize / 1000000,2);
            $fileSize_ext = 'MB';
            }elseif($fileSize >= 1000 && $fileSize < 1000000){
            $autofileSize = number_format($fileSize / 1000,2);
            $fileSize_ext = 'KB';
            }else{
            $autofileSize = number_format($fileSize,2);
            $fileSize_ext = 'B';
            }
            
            // Get image info 
            $img_dim = end(explode('.', $directoryPath . '/' . $file));
            if($img_dim=='jpg' || $img_dim=='jpeg' || $img_dim=='png' || $img_dim=='webp'){
            $imgInfo = getimagesize($directoryPath . '/' . $file); 
            $mime = $imgInfo['mime'];
            $width_orig = $imgInfo[0];
            $height_orig = $imgInfo[1];
            }
            

            // Check if the search term is in the filename (case insensitive)
            if (stripos($file, $searchTerm) !== false) {
                $mediaFiles[] = [
                    'name' => $file,
                    'src' =>  $directoryPath . '/' . $file,
                    'path' => $directoryPath,
                    'modified' => filemtime($filePath),
                    'size' => $autofileSize,
                    'mime' => $mime,
                    'width' => $width_orig,
                    'height' => $height_orig,
                    'sizext' => $fileSize_ext,                    'sn' => $count,
                    'type' => getFileType($file) // Add type property
                ];
            }
            $count++;
        }
    } else {
        error_log("Directory not found: $directoryPath");
    }
}

// Function to determine file type based on extension
function getFileType($filename) {
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
        return 'images';
    } elseif (in_array($extension, ['mp4', 'webm', 'avi'])) {
        return 'videos';
    } elseif (in_array($extension, ['mp3', 'mp2'])) {
        return 'audio';
    } else {
        return 'document'; // For PDF, DOCX, etc.
    }
}

// Filter the media files based on the selected filter
if ($filter !== 'All Media') {
    $mediaFiles = array_filter($mediaFiles, function($item) use ($filter) {
        return $item['type'] === strtolower($filter); // Filter by type
    });
}

// Sort the media files by modification date (newest first)
usort($mediaFiles, function($a, $b) {
    return $b['modified'] <=> $a['modified'];
});

// Handle pagination
$totalFiles = count($mediaFiles);
$offset = ($page - 1) * $itemsPerPage;
$paginatedFiles = array_slice($mediaFiles, $offset, $itemsPerPage);

// Return the JSON response
echo json_encode([
    'mediaFiles' => $paginatedFiles,
    'totalFiles' => $totalFiles,
    'totalPages' => ceil($totalFiles / $itemsPerPage),
]);
//mysqli_close($db); //close the connection
?>