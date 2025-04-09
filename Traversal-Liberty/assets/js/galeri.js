// Galeri öğelerini yükle
function loadGalleryItems(category) {
    const containerElement = document.getElementById(`${category}-container`);
    const categoryInfo = galleryCategories[category];
    
    // Fotoğrafları ekle
    for (let i = 0; i < categoryInfo.photoCount; i++) {
      const photoIndex = categoryInfo.startIndex + i;
      
      const galleryItem = document.createElement('div');
      galleryItem.className = 'col-lg-4 col-md-6 col-sm-6 gallery-item photo';
      
      galleryItem.innerHTML = `
        <a href="assets/images/sirketResimleri/asil19tur (${photoIndex}).jpg" data-lightbox="${category}-photos" data-title="${categoryInfo.title} - Fotoğraf ${i+1}">
          <img class="img-fluid lazy" src="assets/images/g${(i % 9) + 1}.jpg" data-src="assets/images/sirketResimleri/asil19tur (${photoIndex}).jpg" alt="${categoryInfo.title} - Fotoğraf ${i+1}">
          <div class="gallery-item-overlay">
            <h5>${categoryInfo.title} - Fotoğraf ${i+1}</h5>
          </div>
        </a>
      `;
      
      containerElement.appendChild(galleryItem);
    }
    
    // Videoları ekle
    for (let i = 0; i < categoryInfo.videoCount; i++) {
      const videoIndex = i + 1;
      
      const galleryItem = document.createElement('div');
      galleryItem.className = 'col-lg-4 col-md-6 col-sm-6 gallery-item video';
      
      galleryItem.innerHTML = `
        <div class="video-thumbnail" data-video="assets/images/sirketResimleri/asil19tur (${videoIndex}).mp4" data-category="${category}" data-index="${i+1}">
          <img class="img-fluid lazy" src="assets/images/g${(i % 9) + 1}.jpg" data-src="assets/images/sirketResimleri/asil19tur (${categoryInfo.startIndex + i}).jpg" alt="${categoryInfo.title} - Video ${i+1}">
          <div class="video-play-icon">
            <i class="fa fa-play-circle"></i>
          </div>
          <div class="gallery-item-overlay">
            <h5>${categoryInfo.title} - Video ${i+1}</h5>
          </div>
        </div>
      `;
      
      containerElement.appendChild(galleryItem);
    }
    
    // Lazy loading ve masonry layout'u ayarla
    initializeLazyLoading();
    initializeMasonryLayout(category);
    attachVideoListeners();
  }
  
  // Masonry layout'u başlat
  function initializeMasonryLayout(category) {
    const containerElement = document.getElementById(`${category}-container`);
    
    // imagesLoaded ile tüm resimlerin yüklenmesini bekle
    imagesLoaded(containerElement, function() {
      // Masonry layout'u başlat
      const msnry = new Masonry(containerElement, {
        itemSelector: '.gallery-item',
        columnWidth: '.gallery-item',
        percentPosition: true
      });
      
      // Filtreleme için butonları ayarla
      setupFilterButtons(category, msnry);
    });
  }
  
  // Filtreleme butonlarını ayarla
  function setupFilterButtons(category, msnry) {
    const filterButtons = document.querySelectorAll(`.btn-gallery-filter[data-section="${category}"]`);
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Aktif buton sınıfını değiştir
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        const galleryItems = document.querySelectorAll(`#${category}-container .gallery-item`);
        
        galleryItems.forEach(item => {
          if (filterValue === 'all') {
            item.style.display = 'block';
          } else if (item.classList.contains(filterValue)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
        
        // Layout'u güncelle
        setTimeout(function() {
          msnry.layout();
        }, 300);
      });
    });
  }
  
  // Lazy loading için
  function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    lazyImages.forEach(img => {
      if (img.getBoundingClientRect().top < window.innerHeight + 500) {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      }
    });
  }
  
  // Video önizleme elemanlarını dinle
  function attachVideoListeners() {
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    
    videoThumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        const videoSrc = this.getAttribute('data-video');
        const category = this.getAttribute('data-category');
        const index = this.getAttribute('data-index');
        
        const videoPlayer = document.querySelector('.modal-video');
        const videoSource = videoPlayer.querySelector('source');
        const videoTitle = document.getElementById('videoModalLabel');
        
        videoSource.src = videoSrc;
        videoTitle.textContent = `${galleryCategories[category].title} - Video ${index}`;
        
        videoPlayer.load();
        
        // Modal'ı aç
        $('#videoModal').modal('show');
        
        // Video hazır olduğunda fade-in efekti ekle
        videoPlayer.addEventListener('canplay', function() {
          videoPlayer.style.opacity = '1';
        });
      });
    });
  }/**
 * Asil Tur - Galeri sayfası JavaScript fonksiyonları
 */

document.addEventListener('DOMContentLoaded', function() {
  // Tema değişkenleri
  const brandName = document.querySelector('.brand-name');
  const brandLogo = document.getElementById('brandLogo');
  const checkbox = document.getElementById('checkbox');
  
  // Tema değişim fonksiyonları
  function setDarkMode() {
    document.body.classList.add('dark-mode');
    brandName.style.color = '#e30713';
    brandLogo.src = 'assets/images/WhatsApp Image 2024-03-16 at 13.23.27_1158a63b-Photoroom.png';
    localStorage.setItem('theme', 'dark');
    checkbox.checked = true;
  }

  function setLightMode() {
    document.body.classList.remove('dark-mode');
    brandName.style.color = '#2C3338';
    brandLogo.src = 'assets/images/sonkus.png';
    localStorage.setItem('theme', 'light');
    checkbox.checked = false;
  }

  // Tema değişimi için event listener
  checkbox.addEventListener('change', function() {
    if (this.checked) {
      setDarkMode();
    } else {
      setLightMode();
    }
  });

  // Sayfa yüklendiğinde tema tercihini kontrol et
  if (localStorage.getItem('theme') === 'dark') {
    setDarkMode();
  } else {
    setLightMode();
  }
  
  // Galeri kategorileri ve içerikleri
  const galleryCategories = {
    'karadeniz': {
      title: 'Karadeniz Turu',
      startIndex: 1,
      photoCount: 42,
      videoCount: 3,
      description: 'Yemyeşil yaylaları ve eşsiz doğasıyla Karadeniz'
    },
    'kapadokya': {
      title: 'Kapadokya Turu',
      startIndex: 43,
      photoCount: 35,
      videoCount: 2,
      description: 'Peri bacaları ve sıcak hava balonlarıyla ünlü Kapadokya'
    },
    'ege': {
      title: 'Ege Turu',
      startIndex: 78,
      photoCount: 30,
      videoCount: 2,
      description: 'Antik kentleri ve masmavi denizleriyle Ege'
    },
    'dogu': {
      title: 'Doğu Anadolu Turu',
      startIndex: 108,
      photoCount: 28,
      videoCount: 1,
      description: 'Kültürel zenginlik ve doğal güzellikleriyle Doğu Anadolu'
    },
    'yurtdisi': {
      title: 'Yurt Dışı Turları',
      startIndex: 136,
      photoCount: 14, // Burada 15 yazıyordu ama sonraki hesaplamada 149'a tamamlamak için 14 olması gerekiyor
      videoCount: 1,
      description: 'Farklı ülkeler ve kültürlerle unutulmaz anılar'
    }
  };
  
  // Galeri bölümlerini aç/kapat
  window.toggleGallerySection = function(category) {
    const sectionElement = document.getElementById(`${category}-gallery`);
    const buttonElement = document.querySelector(`.category-card[data-category="${category}"] .btn-gallery-toggle`);
    
    if (sectionElement.style.display === 'none') {
      // Tüm bölümleri kapat
      document.querySelectorAll('.gallery-section').forEach(section => {
        section.style.display = 'none';
      });
      
      // Tüm butonları sıfırla
      document.querySelectorAll('.btn-gallery-toggle').forEach(btn => {
        btn.innerHTML = 'Göster <i class="fa fa-angle-down"></i>';
        btn.classList.remove('active');
      });
      
      // Seçili bölümü aç
      sectionElement.style.display = 'block';
      buttonElement.innerHTML = 'Gizle <i class="fa fa-angle-up"></i>';
      buttonElement.classList.add('active');
      
      // Eğer bu bölüm daha önce yüklenmemişse, galeri öğelerini oluştur
      const containerElement = document.getElementById(`${category}-container`);
      if (containerElement.children.length === 0) {
        loadGalleryItems(category);
      }
      
      // Sayfayı bölüme kaydır
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Bölümü kapat
      sectionElement.style.display = 'none';
      buttonElement.innerHTML = 'Göster <i class="fa fa-angle-down"></i>';
      buttonElement.classList.remove('active');
    }
  };
  
  // Galeri bölümünü kapat
  window.closeGallerySection = function(category) {
    const sectionElement = document.getElementById(`${category}-gallery`);
    const buttonElement = document.querySelector(`.category-card[data-category="${category}"] .btn-gallery-toggle`);
    
    sectionElement.style.display = 'none';
    buttonElement.innerHTML = 'Göster <i class="fa fa-angle-down"></i>';
    buttonElement.classList.remove('active');
    
    // Kategoriler bölümüne geri kaydır
    document.querySelector('.gallery-categories').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  // Lightbox özelleştirme
  document.addEventListener('click', function(e) {
    if (e.target.closest('a[data-lightbox]')) {
      // Lightbox açıldığında butonları daha belirgin yap
      setTimeout(() => {
        const prevBtn = document.querySelector('.lb-prev');
        const nextBtn = document.querySelector('.lb-next');
        const closeBtn = document.querySelector('.lb-close');
        
        if (prevBtn) prevBtn.style.opacity = '1';
        if (nextBtn) nextBtn.style.opacity = '1';
        if (closeBtn) {
          closeBtn.style.opacity = '1';
          closeBtn.style.color = '#e30713';
        }
      }, 100);
    }
  });
  
  // Galeri Fonksiyonları
  const galleryContainer = document.querySelector('.gallery-container');
  
  // Masonry layout için
  let msnry;
  
  // Fotoğraf ve video öğelerini oluşturma fonksiyonu
  function createGalleryItems() {
    // Yükleniyor göstergesini gizle
    const loadingIndicator = document.getElementById('loading-indicator');
    
    // Fotoğrafları ekle (1-149 arası)
    for (let i = 1; i <= 149; i++) {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'col-lg-4 col-md-6 col-sm-6 gallery-item photo';
      
      // Lazy loading için
      // Her bir resim için HTML oluştur
      galleryItem.innerHTML = `
        <a href="assets/images/sirketResimleri/asil19tur (${i}).jpg" data-lightbox="gallery" data-title="Asil Tur Gezisi ${i}">
          <img class="img-fluid lazy" src="assets/images/g${i % 9 + 1}.jpg" data-src="assets/images/sirketResimleri/asil19tur (${i}).jpg" alt="Asil Tur Gezisi ${i}">
          <div class="gallery-item-overlay">
            <h5>Asil Tur Gezisi ${i}</h5>
          </div>
        </a>
      `;
      
      galleryContainer.appendChild(galleryItem);
    }
    
    // Videoları ekle (1-9 arası)
    for (let i = 1; i <= 9; i++) {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'col-lg-4 col-md-6 col-sm-6 gallery-item video';
      
      // Video önizleme resmi olarak i. fotoğrafı kullan
      const thumbnailIndex = i * 10; // Örneğin video 1 için 10. fotoğraf
      const thumbnailPath = thumbnailIndex <= 149 ? 
        `assets/images/sirketResimleri/asil19tur (${thumbnailIndex}).jpg` : 
        `assets/images/sirketResimleri/asil19tur (1).jpg`;
      
      // Her bir video için HTML oluştur
      galleryItem.innerHTML = `
        <div class="video-thumbnail" data-video="assets/images/sirketResimleri/asil19tur (${i}).mp4">
          <img class="img-fluid lazy" src="assets/images/g${i % 9 + 1}.jpg" data-src="${thumbnailPath}" alt="Asil Tur Video ${i}">
          <div class="video-play-icon">
            <i class="fa fa-play-circle"></i>
          </div>
          <div class="gallery-item-overlay">
            <h5>Asil Tur Video ${i}</h5>
          </div>
        </div>
      `;
      
      galleryContainer.appendChild(galleryItem);
    }
    
    // Yükleniyor göstergesini gizle
    loadingIndicator.style.display = 'none';
    
    // Tüm resimlerin yüklenmesini bekle ve Masonry layout'u başlat
    imagesLoaded(galleryContainer, function() {
      msnry = new Masonry(galleryContainer, {
        itemSelector: '.gallery-item',
        columnWidth: '.gallery-item',
        percentPosition: true
      });
    });
  }
  
  // Galeri öğelerini oluştur
  createGalleryItems();
  
  // Filtreleme işlevi
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Aktif buton sınıfını değiştir
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      const galleryItems = document.querySelectorAll('.gallery-item');
      
      galleryItems.forEach(item => {
        if (filterValue === 'all') {
          item.style.display = 'block';
          item.style.opacity = '1';
          item.style.visibility = 'visible';
        } else if (item.classList.contains(filterValue)) {
          item.style.display = 'block';
          item.style.opacity = '1';
          item.style.visibility = 'visible';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
          item.style.visibility = 'hidden';
        }
      });
      
      // Layout'u güncelle
      setTimeout(function() {
        msnry.layout();
      }, 300);
    });
  });
  
  // Video modal işlevi
  videoModal.pause();
  modalVideo.pause();
  const modalTitle = document.getElementById('videoModalLabel');
  const videoThumbnails = document.querySelectorAll('.video-thumbnail');
  
  videoThumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', function() {
      const videoSrc = this.getAttribute('data-video');
      modalVideo.setAttribute('src', videoSrc);
      modalTitle.textContent = `Asil Tur Video ${index + 1}`;
      
      // Bootstrap modal'ı aç
      $('#videoModal').modal('show');
      
      // Fade in efekti ekle
      setTimeout(() => {
        modalVideo.style.opacity = '1';
      }, 300);
    });
  });
  
  // Modal kapandığında videoyu durdur
  $('#videoModal').on('hidden.bs.modal', function () {
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.style.opacity = '0';
  });
  
  // Lightbox ayarları
  lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true,
    'albumLabel': "Resim %1 / %2",
    'fadeDuration': 300,
    'imageFadeDuration': 300,
    'disableScrolling': true,
    'alwaysShowNavOnTouchDevices': true,
    'showImageNumberLabel': true,
    'positionFromTop': 100,
    'maxWidth': 1200,
    'maxHeight': 800
  });
  
  // Daha basit bir lazy loading yaklaşımı
  function lazyLoad() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    lazyImages.forEach(img => {
      if (img.getBoundingClientRect().top < window.innerHeight + 500) {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      }
    });
  }
  
  // Sayfa yüklenince ve kaydırma sırasında lazy loading'i çalıştır
  window.addEventListener('load', lazyLoad);
  window.addEventListener('scroll', throttle(lazyLoad, 200));

  // Throttle fonksiyonu (performans için)
  function throttle(func, delay) {
    let lastCall = 0;
    return function() {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return func.apply(this, arguments);
    };
  }
  
  // Video modal işlevi
  const videoModal = document.getElementById('videoModal');
  const modalVideo = document.querySelector('.modal-video');
  
  // Modal kapandığında videoyu durdur
  $('#videoModal').on('hidden.bs.modal', function () {
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.style.opacity = '0';
  });
  
  // Lightbox özelleştirme
  lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true,
    'albumLabel': "Fotoğraf %1 / %2",
    'fadeDuration': 300,
    'imageFadeDuration': 300,
    'disableScrolling': true,
    'alwaysShowNavOnTouchDevices': true,
    'showImageNumberLabel': true,
    'positionFromTop': 100,
    'maxWidth': 1200,
    'maxHeight': 800
  });
  
  // Lightbox özelleştirme
  document.addEventListener('click', function(e) {
    if (e.target.closest('a[data-lightbox]')) {
      // Lightbox açıldığında butonları daha belirgin yap
      setTimeout(() => {
        const prevBtn = document.querySelector('.lb-prev');
        const nextBtn = document.querySelector('.lb-next');
        const closeBtn = document.querySelector('.lb-close');
        
        if (prevBtn) prevBtn.style.opacity = '1';
        if (nextBtn) nextBtn.style.opacity = '1';
        if (closeBtn) {
          closeBtn.style.opacity = '1';
          closeBtn.style.color = '#e30713';
        }
      }, 100);
    }
  });
  
  // Yukarı kaydırma butonu
  const scrollToTopButton = document.getElementById('scrollToTop');
  
  window.addEventListener('scroll', function() {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
      scrollToTopButton.classList.add('visible');
    } else {
      scrollToTopButton.classList.remove('visible');
    }
  });
  
  scrollToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
  
  // Yukarı kaydırma butonu
  const scrollToTopButton = document.getElementById('scrollToTop');
  
  window.addEventListener('scroll', function() {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
      scrollToTopButton.classList.add('visible');
    } else {
      scrollToTopButton.classList.remove('visible');
    }
  });
  
  scrollToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });