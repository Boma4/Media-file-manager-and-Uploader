<?php
// adjust as needed

function compress_image($tempPath, $originalPath, $imageQuality) {
    // Ensure quality is between 0 and 100
    $imageQuality = max(0, min(100, $imageQuality));

    // Get image info 
    $imgInfo = getimagesize($tempPath);
    $mime = $imgInfo['mime'];
    $width_orig = $imgInfo[0];
    $height_orig = $imgInfo[1];

    // Set max dimensions
    $max_width = 1200;
    $max_height = 900;

    // Calculate original aspect ratio
    $original_ratio = $width_orig / $height_orig;

    // Define available aspect ratios
    $aspectRatios = [
        '1:1' => 1,
        '4:3' => 4 / 3,
        '3:4' => 3 / 4,
        '3:2' => 3 / 2,
        '2:3' => 2 / 3,
        '16:9' => 16 / 9,
        '9:16' => 9 / 16,
        '5:4' => 5 / 4,
        '4:5' => 4 / 5,
        '2:1' => 2 / 1,
        '1.85:1' => 1.85,
        '2.39:1' => 2.39,
        '21:9' => 21 / 9,
        '16:10' => 16 / 10,
        '1:2' => 1 / 2,
        '3:1' => 3,
        '1:3' => 1 / 3,
        // Add more ratios if necessary
    ];

    // Choose the closest aspect ratio
    $closest_ratio = null;
    $closest_difference = PHP_INT_MAX;
    
    foreach ($aspectRatios as $aspect => $ratio) {
        $difference = abs($original_ratio - $ratio);
        if ($difference < $closest_difference) {
            $closest_difference = $difference;
            $closest_ratio = $aspect;
        }
    }

    // Define selected aspect ratio dimensions
    list($ratio_width, $ratio_height) = explode(':', $closest_ratio);
    
    // Calculate new dimensions based on the closest aspect ratio
    if ($width_orig / $height_orig > $ratio_width / $ratio_height) {
        $width = min($max_width, $max_height * ($ratio_width / $ratio_height));
        $height = $width / ($ratio_width / $ratio_height);
    } else {
        $height = min($max_height, $max_width / ($ratio_width / $ratio_height));
        $width = $height * ($ratio_width / $ratio_height);
    }

    // Ensure dimensions do not exceed max
    $width = min($width, $max_width);
    $height = min($height, $max_height);

    // Create a new image from file 
    switch ($mime) {
        case 'image/jpeg':
            $image = imagecreatefromjpeg($tempPath);
            break;
        case 'image/png':
            $image = imagecreatefrompng($tempPath);
            // Handle transparency for PNG
            imagealphablending($image, false);
            imagesavealpha($image, true);
            break;
        case 'image/webp':
            $image = imagecreatefromwebp($tempPath);
            break;
        default:
            return false; // Unsupported image type
    }

    // Create a new true color image
    $image_p = imagecreatetruecolor($width, $height);

    // If PNG, set transparency
    if ($mime == 'image/png') {
        imagealphablending($image_p, false);
        imagesavealpha($image_p, true);
        $transparent = imagecolorallocatealpha($image_p, 255, 255, 255, 127);
        imagefill($image_p, 0, 0, $transparent);
    }

    // Resampling the image
    imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);

    // Save image
    imagejpeg($image_p, $originalPath, $imageQuality);
    
    // Free memory
    imagedestroy($image);
    imagedestroy($image_p);

    // Return compressed image path
    return $originalPath;
}
ob_end_clean();
$valid_extensions = array('jpeg', 'jpg','png', 'webp', 'gif', 'pdf', 'docx', 'doc', 'mp2', 'mp3', 'mp4', 'avi', 'webm', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'zip'); 
$img_exts = array('jpeg', 'jpg','png', 'webp');

    if ( 0 < $_FILES['upload']['error'] ) {
        echo 'Error: ' . $_FILES['file']['error'] . '<br>';
    }
    else {
       
        $code= $_FILES['upload']['name'];/* rename the file name*/
        $image_extensionss = explode(".",$code);
           $imageautual_extensionss = strtolower(end($image_extensionss));
           $imagefilepathd = pathinfo($code, PATHINFO_FILENAME);
           $imagefilepathd2 = strtolower(trim($imagefilepathd));
		   $imagefilepathd22 = preg_replace('/[^a-z0-9-]/', '-', $imagefilepathd2);
		   $imagefilepathd222 = preg_replace('/-+/', "-", $imagefilepathd22);
		   $imagefilepathd2222 = rtrim($imagefilepathd222, '-');
		   $imagefilepathd22222 = preg_replace('/\s+/', '-', $imagefilepathd2222);
		   $autualfileimagepart = $imagefilepathd22222.".".$imageautual_extensionss;
        $size= $_FILES['upload']['size'];
        $ext = strtolower(pathinfo($_FILES['upload']['name'], PATHINFO_EXTENSION));
        $imagecheck_exist = 'uploads2/'.$autualfileimagepart;
        if(file_exists($imagecheck_exist)) {
        echo "Image Already Exists On The Server...";
        }else{
           if($size > 300000 && in_array($ext, $img_exts))
        {
            echo json_encode(array("statusCode"=>400,'msg'=>"Image allowd less than 300kb"));
        }
        else if(!in_array($ext, $valid_extensions)) {
            echo json_encode(array("statusCode"=>400,'msg'=>$ext.' not allowed'));
        }
        else{
            if(in_array($ext, $img_exts)){
            //compress_image($_FILES['upload']['tmp_name'], 'images/' . $autualfileimagepart, 70);
            echo 'Success';
            }else{
                 //move_uploaded_file($_FILES['upload']['tmp_name'], 'images/' . $autualfileimagepart);
                 echo 'Success';
            }
        } 
        }
        
    }
?>