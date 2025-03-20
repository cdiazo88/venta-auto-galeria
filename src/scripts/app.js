document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const imageDescription = document.getElementById('image-description');

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
});