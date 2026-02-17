function injectAuthForms() {
    const authHTML = `
    <!-- Overlay -->
    <div class="overlay" id="authOverlay"></div>

    <!-- Login Popup -->
    <div id="loginForm" class="login-popup">
        <form id="login">
            <h2>login</h2>
            <input type="text" placeholder="email" required id="email">
            <input type="password" placeholder="password" required id="password">
            <button type="submit">Login</button>
            <p class="form-switch">Don't have an account? <a href="#" id="go-to-register">Register here</a></p>
        </form>
    </div>

    <!-- Register Popup -->
    <div id="registerForm" class="register-popup">
        <form id="register">
            <h2>register</h2>
            <input type="text" placeholder="username" required id="regUserName">
            <input type="email" placeholder="email" required id="regEmail">
            <input type="password" placeholder="password" required id="regPassword">
            <input type="password" placeholder="confirm password" required id="regConfirmPassword">
            <button type="submit">Register</button>
            <p class="form-switch">Already have an account? <a href="#" id="go-to-login">Login here</a></p>
        </form>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', authHTML);

    // Re-attach event listeners if needed (though script.js usually handles this)
    // If script.js uses IDs, they should be fine once injected.
}

// Call injection immediately if script is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAuthForms);
} else {
    injectAuthForms();
}
