document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const imageDescription = document.getElementById('image-description');
    const mediumImage = document.getElementById('medium-image');

    let currentIndex = 0;

    // Detect if the user is on a mobile device
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Open modal on thumbnail click
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            const fullSizeSrc = thumbnail.getAttribute('data-fullsize');
            const description = thumbnail.getAttribute('data-description');
            modalImage.src = fullSizeSrc;
            imageDescription.textContent = description;
            modal.classList.remove('hidden');
            currentIndex = index;
        });
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Navigate through images in modal
    const updateModalImage = (index) => {
        currentIndex = (index + thumbnails.length) % thumbnails.length;
        modalImage.src = thumbnails[currentIndex].getAttribute('data-fullsize');
        imageDescription.textContent = thumbnails[currentIndex].getAttribute('data-description');
    };

    prevButton.addEventListener('click', () => {
        updateModalImage(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        updateModalImage(currentIndex + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('hidden')) {
            if (event.key === 'ArrowLeft') {
                updateModalImage(currentIndex - 1);
            } else if (event.key === 'ArrowRight') {
                updateModalImage(currentIndex + 1);
            } else if (event.key === 'Escape') {
                modal.classList.add('hidden');
            }
        }
    });

    // Función para abrir el modal
    const openModal = (src) => {
        modalImage.src = src;
        modal.classList.remove("hidden");
    };

    // Función para cerrar el modal
    const closeModalHandler = () => {
        modal.classList.add("hidden");
        modalImage.src = "";
    };

    // Detectar resolución y agregar eventos
    const setupEventListeners = () => {
        if (window.matchMedia("(min-width: 768px)").matches) {
            // Resolución desktop: actualizar la imagen medium al hacer clic en una thumbnail
            thumbnails.forEach((thumbnail) => {
                thumbnail.addEventListener("click", () => {
                    const mediumSrc = thumbnail.getAttribute("data-medium");
                    mediumImage.src = mediumSrc; // Actualizar la imagen medium
                });
            });

            // Agregar evento para abrir el modal al hacer clic en la imagen medium
            mediumImage.addEventListener("click", () => openModal(mediumImage.src));
        } else {
            // Resolución mobile: abrir el modal al hacer clic en una thumbnail
            thumbnails.forEach((thumbnail) => {
                thumbnail.addEventListener("click", () =>
                    openModal(thumbnail.dataset.fullsize)
                );
            });
        }
    };

    // Inicializar eventos
    setupEventListeners();

    // Reconfigurar eventos al cambiar el tamaño de la ventana
    window.addEventListener("resize", () => {
        // Eliminar eventos previos
        mediumImage.removeEventListener("click", () => openModal(mediumImage.src));
        thumbnails.forEach((thumbnail) => {
            thumbnail.removeEventListener("click", () =>
                openModal(thumbnail.dataset.fullsize)
            );
        });

        // Configurar eventos nuevamente
        setupEventListeners();
    });

    // Cerrar el modal al hacer clic en el botón de cerrar
    closeModal.addEventListener("click", closeModalHandler);

    // Cerrar el modal al hacer clic fuera de la imagen
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });

    let touchStartX = 0; // Coordenada X inicial del toque
    let touchEndX = 0;   // Coordenada X final del toque

    // Detectar el inicio del toque
    modal.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX; // Guardar la posición inicial del toque
    });

    // Detectar el movimiento del toque
    modal.addEventListener("touchmove", (event) => {
        touchEndX = event.touches[0].clientX; // Actualizar la posición final del toque
    });

    // Detectar el final del toque y determinar la dirección del swipe
    modal.addEventListener("touchend", () => {
        const swipeDistance = touchEndX - touchStartX;

        // Determinar si el swipe es hacia la izquierda o derecha
        if (swipeDistance > 50) {
            // Swipe hacia la derecha (imagen anterior)
            updateModalImage(currentIndex - 1);
        } else if (swipeDistance < -50) {
            // Swipe hacia la izquierda (imagen siguiente)
            updateModalImage(currentIndex + 1);
        }

        // Reiniciar las coordenadas del toque
        touchStartX = 0;
        touchEndX = 0;
    });
});