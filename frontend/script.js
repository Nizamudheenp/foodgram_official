
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

    // Handle user registration
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

    // Handle user login
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

    // Spot Page Handling
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
                card.innerHTML = `
                    <img src="${result.image}" alt="${result.name}" class="spot-img">
                    <div class="spot-details">
                        <h3>${result.name}</h3>
                        <p><strong>District:</strong> ${result.district}</p>
                        <p><strong>Location:</strong> ${result.location}</p>
                        <p><strong>Rating:</strong> ${result.averageRating?.toFixed(1) || 'N/A'}</p>
                        <p>${result.description || ''}</p>
                    </div>
                `;
                spotContainer.appendChild(card);
            });
        }
    }

    // Admin Pending Spot Handling

    const pendingSpotsContainer = document.getElementById('pendingSpotsContainer');

    if (pendingSpotsContainer) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in as an admin to view pending spots.');
            window.location.href = '/frontend/homepage.html';
        } else {
            fetch(`${BASE_URL}/api/admin/pending-spots`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        displayPendingSpots(data);
                    } else {
                        pendingSpotsContainer.innerHTML = '<p>No pending spots found.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching pending spots:', error);
                    pendingSpotsContainer.innerHTML = '<p>Error loading pending spots.</p>';
                });
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

            // Approve button logic
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
                            alert(data.message || 'Spot approved!');
                            button.closest('.pending-spot-card').remove();
                        } else {
                            alert(data.message || 'Failed to approve spot.');
                        }
                    } catch (err) {
                        console.error('Error approving spot:', err);
                        alert('Server error while approving.');
                    }
                });
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
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
    }

});
