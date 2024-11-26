/*!
 * Packaged and Distributed by TeamBoma (https://teamboma.com)
 * Copyright 2024
 * Licensed: Free to use
 */
// variables
const uploadBtn = document.getElementById('uploadBtn');
const modal = document.getElementById('uploadModal');
const closeModal = document.getElementsByClassName('close')[0];
const submitUpload = document.getElementById('submitUpload');
const fileInput = document.getElementById('fileInput');
const mediaContainer = document.getElementById('mediaContainer');
const searchInput = document.getElementById('searchInput'); // Search input element
const descriptionModal = document.getElementById('descriptionModal');
const closeDescription = document.getElementsByClassName('close-description')[0];
const imageTitle = document.getElementById('imageTitle');
const imagePreview = document.getElementById('imagePreview');
const imageDescription = document.getElementById('imageDescription');
const itemsPerPage = 50; // 50 items per page
let currentPage = 1;
let totalFiles = 0; // Total files
let totalPages = 0; // Total pages
let mediaItems = []; // Array to hold media items
let currentFilter = 'All Media'; // Default filter

// Load media files from the server with pagination, search term, and filter options
async function loadMediaFiles(page, searchTerm = '', filter = 'All Media') {
    try {
        const timestamp = new Date().getTime();
        mediaContainer.innerHTML = '<img src="loading-loading-forever.gif" width="80" height="80">';
        const response = await fetch(`server-upload-media-file?page=${page}&search=${encodeURIComponent(searchTerm)}&filter=${encodeURIComponent(filter)}&t=${timestamp}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest' // Add your custom header (You can use this to allow only ajax request from server)
            }
        }); // Update with the correct path to your PHP file
        const data = await response.json();
        mediaItems = data.mediaFiles; // Update media items array
        totalFiles = data.totalFiles; // Get total file count
        totalPages = data.totalPages; // Get total pages
        displayMediaItems(); // Display loaded items
    } catch (error) {
        mediaContainer.innerHTML = 'Error loading media files: ' + error;
    }
}

// Function to display media items based on current page
function displayMediaItems() {
    mediaContainer.innerHTML = ''; // Clear the media container

    mediaItems.forEach(mediaItem => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('media-item');
        
       // store the files base on their type
       if(mediaItem.type=="images"){
        const img = document.createElement('img');
        img.src = mediaItem.src; // Set the image source
        img.alt = mediaItem.name;

        // Add an event listener to show the description modal
        img.addEventListener('click', function() {
            imageTitle.textContent = mediaItem.name; // Set image title to the file name
            imageDescription.innerHTML = `<img id="imagePreview" src="${mediaItem.src}" alt="${mediaItem.name}" style="width: 100%; border-radius: 5px;"> <br><br><b>Descriptions</b><br><br>File name: <input class="bomq-input" style="width:350px;" type="text" id="file${mediaItem.sn}" value="${mediaItem.name}"><br><br>Date: ${new Date(mediaItem.modified * 1000).toLocaleDateString()}<br><br>File Size: ${mediaItem.size + ' ' + mediaItem.sizext}<br><br>Dimension: ${mediaItem.width}x${mediaItem.height} | ${mediaItem.mime} <br><br>Image alt: <input class="bomq-input" style="width:350px;" value="${mediaItem.name.split('.').slice(0, -1).join('.')}" type="text" id="alt${mediaItem.sn}"><br><br>URL: <input class="bomq-input" style="width:350px;" value="${mediaItem.src}" type="text" id="url${mediaItem.sn}"> <br><br><br> <button id="deleteButton${mediaItem.sn}">Delete</button> <button id="renameButton${mediaItem.sn}">Rename</button>`; // Set description
            descriptionModal.style.display = 'block'; // Show the description modal
            
      // Delete button functionality
document.getElementById('deleteButton'+mediaItem.sn).addEventListener('click', function() {
    if (mediaItem) {
        const confirmDelete = confirm(`Are you sure you want to delete ${mediaItem.name}?`);
        if (confirmDelete) {
            // Make a DELETE request to your server
            fetch(`media-uploader-delete?path=${mediaItem.path}&filename=${mediaItem.name}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.statusCode === 200) {
                        alert('File deleted successfully.');
                        descriptionModal.style.display = 'none'; // Close the modal
                        loadMediaFiles(currentPage, searchInput.value, currentFilter); // Reload media files
                    } else {
                        alert('Error: '+data.msg);
                        descriptionModal.style.display = 'none'; // Close the modal
                    }
                })
                 .catch(error => {
                 alert('Error: ' + error.message);
             });
        }
    }
});

// Rename button functionality
document.getElementById('renameButton' + mediaItem.sn).addEventListener('click', function() {
    if (mediaItem) {
        let newFilename = document.getElementById('file'+mediaItem.sn);
            // Make a POST request to your server to rename the file
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'media-uploader-rename', true);
            let formData = new FormData();
            formData.append('path',mediaItem.path);
            formData.append('oldFilename',mediaItem.name);
            formData.append('newFilename',newFilename.value);
            xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 && xhr.responseText==='Success') {
                    alert('File renamed successfully.');
                    descriptionModal.style.display = 'none'; // Close the modal
                    loadMediaFiles(currentPage, searchInput.value, currentFilter); // Reload media files
                } else {
                    alert(`Error occurred: ${xhr.responseText}`); // Show specific error message
                    descriptionModal.style.display = 'none';
                }
            }
        };
            xhr.send(formData);
    }
});
        });
        itemDiv.appendChild(img);
        mediaContainer.appendChild(itemDiv);
       }
       
       if(mediaItem.type=="videos"){
        // Create a container for the video item
            const videoContainer = document.createElement('div');
            videoContainer.classList.add('x-lar-container');

            // Create SVG icon for the video
            const svgIcon = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="setSVG-icon">
                    <polygon points="30,20 30,85 90,50" fill="black" />
                    <circle cx="50" cy="50" r="45" stroke="black" stroke-width="5" fill="none"/>
                </svg>
            `;
            videoContainer.innerHTML = svgIcon;

            // Create a span for the filename
            const filenameSpan = document.createElement('span');
            filenameSpan.textContent = mediaItem.name; // Set the filename
            filenameSpan.classList.add('filename-x-lar'); // Add class for styling

            // Add click event to show description modal
            videoContainer.addEventListener('click', function() {
                imageTitle.textContent = mediaItem.name; // Set image title to the file name
                imageDescription.innerHTML = `${svgIcon} <br><br><b>Descriptions</b><br><br>File name: <input class="bomq-input" style="width:350px;" type="text" id="file${mediaItem.sn}" value="${mediaItem.name}"><br><br>Date: ${new Date(mediaItem.modified * 1000).toLocaleDateString()}<br><br>File Size: ${mediaItem.size + ' ' + mediaItem.sizext}<br><br>Video text: <input class="bomq-input" style="width:350px;" value="${mediaItem.name.split('.').slice(0, -1).join('.')}" type="text" id="alt${mediaItem.sn}"><br><br>URL: <input class="bomq-input" style="width:350px;" value="${mediaItem.src}" type="text" id="url${mediaItem.sn}"> <br><br><br> <button id="deleteButton${mediaItem.sn}">Delete</button> <button id="renameButton${mediaItem.sn}">Rename</button>`;
                descriptionModal.style.display = 'block'; // Show the description modal
      
      // Delete button functionality
document.getElementById('deleteButton'+mediaItem.sn).addEventListener('click', function() {
    if (mediaItem) {
        const confirmDelete = confirm(`Are you sure you want to delete ${mediaItem.name}?`);
        if (confirmDelete) {
            // Make a DELETE request to your server
            fetch(`media-uploader-delete?path=${mediaItem.path}&filename=${mediaItem.name}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.statusCode === 200) {
                        alert('File deleted successfully.');
                        descriptionModal.style.display = 'none'; // Close the modal
                        loadMediaFiles(currentPage, searchInput.value, currentFilter); // Reload media files
                    } else {
                        alert('Error: '+data.msg);
                        descriptionModal.style.display = 'none'; // Close the modal
                    }
                })
                .catch(error => {
                 alert('Error: ' + error.message);
             });
        }
    }
});

// Rename button functionality
document.getElementById('renameButton' + mediaItem.sn).addEventListener('click', function() {
    if (mediaItem) {
        let newFilename = document.getElementById('file'+mediaItem.sn);
            // Make a POST request to your server to rename the file
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'media-uploader-rename', true);
            let formData = new FormData();
            formData.append('path',mediaItem.path);
            formData.append('oldFilename',mediaItem.name);
            formData.append('newFilename',newFilename.value);
            xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 && xhr.responseText==='Success') {
                    alert('File renamed successfully.');
                    descriptionModal.style.display = 'none'; // Close the modal
                    loadMediaFiles(currentPage, searchInput.value, currentFilter); // Reload media files
                } else {
                    alert(`Error occurred: ${xhr.responseText}`); // Show specific error message
                    descriptionModal.style.display = 'none';
                }
            }
        };
            xhr.send(formData);
    }
});
            });
            videoContainer.appendChild(filenameSpan);
            itemDiv.appendChild(videoContainer);
            mediaContainer.appendChild(itemDiv);
       }
       
       if(mediaItem.type=="audio"){
        // Create a container for the video item
            const audContainer = document.createElement('div');
            audContainer.classList.add('x-lar-container');

            // Create SVG icon for the video
            const svgIcon = `
                <svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="setSVG-icon"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 22.42C8.20914 22.42 10 20.6292 10 18.42C10 16.2109 8.20914 14.42 6 14.42C3.79086 14.42 2 16.2109 2 18.42C2 20.6292 3.79086 22.42 6 22.42Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M18 20.42C20.2091 20.42 22 18.6292 22 16.42C22 14.2109 20.2091 12.42 18 12.42C15.7909 12.42 14 14.2109 14 16.42C14 18.6292 15.7909 20.42 18 20.42Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M10 18.4099V9.5C9.99907 8.0814 10.5008 6.70828 11.4162 5.62451C12.3315 4.54074 13.6012 3.81639 15 3.57996L22 2.40991V16.4099" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            `;
            audContainer.innerHTML = svgIcon;

            // Create a span for the filename
            const filenameSpan = document.createElement('span');
            filenameSpan.textContent = mediaItem.name; // Set the filename
            filenameSpan.classList.add('filename-x-lar'); // Add class for styling

            // Add click event to show description modal
            audContainer.addEventListener('click', function() {
                imageTitle.textContent = mediaItem.name; // Set image title to the file name
                imageDescription.innerHTML = `${svgIcon} <br><br><b>Descriptions</b><br><br>File name: <input class="bomq-input" style="width:350px;" type="text" id="file${mediaItem.sn}" value="${mediaItem.name}"><br><br>Date: ${new Date(mediaItem.modified * 1000).toLocaleDateString()}<br><br>File Size: ${mediaItem.size + ' ' + mediaItem.sizext}<br><br>Audio alt: <input class="bomq-input" style="width:350px;" value="${mediaItem.name.split('.').slice(0, -1).join('.')}" type="text" id="alt${mediaItem.sn}"><br><br>URL: <input class="bomq-input" style="width:350px;" value="${mediaItem.src}" type="text" id="url${mediaItem.sn}"> <br><br><br> <button id="deleteButton${mediaItem.sn}">Delete</button> <button id="renameButton${mediaItem.sn}">Rename</button>`;
                descriptionModal.style.display = 'block'; // Show the description modal
      
      // Delete button functionality
document.getElementById('deleteButton'+mediaItem.sn).addEventListener('click', function() {
    if (mediaItem) {
        const confirmDelete = confirm(`Are you sure you want to delete ${mediaItem.name}?`);
        if (confirmDelete) {
            // Make a DELETE request to your server
            fetch(`media-uploader-delete?path=${mediaItem.path}&filename=${mediaItem.name}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.statusCode === 200) {
                        alert('File deleted successfully.');
                        descriptionModal.style.display = 'none'; // Close the modal
                        loadMediaFiles(currentPage, searchInput.value, currentFilter); // Reload media files
                    } else {
                        alert('Error: '+data.msg);
                        descriptionModal.style.display = 'none'; // Close the modal
                    }
                })
                .catch(error => {
                 alert('Error: ' + error.message);
             });
        }
    }
});

// Rename button functionality
document.getElementById('renameButton' + mediaItem.sn).addEventListener('click', function() {
    if (mediaItem) {
        let newFilename = document.getElementById('file'+mediaItem.sn);
            // Make a POST request to your server to rename the file
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'media-uploader-rename', true);
            let formData = new FormData();
            formData.append('path',mediaItem.path);
            formData.append('oldFilename',mediaItem.name);
            formData.append('newFilename',newFilename.value);
            xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 && xhr.responseText==='Success') {
                    alert('File renamed successfully.');
                    descriptionModal.style.display = 'none'; // Close the modal
                    loadMediaFiles(currentPage, searchInput.value, currentFilter); // Reload media files
                } else {
                    alert(`Error occurred: ${xhr.responseText}`); // Show specific error message
                    descriptionModal.style.display = 'none';
                }
            }
        };
            xhr.send(formData);
    }
});
            });
            audContainer.appendChild(filenameSpan);
            itemDiv.appendChild(audContainer);
            mediaContainer.appendChild(itemDiv);
       }
       
       if(mediaItem.type=="document"){
        // Create a container for the video item
            const docContainer = document.createElement('div');
            docContainer.classList.add('x-lar-container');

            // Create SVG icon for the video
            const svgIcon = `
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" class="setSVG-icon" viewBox="0 0 64 64">
<linearGradient id="7OC0bb_0rkmVY7Mwj6ZH6a_43995_gr1" x1="17" x2="17" y1="46.25" y2="55.004" gradientUnits="userSpaceOnUse" spreadMethod="reflect"><stop offset="0" stop-color="#6dc7ff"></stop><stop offset="1" stop-color="#e6abff"></stop></linearGradient><path fill="url(#7OC0bb_0rkmVY7Mwj6ZH6a_43995_gr1)" d="M13,46v6c0,1.105,0.895,2,2,2h6L13,46z"></path><linearGradient id="7OC0bb_0rkmVY7Mwj6ZH6b_43995_gr2" x1="32" x2="32" y1="5.333" y2="58.343" gradientUnits="userSpaceOnUse" spreadMethod="reflect"><stop offset="0" stop-color="#1a6dff"></stop><stop offset="1" stop-color="#c822ff"></stop></linearGradient><path fill="url(#7OC0bb_0rkmVY7Mwj6ZH6b_43995_gr2)" d="M52,37V12c0-1.302-0.839-2.402-2-2.816V9c0-1.654-1.346-3-3-3H17c-1.654,0-3,1.346-3,3v0.184 c-1.161,0.414-2,1.514-2,2.816v12c-1.654,0-3,1.346-3,3v26c0,2.757,2.243,5,5,5h37v0c0.071,0,0.142-0.002,0.214-0.005 C53.337,57.884,55,56.054,55,53.83V40C55,38.346,53.654,37,52,37z M44,11h5c0.552,0,1,0.448,1,1v6h-5c-0.552,0-1-0.448-1-1V11z M17,8h30c0.552,0,1,0.448,1,1H16C16,8.448,16.448,8,17,8z M11,53V27c0-0.552,0.448-1,1-1h7.93c0.335,0,0.646,0.166,0.832,0.445 l2.812,4.216C24.131,31.5,25.065,32,26.073,32H46c0.552,0,1,0.448,1,1v21c0,0.709,0.209,1.394,0.56,2H14C12.346,56,11,54.654,11,53z M53,53.83c0,1.141-0.849,2.112-1.891,2.167c-0.552,0.025-1.084-0.165-1.486-0.547C49.222,55.068,49,54.554,49,54V33 c0-1.654-1.346-3-3-3H26.073c-0.337,0-0.649-0.167-0.836-0.447l-2.812-4.217C21.868,24.499,20.935,24,19.93,24H14V12 c0-0.552,0.448-1,1-1h27v6c0,1.654,1.346,3,3,3h5v34c0,0.553,0.447,1,1,1s1-0.447,1-1V39c0.552,0,1,0.448,1,1V53.83z"></path><linearGradient id="7OC0bb_0rkmVY7Mwj6ZH6c_43995_gr3" x1="28" x2="28" y1="5.333" y2="58.343" gradientUnits="userSpaceOnUse" spreadMethod="reflect"><stop offset="0" stop-color="#1a6dff"></stop><stop offset="1" stop-color="#c822ff"></stop></linearGradient><path fill="url(#7OC0bb_0rkmVY7Mwj6ZH6c_43995_gr3)" d="M18 14H38V16H18z"></path><linearGradient id="7OC0bb_0rkmVY7Mwj6ZH6d_43995_gr4" x1="28" x2="28" y1="5.333" y2="58.343" gradientUnits="userSpaceOnUse" spreadMethod="reflect"><stop offset="0" stop-color="#1a6dff"></stop><stop offset="1" stop-color="#c822ff"></stop></linearGradient><path fill="url(#7OC0bb_0rkmVY7Mwj6ZH6d_43995_gr4)" d="M18 18H38V20H18z"></path><linearGradient id="7OC0bb_0rkmVY7Mwj6ZH6e_43995_gr5" x1="32" x2="32" y1="5.333" y2="58.343" gradientUnits="userSpaceOnUse" spreadMethod="reflect"><stop offset="0" stop-color="#1a6dff"></stop><stop offset="1" stop-color="#c822ff"></stop></linearGradient><path fill="url(#7OC0bb_0rkmVY7Mwj6ZH6e_43995_gr5)" d="M26 22H38V24H26z"></path><linearGradient id="7OC0bb_0rkmVY7Mwj6ZH6f_43995_gr6" x1="32" x2="32" y1="5.333" y2="58.343" gradientUnits="userSpaceOnUse" spreadMethod="reflect"><stop offset="0" stop-color="#1a6dff"></stop><stop offset="1" stop-color="#c822ff"></stop></linearGradient><path fill="url(#7OC0bb_0rkmVY7Mwj6ZH6f_43995_gr6)" d="M26 26H38V28H26z"></path>
</svg>
            `;
            docContainer.innerHTML = svgIcon;

            // Create a span for the filename
            const filenameSpan = document.createElement('span');
            filenameSpan.textContent = mediaItem.name; // Set the filename
            filenameSpan.classList.add('filename-x-lar'); // Add class for styling

            // Add click event to show description modal
            docContainer.addEventListener('click', function() {
                imageTitle.textContent = mediaItem.name; // Set image title to the file name
                imageDescription.innerHTML = `${svgIcon} <br><br><b>Descriptions</b><br><br>File name: <input class="bomq-input" style="width:350px;" type="text" id="file${mediaItem.sn}" value="${mediaItem.name}"><br><br>Date: ${new Date(mediaItem.modified * 1000).toLocaleDateString()}<br><br>File Size: ${mediaItem.size + ' ' + mediaItem.sizext}<br><br>Document text: <input class="bomq-input" style="width:350px;" value="${mediaItem.name.split('.').slice(0, -1).join('.')}" type="text" id="alt${mediaItem.sn}"><br><br>URL: <input class="bomq-input" style="width:350px;" value="${mediaItem.src}" type="text" id="url${mediaItem.sn}"> <br><br><br> <button id="deleteButton${mediaItem.sn}">Delete</button> <button id="renameButton${mediaItem.sn}">Rename</button>`;
                descriptionModal.style.display = 'block'; // Show the description modal
      
      // Delete button functionality
document.getElementById('deleteButton'+mediaItem.sn).addEventListener('click', function() {
    if (mediaItem) {
        const confirmDelete = confirm(`Are you sure you want to delete ${mediaItem.name}?`);
        if (confirmDelete) {
            // Make a DELETE request to your server
            fetch(`media-uploader-delete?path=${mediaItem.path}&filename=${mediaItem.name}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.statusCode === 200) {
                        alert('File deleted successfully.');
                        descriptionModal.style.display = 'none'; // Close the modal
                        loadMediaFiles(currentPage, searchInput.value, currentFilter); // Reload media files
                    } else {
                        alert('Error: '+data.msg);
                        descriptionModal.style.display = 'none'; // Close the modal
                    }
                })
                .catch(error => {
                 alert('Error: ' + error.message);
             });
        }
    }
});

// Rename button functionality
document.getElementById('renameButton' + mediaItem.sn).addEventListener('click', function() {
    if (mediaItem) {
        let newFilename = document.getElementById('file'+mediaItem.sn);
            // Make a POST request to your server to rename the file
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'media-uploader-rename', true);
            let formData = new FormData();
            formData.append('path',mediaItem.path);
            formData.append('oldFilename',mediaItem.name);
            formData.append('newFilename',newFilename.value);
            xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 && xhr.responseText==='Success') {
                    alert('File renamed successfully.');
                    descriptionModal.style.display = 'none'; // Close the modal
                    loadMediaFiles(currentPage, searchInput.value, currentFilter); // Reload media files
                } else {
                    alert(`Error occurred: ${xhr.responseText}`); // Show specific error message
                    descriptionModal.style.display = 'none';
                }
            }
        };
            xhr.send(formData);
    }
});
            });
            docContainer.appendChild(filenameSpan);
            itemDiv.appendChild(docContainer);
            mediaContainer.appendChild(itemDiv);
       }
    });

    updatePaginationControls(); // Update pagination controls
}

// Function to update pagination controls
function updatePaginationControls() {
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;
}

// Handle pagination button events
document.getElementById('prevPage').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        loadMediaFiles(currentPage, searchInput.value, currentFilter); // Pass the search term
        document.getElementById('mediaContainer').scrollIntoView(true);
    }
});

document.getElementById('nextPage').addEventListener('click', function() {
    if (currentPage < totalPages) {
        currentPage++;
        loadMediaFiles(currentPage, searchInput.value, currentFilter); // Pass the search term
        document.getElementById('mediaContainer').scrollIntoView(true);
    }
});

// Show the upload modal
uploadBtn.addEventListener('click', function() {
    modal.style.display = 'block';
});

// Close the upload modal
closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Close the upload modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle file upload
submitUpload.addEventListener('click', function() {
    const files = fileInput.files;

    if (files.length === 0) {
        alert('Please select a file to upload.');
        return;
    }
    let successfulUploads = 0;
    const totalFiles2 = files.length;
    // Create a FormData object to hold the files
    const formData = new FormData();
    Array.from(files).forEach(file => {
        formData.append('upload', file); // Append each file to FormData
        // Create a new XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'media-uploader', true); // Update with your PHP file path

    // Set up a handler for when the request finishes
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.responseText==='Success') {
            successfulUploads++;
        } else {
            // Error handling
            alert('Error uploading files. Please try again.');
            modal.style.display = 'none';
            fileInput.value = ''; 
        }
         // Check if all uploads have been processed
            if (successfulUploads === totalFiles2) {
                alert('Files uploaded successfully...');
                modal.style.display = 'none'; // Close modal
                fileInput.value = ''; // Clear file input
                loadMediaFiles(currentPage, searchInput.value, currentFilter); // Reload media files
            }
    };

    // Send the request with the FormData
    xhr.send(formData);
    });
});

// Close the description modal
closeDescription.addEventListener('click', function() {
    descriptionModal.style.display = 'none';
});

// Close the description modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === descriptionModal) {
        descriptionModal.style.display = 'none';
    }
});

// Add event listener for search input
searchInput.addEventListener('input', function() {
    currentPage = 1; // Reset to the first page on new search
    loadMediaFiles(currentPage, searchInput.value, currentFilter); // Load media files with the search term
});

// Event listeners for filter links
const filterLinks = document.querySelectorAll('ul li .media-link');

filterLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default link behavior
        currentFilter = this.textContent; // Set the current filter based on link text
        currentPage = 1; // Reset to the first page
        loadMediaFiles(currentPage, searchInput.value, currentFilter); // Load media files with the current filter
        updateActiveLink(this); // Update active link style
    });
});

// Function to update active link style
function updateActiveLink(activeLink) {
    filterLinks.forEach(link => link.classList.remove('active')); // Remove active class from all
    activeLink.classList.add('active'); // Add active class to the clicked link
}

// Load media files on initial page load
window.addEventListener('load', function() {
    loadMediaFiles(currentPage);
});