// Console log for script start
console.log('Script started');

// Function to show alert box
function showAlertBox(message) {
    console.log('Attempting to show alert:', message);
    const alertBox = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');
    if (alertBox && alertMsg) {
        alertMsg.textContent = message;
        alertBox.style.display = 'block';
        alertBox.style.opacity = '1';
        console.log('Alert box displayed');

        setTimeout(() => {
            alertBox.style.opacity = '0';
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 500);
        }, 5000);
    } else {
        console.error('Alert box elements not found. Falling back to browser alert');
        alert(message);
    }
}

// Test alert box function
function testAlertBox() {
    showAlertBox('This is a test alert');
}

// Form loading animation
function animateForm() {
    console.log('Animating form');
    const form = document.querySelector('.form');
    if (form) {
        console.log('Form found');
        form.style.opacity = '0';
        const formElements = [...form.children];
        formElements.forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transition = 'opacity 0.5s ease';
            item.style.transitionDelay = `${i * 100}ms`;
        });
        
        // Trigger reflow to ensure the initial opacity is applied
        form.offsetHeight;

        // Animate to final opacity
        form.style.transition = 'opacity 0.5s ease';
        form.style.opacity = '1';
        formElements.forEach((item) => {
            item.style.opacity = '1';
        });
    } else {
        console.log('Form not found');
    }
}

// Function to handle credential response
function handleCredentialResponse(response) {
    console.log("Received credential response");
    if (response.credential) {
        console.log("Encoded JWT ID token: " + response.credential);
        // Decode the JWT token to get user info
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const user = JSON.parse(jsonPayload);
        console.log("User info:", user);

        // Store user info in session storage
        sessionStorage.setItem('name', user.name);
        sessionStorage.setItem('email', user.email);

        showAlertBox('Sign in successful');
        
        setTimeout(() => {
            window.location.href = '/index1.html';
        }, 1000);
    } else {
        console.error("No credential received in the response");
        showAlertBox('Sign in failed. Please try again.');
    }
}

 // Initialize Google Sign-In
function initializeGoogleSignIn() {
    console.log('Initializing Google Sign-In');
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
            client_id: "251728963544-dtr8h5ivqr3m0d3rubm2p63u3p1ievp2.apps.googleusercontent.com",
            callback: handleCredentialResponse,
            scope: 'profile email'
        });
        const signInButton = document.getElementById("google-signin-btn");
        if (signInButton) {
            google.accounts.id.renderButton(
                signInButton,
                { theme: "outline", size: "large" }
            );
            console.log('Google Sign-In button rendered');
        } else {
            console.error('Google Sign-In button element not found');
        }
        google.accounts.id.prompt();
    } else {
        console.error('Google Identity Services not loaded properly');
        showAlertBox('Google Sign-In is not available at the moment. Please try again later.');
    }
}

// Navigation function
function navigateTo(page) {
    window.location.href = page;
}

// Main initialization function
function init() {
    console.log('Initializing');
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);

    animateForm();
    testAlertBox();
    
    if (currentPath.includes('login.html')) {
        console.log('On login page');
        initializeGoogleSignIn();
    } else if (currentPath.includes('register.html')) {
        console.log('On register page');
    }

    // Form validation
    const form = document.querySelector('.form');
    const name = document.querySelector('.name');
    const email = document.querySelector('.email');
    const password = document.querySelector('.password');
    const submitBtn = document.querySelector('.submit-btn');

    if (form && submitBtn) {
        console.log('Form and submit button found');
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!name) { // Login page
                console.log('Attempting login');
                fetch('/login-user', {
                    method: 'post',
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify({ email: email.value, password: password.value })
                })
                .then(res => res.json())
                .then(data => { validateData(data); })
                .catch(error => {
                    console.error('Error during login:', error);
                    showAlertBox('An error occurred during login. Please try again.');
                });
            } else { // Register page
                console.log('Attempting registration');
                fetch('/register-user', {
                    method: 'post',
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify({ name: name.value, email: email.value, password: password.value })
                })
                .then(res => res.json())
                .then(data => { validateData(data); })
                .catch(error => {
                    console.error('Error during registration:', error);
                    showAlertBox('An error occurred during registration. Please try again.');
                });
            }
        });
    } else {
        console.log('Form or submit button not found');
    }
}

// Run initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Function to validate data returned from server
const validateData = (data) => {
    if (!data.name) {
        showAlertBox('Email or password incorrect');
    } else {
        sessionStorage.name = data.name;
        sessionStorage.email = data.email;
        showAlertBox('Success');
        setTimeout(() => {
            location.href = '/index1.html';
        }, 1000);
    }
};

// Session check function
function checkSession() {
    const currentPath = window.location.pathname;
    if (sessionStorage.name) {
        if (currentPath.includes('index.html')) {
            window.location.href = '/index1.html';
        }
    } else {
        if (currentPath.includes('index1.html')) {
            window.location.href = '/index.html';
        }
    }
}

// Run session check after a short delay
setTimeout(checkSession, 100);

console.log('Script ended');s