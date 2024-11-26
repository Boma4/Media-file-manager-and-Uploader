<html>
<head>
    <title>Media File Manager and Uploader</title>
    <link href="styles.css" rel="stylesheet">
</head>
<body>
    <div class="container-media">
        <aside class="sidebar-media">
            <h2 class="h22">Media Manager</h2>
            <ul>
                <li><a href="#" class="active media-link">All Media</a></li>
                <li><a href="#" class="media-link">Images</a></li>
                <li><a href="#" class="media-link">Videos</a></li>
                <li><a href="#" class="media-link">Audio</a></li>
                <li><a href="#" class="media-link">Document</a></li>
            </ul>
            <button id="uploadBtn">Upload Media</button>
        </aside>
        
        <main class="media-gallery main">
            <div class="header-container">
            <h2 class="h22">Media Files</h2>
            <div class="search-container">
            <input type="text" id="searchInput" placeholder="Search for media..." />
            </div>
            </div>
            <div id="mediaContainer"></div>
    <div class="pagination" id="pagination">
    <button id="prevPage" class="page-button" disabled>Previous</button>
    <span id="pageInfo">Page 1 of 1</span>
    <button id="nextPage" class="page-button" disabled>Next</button>
</div>

        </main>
    </div>

    <!-- Uploading Files -->
    <div id="uploadModal" class="modal-box">
        <div class="modal-box-content">
            <span class="close">&times;</span>
            <h2 class="h22">Upload Media</h2>
            <input type="file" id="fileInput" multiple />
            <button id="submitUpload">Upload</button>
        </div>
    </div>
    
<!-- showing image description -->
<div id="descriptionModal" class="modal-box">
    <div class="modal-box-content">
        <span class="close-description">&times;</span>
        <h2 class="h22" id="imageTitle">Image Title</h2>
        <p id="imageDescription"></p>
    </div>
</div>

<script src="main.js"></script>
</body>
</html>
