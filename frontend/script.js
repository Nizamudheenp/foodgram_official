
const BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const goToRegisterBtn = document.getElementById('go-to-register');
    const loginPopup = document.getElementById('loginForm');
    const registerPopup = document.getElementById('registerForm');
    const overlay = document.querySelector('.overlay');

    const showModal = (modal) => {
        modal.style.display = 'block';
        overlay.style.display = 'block';
    };

    const hideModals = () => {
        loginPopup.style.display = 'none';
        registerPopup.style.display = 'none';
        overlay.style.display = 'none';
    };

    const showLogin = () => {
        hideModals();
        showModal(loginPopup);
    };

    if (goToRegisterBtn && loginPopup && registerPopup) {
        goToRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hideModals();
            showModal(registerPopup);
        });

        overlay?.addEventListener('click', hideModals);
    }

    //  user registration
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('regUserName')?.value;
            const email = document.getElementById('regEmail')?.value;
            const password = document.getElementById('regPassword')?.value;
            const confirmPassword = document.getElementById('regConfirmPassword')?.value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    alert('Registration successful. Please login.');
                    showLogin();
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch (err) {
                console.error('Registration error:', err);
                alert('Something went wrong');
            }
        });
    }

    //  user login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;

            try {
                const res = await fetch(`${BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    alert('Login successful!');
                    hideModals();
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (err) {
                console.error('Login error:', err);
                alert('Something went wrong');
            }
        });
    }

    // user profile

    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdown');
    const userInfo = document.getElementById('userInfo');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminBtn = document.getElementById('adminBtn');

    userIcon?.addEventListener('click', async (event) => {
        if (!userDropdown.classList.contains('hidden')) {
            userDropdown.classList.add('hidden');
            return;
        }

        if (!userDropdown.contains(event.target) && !userIcon.contains(event.target)) {
            userDropdown.classList.add('hidden');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            showLogin();
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            if (res.ok) {
                userInfo.textContent = `${data.username} (${data.email})`;
                userDropdown.classList.remove('hidden');

                if (data.role === 'admin') {
                    adminBtn.classList.remove('hidden');
                    adminBtn.onclick = () => {
                        console.log("Admin button clicked");
                        window.location.href = '/frontend/admindashboard.html';
                    };
                } else {
                    adminBtn.classList.add('hidden');
                }
            } else {
                alert('Failed to load profile');
            }
        } catch (err) {
            console.error('Error loading profile:', err);
            alert('Server error');
        }
    });

    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('Logged out!');
        location.reload();
    });

    adminBtn?.addEventListener('click', () => {
        window.location.href = '/admindashboard.html';
    });


    const isUserLoggedIn = () => {
        const token = localStorage.getItem('token');
        return !!token;
    };

    const form = document.getElementById('submitSpotForm');
    const messageEl = document.getElementById('submitMessage');

    if (form && messageEl) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!isUserLoggedIn()) {
                showLogin();
                return;
            }

            const formData = new FormData(form);
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`${BASE_URL}/api/user/submitspot`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    messageEl.textContent = result.message;
                    form.reset();
                } else {
                    messageEl.textContent = result.message || 'Something went wrong!';
                }
            } catch (error) {
                console.error('Error submitting spot:', error);
                messageEl.textContent = 'Server error. Try again.';
            }
        });
    }

    // Spots Page 
    const spotContainer = document.getElementById('spotContainer');
    const topRatedBtn = document.getElementById('topRatedBtn');
    const districtBtn = document.getElementById('districtBtn');
    const districtSelect = document.getElementById('districtSelect');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (spotContainer) {
        (async function loadTopRatedOnStart() {
            topRatedBtn?.classList.add('active');
            districtBtn?.classList.remove('active');

            try {
                const response = await fetch(`${BASE_URL}/api/user/top-rated`);
                const data = await response.json();
                displaySpots(data || []);
            } catch (error) {
                console.error('Failed to fetch top-rated spots on load:', error);
            }
        })();

        searchBtn?.addEventListener('click', async () => {
            const searchQuery = searchInput.value.trim();
            if (!searchQuery) return;

            try {
                const response = await fetch(`${BASE_URL}/api/user/searchspot?query=${encodeURIComponent(searchQuery)}`);
                const data = await response.json();
                displaySpots(data || []);
            } catch (error) {
                console.error('Search failed:', error);
            }
        });

        topRatedBtn?.addEventListener('click', async () => {
            topRatedBtn.classList.add('active');
            districtBtn?.classList.remove('active');

            try {
                const response = await fetch(`${BASE_URL}/api/user/top-rated`);
                const data = await response.json();
                displaySpots(data || []);
            } catch (error) {
                console.error('Failed to fetch top-rated spots:', error);
            }
        });

        districtBtn?.addEventListener('click', () => {
            districtSelect?.classList.toggle('hidden');
        });

        districtSelect?.addEventListener('change', async () => {
            const selectedDistrict = districtSelect.value;
            if (selectedDistrict) {
                topRatedBtn?.classList.remove('active');
                districtBtn?.classList.add('active');

                try {
                    const response = await fetch(`${BASE_URL}/api/user/spotbydistrict?district=${selectedDistrict}`);
                    const data = await response.json();
                    displaySpots(data || []);
                } catch (error) {
                    console.error('Failed to fetch spots by district:', error);
                }
            }
        });

        function displaySpots(results) {
            spotContainer.innerHTML = '';

            if (results.length === 0) {
                spotContainer.innerHTML = '<p>No spots found.</p>';
                return;
            }

            results.forEach(result => {
                const card = document.createElement('div');
                card.className = 'spot-card';
                card.dataset.spotId = result.id;


                const rating = parseFloat(result.average_rating) || 0;
                const totalReviews = result.total_reviews || 0;
                const starsHTML = getStarHTML(rating);

                card.innerHTML = `
                    <img src="${result.image}" alt="${result.name}" class="spot-img">
                    <div class="spot-details">
                        <h3>${result.name}</h3>
                        <p><strong>District:</strong> ${result.district}</p>
                        <p><strong>Location:</strong> ${result.location}</p>
                        <div class="star-rating">
                           ${starsHTML} <span class="rating-number">${rating}  (${totalReviews} reviews${totalReviews === 1 ? '' : 's'})</span>
                        </div>
                        <p>${result.description || ''}</p>
                    </div>
                `;
                card.addEventListener('click', () => openReviewModal(result.id));
                spotContainer.appendChild(card);
            });
        }

        function getStarHTML(rating) {
            const fullStars = Math.floor(rating);
            const halfStar = rating % 1 >= 0.5;
            let stars = '';
        
            for (let i = 0; i < fullStars; i++) stars += '<span class="star full">★</span>';
            if (halfStar) stars += '<span class="star half">★</span>';
            for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) stars += '<span class="star empty">☆</span>';
        
            return stars;
        }
        
    }

    const reviewModal = document.getElementById('reviewModal');
    const closeReviewModal = document.getElementById('closeReviewModal');
    const starRating = document.getElementById('starRating');
    const reviewComment = document.getElementById('reviewComment');
    const submitReviewBtn = document.getElementById('submitReviewBtn');

    let selectedRating = 0;
    let currentSpotId = null;

    async function openReviewModal(spotId) {
        const token = localStorage.getItem('token');
        if (!token) return alert("You must be logged in to add a review.");

        reviewModal.classList.remove('hidden');
        currentSpotId = spotId;
        selectedRating = 0;
        reviewComment.value = '';
        renderStarInputs();

        try {
            const res = await fetch(`${BASE_URL}/api/user/getReviewsBySpot/${spotId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await res.json();

            if (res.ok) {
                displayReviews(result);
            } else {
                console.error("Failed to load reviews:", result.message);
            }
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    }

    function displayReviews(reviews) {
        const reviewList = document.getElementById('reviewList');
        reviewList.innerHTML = '';

        if (reviews.length === 0) {
            reviewList.innerHTML = '<p>No reviews yet.</p>';
            return;
        }

        reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');

            reviewItem.innerHTML = `
                <div>
                <p><strong>${review.username}</strong> <span class="rating">${getStarHTML(review.rating)}</span></p>
                <p>${review.comment}</p>
                <p class="review-date">${new Date(review.created_at).toLocaleString()}</p>
                </div>
            `;

            reviewList.appendChild(reviewItem);
        });
    }

    function renderStarInputs() {
        starRating.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.classList.add('star');
            star.style.color = i <= selectedRating ? 'gold' : '#ccc';
            star.addEventListener('click', () => {
                selectedRating = i;
                renderStarInputs();
            });
            starRating.appendChild(star);
        }
    }

    if (reviewModal && closeReviewModal) {
        closeReviewModal.addEventListener('click', () => {
            reviewModal.classList.add('hidden');
        });
    }

    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', async () => {
            const comment = reviewComment.value.trim();
            const token = localStorage.getItem('token');

            if (selectedRating === 0 || !comment) {
                return alert("Please select a rating and write a comment.");
            }

            try {
                const res = await fetch(`${BASE_URL}/api/user/addreview`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        spot_id: currentSpotId,
                        rating: selectedRating,
                        comment: comment
                    })
                });

                const result = await res.json();

                if (res.ok) {
                    alert("Review submitted successfully!");

                    const updated = await fetch(`${BASE_URL}/api/user/getReviewsBySpot/${currentSpotId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const updatedReviews = await updated.json();
                    displayReviews(updatedReviews);

                    reviewComment.value = '';
                    selectedRating = 0;
                    renderStarInputs();
                } else {
                    alert(result.message || "Failed to submit review.");
                }
            } catch (err) {
                console.error("Review submission failed", err);
                alert("Error occurred while submitting review.");
            }
        });
    }


    const pendingSpotsBtn = document.getElementById('pendingSpotBtn');
    const adminSpotsBtn = document.getElementById('adminSpotBtn');
    const pendingSpotsContainer = document.getElementById('pendingSpotsContainer');
    const approvedSpotsContainer = document.getElementById('approvedSpotsContainer');
    const token = localStorage.getItem('token');

    if (pendingSpotsContainer && approvedSpotsContainer) {
        pendingSpotsContainer.style.display = 'none';
        approvedSpotsContainer.style.display = 'none';
    }
    if (pendingSpotsBtn && pendingSpotsContainer && approvedSpotsContainer) {
        pendingSpotsBtn.onclick = async () => {
            approvedSpotsContainer.style.display = 'none';
            pendingSpotsContainer.style.display = 'block';
            pendingSpotsContainer.innerHTML = '';

            if (!token) {
                alert('You must be logged in as an admin to view pending spots.');
                return window.location.href = '/frontend/homepage.html';
            }

            try {
                const res = await fetch(`${BASE_URL}/api/admin/pending-spots`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();

                if (Array.isArray(data) && data.length > 0) {
                    displayPendingSpots(data);
                } else {
                    pendingSpotsContainer.innerHTML = '<p>No pending spots found.</p>';
                }
            } catch (err) {
                console.error('Error fetching pending spots:', err);
                pendingSpotsContainer.innerHTML = '<p>Error loading pending spots.</p>';
            }
        };


    }


    if (adminSpotsBtn && pendingSpotsContainer && approvedSpotsContainer) {
        adminSpotsBtn.onclick = async () => {
            pendingSpotsContainer.style.display = 'none';
            approvedSpotsContainer.style.display = 'block';
            approvedSpotsContainer.innerHTML = '';

            if (!token) {
                alert('You must be logged in as an admin to view all spots.');
                return window.location.href = '/frontend/homepage.html';
            }

            try {
                const res = await fetch(`${BASE_URL}/api/admin/get-spots`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();

                if (Array.isArray(data) && data.length > 0) {
                    displayApprovedSpots(data);
                } else {
                    approvedSpotsContainer.innerHTML = '<p>No spots found.</p>';
                }
            } catch (err) {
                console.error('Error fetching approved spots:', err);
                approvedSpotsContainer.innerHTML = '<p>Error loading approved spots.</p>';
            }
        };
    }

    function displayApprovedSpots(spots) {
        approvedSpotsContainer.innerHTML = '';
        spots.forEach(spot => {
            const card = document.createElement('div');
            card.className = 'pending-spot-card';
            card.innerHTML = `
            <img src="${spot.image}" alt="${spot.name}" class="pending-img">
            <div class="pending-details">
                <h3>${spot.name}</h3>
                <p><strong>District:</strong> ${spot.district}</p>
                <p><strong>Location:</strong> ${spot.location}</p>
                <p>${spot.description || ''}</p>
                <button class="delete-btn" data-id="${spot.id}">Delete</button>
            </div>
        `;
            approvedSpotsContainer.appendChild(card);
        });

        addDeleteHandlers('.delete-btn', approvedSpotsContainer);
    }

    function displayPendingSpots(spots) {
        pendingSpotsContainer.innerHTML = '';
        spots.forEach(spot => {
            const card = document.createElement('div');
            card.className = 'pending-spot-card';
            card.innerHTML = `
            <img src="${spot.image}" alt="${spot.name}" class="pending-img">
            <div class="pending-details">
                <h3>${spot.name}</h3>
                <p><strong>District:</strong> ${spot.district}</p>
                <p><strong>Location:</strong> ${spot.location}</p>
                <p>${spot.description || ''}</p>
                <button class="approve-btn" data-id="${spot.id}">Approve</button>
                <button class="delete-btn" data-id="${spot.id}">Delete</button>
            </div>
        `;
            pendingSpotsContainer.appendChild(card);
        });

        document.querySelectorAll('.approve-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const spotId = button.getAttribute('data-id');
                try {
                    const res = await fetch(`${BASE_URL}/api/admin/approve-spot/${spotId}`, {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const data = await res.json();
                    if (res.ok) {
                        alert(data.message || 'Spot approved.');
                        button.closest('.pending-spot-card').remove();
                    } else {
                        alert(data.message || 'Approval failed.');
                    }
                } catch (err) {
                    console.error('Error approving spot:', err);
                    alert('Server error while approving.');
                }
            });
        });

        addDeleteHandlers('.delete-btn', pendingSpotsContainer);
    }

    function addDeleteHandlers(selector, container) {
        container.querySelectorAll(selector).forEach(button => {
            button.addEventListener('click', async () => {
                const spotId = button.getAttribute('data-id');
                const confirmDelete = confirm('Are you sure you want to delete this spot?');

                if (!confirmDelete) return;

                try {
                    const res = await fetch(`${BASE_URL}/api/admin/delete-spot/${spotId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const data = await res.json();
                    if (res.ok) {
                        alert(data.message || 'Spot deleted.');
                        button.closest('.pending-spot-card').remove();
                    } else {
                        alert(data.message || 'Failed to delete spot.');
                    }

                } catch (err) {
                    console.error('Error deleting spot:', err);
                    alert('Server error while deleting.');
                }
            });
        });
    }

});
