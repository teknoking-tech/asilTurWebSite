/**
 * Asil Tur - Grid Düzeltmeli Galeri JavaScript
 * Güncellenmiş Dosya Sayıları (158 resim, 10 video)
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
    const paginationContainer = document.getElementById('gallery-pagination');
    const emptyState = document.querySelector('.gallery-empty');
    
    // Galeri sabitleri
    const ITEMS_PER_PAGE = 9; // Sayfa başına öğe sayısını daha az yaparak daha düzenli görünüm
    const totalPhotos = 158; // asil19tur (1).jpg'den asil19tur (158).jpg'e kadar - GÜNCELLENDİ
    const totalVideos = 10;  // asil19tur (1).mp4'ten asil19tur (10).mp4'e kadar
    let currentPage = 1;
    let totalPages = 0;
    let currentFilter = 'all';
    let allItems = [];
    
    // Galeriyi başlat
    function initGallery() {
      // Tüm öğe verilerini hazırla
      prepareGalleryItems();
      
      // Sayfalamayı oluştur
      createPagination();
      
      // İlk sayfayı göster
      displayGalleryPage(1);
      
      // Filtre butonlarını başlat
      initFilterButtons();
    }
    
    // Tüm galeri öğelerini hazırla
    function prepareGalleryItems() {
      // Resimleri diziye ekle
      for (let i = 1; i <= totalPhotos; i++) {
        allItems.push({
          type: 'photo',
          index: i,
          src: `assets/images/sirketResimleri/asil19tur (${i}).jpg`,
          title: `Asil Tur Fotoğraf ${i}`
        });
      }
      
      // Videoları diziye ekle
      for (let i = 1; i <= totalVideos; i++) {
        const thumbIndex = Math.floor(Math.random() * totalPhotos) + 1;
        allItems.push({
          type: 'video',
          index: i,
          src: `assets/images/sirketResimleri/asil19tur (${i}).mp4`,
          thumb: `assets/images/sirketResimleri/asil19tur (${thumbIndex}).jpg`,
          title: `Asil Tur Video ${i}`
        });
      }
      
      // Tüm öğelere göre toplam sayfa sayısını hesapla
      updateTotalPages();
    }
    
    // Filtrelenmiş öğelere göre toplam sayfa sayısını güncelle
    function updateTotalPages() {
      const filteredItems = filterItems(currentFilter);
      totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
      
      if (filteredItems.length === 0) {
        emptyState.classList.remove('d-none');
      } else {
        emptyState.classList.add('d-none');
      }
      
      // Yeni toplam ile sayfalama oluştur
      createPagination();
    }
    
    // Türe göre öğeleri filtrele
    function filterItems(filter) {
      if (filter === 'all') {
        return allItems;
      } else {
        return allItems.filter(item => item.type === filter);
      }
    }
    
    // Mevcut sayfa için galeri öğelerini göster
    function displayGalleryPage(page) {
      // Mevcut galeriyi temizle
      galleryContainer.innerHTML = '';
      
      // Filtrelenmiş öğeleri al
      const filteredItems = filterItems(currentFilter);
      
      // Mevcut sayfa için başlangıç ve bitiş indeksini hesapla
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length);
      
      // Mevcut sayfa için öğeleri al
      const pageItems = filteredItems.slice(startIndex, endIndex);
      
      // Boş durum kontrolü
      if (pageItems.length === 0) {
        emptyState.classList.remove('d-none');
      } else {
        emptyState.classList.add('d-none');
      }
      
      // Galeri öğelerini oluştur ve ekle
      pageItems.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${item.type}`;
        
        if (item.type === 'photo') {
          galleryItem.innerHTML = `
            <a href="${item.src}" data-lightbox="asil-tur-gallery" data-title="${item.title}">
              <img class="img-fluid lazy" src="assets/images/placeholder.jpg" data-src="${item.src}" alt="${item.title}">
              <div class="gallery-item-overlay">
                <h5>${item.title}</h5>
              </div>
            </a>
          `;
        } else { // video
          galleryItem.innerHTML = `
            <div class="video-thumbnail" data-video="${item.src}" data-index="${item.index}">
              <img class="img-fluid lazy" src="assets/images/placeholder.jpg" data-src="${item.thumb}" alt="${item.title}">
              <div class="video-play-icon">
                <i class="fa fa-play-circle"></i>
              </div>
              <div class="gallery-item-overlay">
                <h5>${item.title}</h5>
              </div>
            </div>
          `;
        }
        
        galleryContainer.appendChild(galleryItem);
      });
      
      // Mevcut sayfayı güncelle
      currentPage = page;
      
      // Aktif sayfalama butonunu güncelle
      updateActivePaginationButton();
      
      // Yükleniyor göstergesini gizle
      loadingIndicator.style.display = 'none';
      
      // Lazy loading'i başlat
      initializeLazyLoading();
      
      // Video dinleyicilerini ekle
      attachVideoListeners();
      
      // İlk sayfa değilse galerinin üstüne kaydır
      if (page > 1) {
        const gallerySection = document.querySelector('.w3l-gallery');
        gallerySection.scrollIntoView({behavior: 'smooth'});
      }
    }
    
    // Sayfalama butonlarını oluştur
    function createPagination() {
      paginationContainer.innerHTML = '';
      
      if (totalPages <= 1) {
        paginationContainer.parentElement.classList.add('d-none');
        return;
      } else {
        paginationContainer.parentElement.classList.remove('d-none');
      }
      
      // Önceki buton
      const prevButton = document.createElement('li');
      prevButton.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
      prevButton.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
      prevButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage > 1) {
          displayGalleryPage(currentPage - 1);
        }
      });
      paginationContainer.appendChild(prevButton);
      
      // Sayfa numarası butonları - Maksimum 5 sayfa göster
      const totalVisible = 5;
      let startPage = Math.max(1, currentPage - Math.floor(totalVisible / 2));
      let endPage = Math.min(totalPages, startPage + totalVisible - 1);
      
      // Başlangıç ve bitiş sayfalarını ayarla
      if (endPage - startPage + 1 < totalVisible) {
        startPage = Math.max(1, endPage - totalVisible + 1);
      }
      
      // İlk sayfa gösterilmiyorsa ellipsis ekle
      if (startPage > 1) {
        const firstPageButton = document.createElement('li');
        firstPageButton.className = 'page-item';
        firstPageButton.innerHTML = `<a class="page-link" href="#">1</a>`;
        firstPageButton.addEventListener('click', function(e) {
          e.preventDefault();
          displayGalleryPage(1);
        });
        paginationContainer.appendChild(firstPageButton);
        
        if (startPage > 2) {
          const ellipsisStart = document.createElement('li');
          ellipsisStart.className = 'page-item disabled';
          ellipsisStart.innerHTML = `<a class="page-link" href="#">...</a>`;
          paginationContainer.appendChild(ellipsisStart);
        }
      }
      
      // Sayfa numaralarını oluştur
      for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('li');
        pageButton.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageButton.addEventListener('click', function(e) {
          e.preventDefault();
          displayGalleryPage(i);
        });
        paginationContainer.appendChild(pageButton);
      }
      
      // Son sayfa gösterilmiyorsa ellipsis ekle
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          const ellipsisEnd = document.createElement('li');
          ellipsisEnd.className = 'page-item disabled';
          ellipsisEnd.innerHTML = `<a class="page-link" href="#">...</a>`;
          paginationContainer.appendChild(ellipsisEnd);
        }
        
        const lastPageButton = document.createElement('li');
        lastPageButton.className = 'page-item';
        lastPageButton.innerHTML = `<a class="page-link" href="#">${totalPages}</a>`;
        lastPageButton.addEventListener('click', function(e) {
          e.preventDefault();
          displayGalleryPage(totalPages);
        });
        paginationContainer.appendChild(lastPageButton);
      }
      
      // Sonraki buton
      const nextButton = document.createElement('li');
      nextButton.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
      nextButton.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
      nextButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage < totalPages) {
          displayGalleryPage(currentPage + 1);
        }
      });
      paginationContainer.appendChild(nextButton);
    }
    
    // Aktif sayfalama butonunu güncelle
    function updateActivePaginationButton() {
      const pageButtons = paginationContainer.querySelectorAll('.page-item');
      pageButtons.forEach(button => {
        const link = button.querySelector('.page-link');
        if (link && link.textContent && parseInt(link.textContent) === currentPage) {
          button.classList.add('active');
        } else if (!link.getAttribute('aria-label')) {
          button.classList.remove('active');
        }
      });
      
      // Önceki/sonraki butonların durumunu güncelle
      const prevButton = paginationContainer.querySelector('.page-item:first-child');
      const nextButton = paginationContainer.querySelector('.page-item:last-child');
      
      if (currentPage === 1) {
        prevButton.classList.add('disabled');
      } else {
        prevButton.classList.remove('disabled');
      }
      
      if (currentPage === totalPages) {
        nextButton.classList.add('disabled');
      } else {
        nextButton.classList.remove('disabled');
      }
    }
    
    // Filtre butonlarını başlat
    function initFilterButtons() {
      const filterButtons = document.querySelectorAll('.btn-gallery-filter');
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Aktif buton sınıfını güncelle
          filterButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          // Filtre değerini al
          const filterValue = this.getAttribute('data-filter');
          currentFilter = filterValue;
          
          // Filtreye göre toplam sayfa sayısını güncelle
          updateTotalPages();
          
          // Yeni filtre ile ilk sayfayı göster
          displayGalleryPage(1);
        });
      });
    }
    
    // Resimler için lazy loading
    function initializeLazyLoading() {
      const lazyImages = document.querySelectorAll('img.lazy');
      
      if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              const lazyImage = entry.target;
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.classList.add('loaded');
              lazyImage.classList.remove('lazy');
              lazyImageObserver.unobserve(lazyImage);
            }
          });
        });
  
        lazyImages.forEach(function(lazyImage) {
          lazyImageObserver.observe(lazyImage);
        });
      } else {
        // IntersectionObserver desteği olmayan tarayıcılar için fallback
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
          img.classList.add('loaded');
          img.classList.remove('lazy');
        }
      });
    }
    
    // Video önizleme elemanları için tıklama dinleyicileri
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
    
    // Performans için throttle fonksiyonu
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
      'disableScrolling': false,
      'alwaysShowNavOnTouchDevices': true,
      'showImageNumberLabel': true,
      'positionFromTop': 80,
      'maxWidth': 1200,
      'maxHeight': 800,
      'fitImagesInViewport': true
    });
    
    // Geliştirilmiş lightbox kontrolleri
    document.addEventListener('click', function(e) {
      if (e.target.closest('a[data-lightbox]')) {
        // Lightbox butonlarını daha görünür yap
        setTimeout(() => {
          const prevBtn = document.querySelector('.lb-prev');
          const nextBtn = document.querySelector('.lb-next');
          const closeBtn = document.querySelector('.lb-close');
          
          if (prevBtn) {
            prevBtn.style.opacity = '1';
            prevBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            prevBtn.style.borderRadius = '50%';
            prevBtn.style.width = '50px';
            prevBtn.style.height = '50px';
          }
          
          if (nextBtn) {
            nextBtn.style.opacity = '1';
            nextBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            nextBtn.style.borderRadius = '50%';
            nextBtn.style.width = '50px';
            nextBtn.style.height = '50px';
          }
          
          if (closeBtn) {
            closeBtn.style.opacity = '1';
            closeBtn.style.color = '#e30713';
            closeBtn.style.zIndex = '9999';
            
            // Kapatma butonunu daha belirgin yap
            const closeBtnContainer = document.querySelector('.lb-closeContainer');
            if (closeBtnContainer) {
              closeBtnContainer.style.position = 'absolute';
              closeBtnContainer.style.top = '10px';
              closeBtnContainer.style.right = '10px';
              closeBtnContainer.style.zIndex = '9999';
              closeBtnContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
              closeBtnContainer.style.padding = '5px 10px';
              closeBtnContainer.style.borderRadius = '20px';
              
              // Kapatma butonunun yanına metin ekle
              if (!closeBtnContainer.querySelector('.close-text')) {
                const closeText = document.createElement('span');
                closeText.className = 'close-text';
                closeText.textContent = 'Kapat';
                closeText.style.color = '#fff';
                closeText.style.marginRight = '5px';
                closeText.style.fontWeight = 'bold';
                closeText.style.fontSize = '14px';
                closeBtnContainer.prepend(closeText);
              }
            }
          }
        }, 100);
      }
    });
    
    // Yukarı kaydırma butonu
    const scrollToTopButton = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', function() {
      if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
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
    
    // Galeriyi başlat
    initGallery();
  });
  