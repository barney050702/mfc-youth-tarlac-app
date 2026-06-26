(function() {
  const btnUpload = document.getElementById('btn-upload-photo');
  const btnCancelUpload = document.getElementById('btn-cancel-upload');
  const uploadFormContainer = document.getElementById('gallery-upload-form');
  const formUpload = document.getElementById('form-upload-photo');
  const photoInput = document.getElementById('gallery-photo-input');
  const activitySelect = document.getElementById('gallery-activity-select');
  const filterSelect = document.getElementById('gallery-filter-select');
  const galleryGrid = document.getElementById('gallery-grid');
  const progressContainer = document.getElementById('upload-progress-container');
  const progressBar = document.getElementById('upload-progress-bar');
  const progressText = document.getElementById('upload-progress-text');
  const btnSubmit = document.getElementById('btn-submit-photo-upload');

  let loadedPhotos = [];

  // Toggle form
  btnUpload?.addEventListener('click', () => {
    if (typeof isAdmin !== 'undefined' && !isAdmin) {
      if(typeof showToast === 'function') showToast('Admin access required to upload photos.', 'error');
      return;
    }
    uploadFormContainer.classList.remove('hidden');
  });

  btnCancelUpload?.addEventListener('click', () => {
    uploadFormContainer.classList.add('hidden');
    formUpload.reset();
  });

  // Filter change
  filterSelect?.addEventListener('change', () => {
    renderPhotoGrid(filterSelect.value);
  });

  window.renderGallery = function() {
    populateActivityDropdowns();
    fetchPhotos();
  };

  function populateActivityDropdowns() {
    if (typeof dbActivities === 'undefined') return;
    const activities = dbActivities.getAll().sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Populate Upload Select
    if (activitySelect) {
      activitySelect.innerHTML = '<option value="">-- Select an Activity --</option>';
      activities.forEach(act => {
        const option1 = document.createElement('option');
        option1.value = act.id;
        option1.textContent = `${act.date} - ${act.title}`;
        activitySelect.appendChild(option1);
      });
    }

    // Populate Filter Select
    if (filterSelect) {
      filterSelect.innerHTML = '<option value="all">All Activities</option>';
      activities.forEach(act => {
        const option2 = document.createElement('option');
        option2.value = act.id;
        option2.textContent = `${act.date} - ${act.title}`;
        filterSelect.appendChild(option2);
      });
    }
  }

  function fetchPhotos() {
    if (typeof firebase === 'undefined' || typeof db === 'undefined') {
      if (galleryGrid) galleryGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #f87171; padding: 3rem;">Firebase is not connected.</div>';
      return;
    }

    if (galleryGrid) galleryGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 3rem;">Loading photos... <i data-lucide="loader" class="lucide-spin" style="display:inline-block; margin-left: 8px;"></i></div>';
    if(typeof lucide !== 'undefined') lucide.createIcons();

    db.collection('activity_photos').orderBy('timestamp', 'desc').get()
      .then((snapshot) => {
        loadedPhotos = [];
        snapshot.forEach(doc => {
          loadedPhotos.push({ id: doc.id, ...doc.data() });
        });
        renderPhotoGrid(filterSelect?.value || 'all');
      })
      .catch((error) => {
        console.error("Error fetching photos: ", error);
        if (galleryGrid) galleryGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #f87171; padding: 3rem;">Error loading photos.</div>';
      });
  }

  function renderPhotoGrid(filterActivityId) {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    const filtered = filterActivityId === 'all' 
      ? loadedPhotos 
      : loadedPhotos.filter(p => p.activityId === filterActivityId);

    if (filtered.length === 0) {
      galleryGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 3rem;">No photos found.</div>';
      return;
    }

    filtered.forEach(photo => {
      const card = document.createElement('div');
      card.className = 'gallery-img-card';
      card.onclick = () => {
        const viewer = document.getElementById('image-viewer-modal');
        const viewerImg = document.getElementById('image-viewer-img');
        if (viewer && viewerImg) {
          viewerImg.src = photo.url;
          viewer.classList.remove('hidden');
        }
      };

      const dateStr = new Date(photo.timestamp).toLocaleDateString();

      card.innerHTML = `
        <img src="${photo.url}" loading="lazy" alt="${photo.activityName}">
        <div class="gallery-img-overlay">
          <div class="gallery-img-title" title="${photo.activityName}">${photo.activityName}</div>
          <div class="gallery-img-date">${dateStr}</div>
        </div>
      `;
      galleryGrid.appendChild(card);
    });
  }

  formUpload?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof isAdmin !== 'undefined' && !isAdmin) {
      if(typeof showToast === 'function') showToast('Admin access required to upload photos.', 'error');
      return;
    }

    const file = photoInput.files[0];
    const selectedActId = activitySelect.value;
    
    if (!file || !selectedActId) return;

    if (typeof firebase === 'undefined' || !firebase.storage) {
      if(typeof showToast === 'function') showToast('Firebase Storage is not initialized.', 'error');
      return;
    }

    // Find activity name
    const act = typeof dbActivities !== 'undefined' ? dbActivities.get(selectedActId) : null;
    const actName = act ? act.title : 'Unknown Activity';

    const storageRef = firebase.storage().ref();
    const fileName = `activity_photos/${Date.now()}_${file.name}`;
    const uploadTask = storageRef.child(fileName).put(file);

    progressContainer.classList.remove('hidden');
    btnSubmit.disabled = true;

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBar.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
      }, 
      (error) => {
        console.error("Upload failed:", error);
        if(typeof showToast === 'function') showToast('Photo upload failed: ' + error.message, 'error');
        resetUploadForm();
      }, 
      () => {
        // Upload successful
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          // Save to Firestore
          if (typeof db !== 'undefined') {
            db.collection('activity_photos').add({
              url: downloadURL,
              activityId: selectedActId,
              activityName: actName,
              timestamp: Date.now()
            }).then(() => {
              if(typeof showToast === 'function') showToast('Photo uploaded successfully!', 'success');
              resetUploadForm();
              fetchPhotos(); // Refresh grid
            }).catch(err => {
              console.error("Error saving metadata: ", err);
              if(typeof showToast === 'function') showToast('Error saving photo data.', 'error');
              resetUploadForm();
            });
          }
        });
      }
    );
  });

  function resetUploadForm() {
    progressContainer.classList.add('hidden');
    progressBar.style.width = '0%';
    progressText.textContent = '0%';
    btnSubmit.disabled = false;
    formUpload.reset();
    uploadFormContainer.classList.add('hidden');
  }

})();
