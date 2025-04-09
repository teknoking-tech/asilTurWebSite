/**
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
    
    // Galeri konteyner ve yükleniyor göstergesi
    const galleryContainer = document.getElementById('gallery-items');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    // Masonry layout için değişken
    let msnry;
    
    // Galeri öğelerini oluşturma fonksiyonu
    function createGalleryItems() {
      // Toplam fotoğraf ve video sayısı
      const totalPhotos = 149; // asil19tur (1).jpg'den asil19tur (149).jpg'e kadar
      const totalVideos = 10;  // asil19tur (1).mp4'ten asil19tur (10).mp4'e kadar
      
      // Fotoğrafları ekle
      for (let i = 1; i <= totalPhotos; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'col-lg-4 col-md-6 col-sm-6 gallery-item photo';
        
        galleryItem.innerHTML = `
          <a href="assets/images/sirketResimleri/asil19tur (${i}).jpg" data-lightbox="asil-tur-gallery" data-title="Asil Tur Fotoğraf ${i}">
            <img class="img-fluid lazy" src="assets/images/placeholder.jpg" data-src="assets/images/sirketResimleri/asil19tur (${i}).jpg" alt="Asil Tur Fotoğraf ${i}">
            <div class="gallery-item-overlay">
              <h5>Asil Tur - Fotoğraf ${i}</h5>
            </div>
          </a>
        `;
        
        galleryContainer.appendChild(galleryItem);
      }
      
      // Videoları ekle
      for (let i = 1; i <= totalVideos; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'col-lg-4 col-md-6 col-sm-6 gallery-item video';
        
        // Video önizleme için rastgele bir resim kullan
        const thumbIndex = Math.floor(Math.random() * totalPhotos) + 1;
        
        galleryItem.innerHTML = `
          <div class="video-thumbnail" data-video="assets/images/sirketResimleri/asil19tur (${i}).mp4" data-index="${i}">
            <img class="img-fluid lazy" src="assets/images/placeholder.jpg" data-src="assets/images/sirketResimleri/asil19tur (${thumbIndex}).jpg" alt="Asil Tur Video ${i}">
            <div class="video-play-icon">
              <i class="fa fa-play-circle"></i>
            </div>
            <div class="gallery-item-overlay">
              <h5>Asil Tur - Video ${i}</h5>
            </div>
          </div>
        `;
        
        galleryContainer.appendChild(galleryItem);
      }
      
      // Yükleniyor göstergesini gizle
      loadingIndicator.style.display = 'none';
      
      // Lazy loading başlat
      initializeLazyLoading();
      
      // Tüm resimlerin yüklenmesini bekle ve Masonry layout'u başlat
      imagesLoaded(galleryContainer, function() {
        msnry = new Masonry(galleryContainer, {
          itemSelector: '.gallery-item',
          columnWidth: '.gallery-item',
          percentPosition: true
        });
        
        // Video elemanlarını dinle
        attachVideoListeners();
      });
    }
    
    // Galeri öğelerini oluştur
    createGalleryItems();
    
    // Filtreleme işlevi
    const filterButtons = document.querySelectorAll('.btn-gallery-filter');
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
    
    // Lazy loading için
    function initializeLazyLoading() {
      const lazyImages = document.querySelectorAll('img.lazy');
      
      if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              const lazyImage = entry.target;
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.classList.remove('lazy');
              lazyImageObserver.unobserve(lazyImage);
            }
          });
        });
  
        lazyImages.forEach(function(lazyImage) {
          lazyImageObserver.observe(lazyImage);
        });
      } else {
        // Fallback for browsers without IntersectionObserver support
        lazyLoad();
        window.addEventListener('scroll', throttle(lazyLoad, 200));
        window.addEventListener('resize', throttle(lazyLoad, 200));
      }
    }
    
    function lazyLoad() {
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
      const modalVideo = document.querySelector('.modal-video');
      
      videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
          const videoSrc = this.getAttribute('data-video');
          const index = this.getAttribute('data-index');
          
          // Video modal ayarları
          const videoPlayer = document.querySelector('.modal-video');
          const videoSource = videoPlayer.querySelector('source');
          const videoTitle = document.getElementById('videoModalLabel');
          
          videoSource.src = videoSrc;
          videoTitle.textContent = `Asil Tur - Video ${index}`;
          
          videoPlayer.load();
          
          // Modal'ı aç
          $('#videoModal').modal('show');
          
          // Video hazır olduğunda fade-in efekti ekle
          videoPlayer.addEventListener('canplay', function() {
            videoPlayer.style.opacity = '1';
          });
        });
      });
      
      // Modal kapandığında videoyu durdur
      $('#videoModal').on('hidden.bs.modal', function () {
        modalVideo.pause();
        modalVideo.currentTime = 0;
        modalVideo.style.opacity = '0';
      });
    }
    
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
    
    // Lightbox ayarları
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