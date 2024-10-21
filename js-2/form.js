// Form loading animation
const form = [...document.querySelector('.form').children];
form.forEach((item, i) => {
    setTimeout(() => {
        item.style.opacity = 1;
    }, i * 100);
});

window.onload = () => {
    // Get the current page's path
    const currentPath = window.location.pathname;

    if (sessionStorage.name) {
        // Check if the user is trying to access a page other than login.html and register.html
        if (currentPath !== '/login.html' && currentPath !== '/register.html') {
            location.href = '/index1.html'; // Redirect to index1.html if logged in
        }
    } else {
        // If not logged in, make sure they aren't trying to access protected pages
        if (currentPath !== '/index.html') {
            location.href = '/index.html'; // Redirect to index.html if not logged in
        }
    }
};

// Form validation
const name = document.querySelector('.name') || null;
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const submitBtn = document.querySelector('.submit-btn');
const dontHaveAccountBtn = document.querySelector('.link'); // Add this line

if (name == null) { // Login page is open
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        fetch('/login-user', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            validateData(data); // Handle the login validation
        });
    });
} else { // Register page is open
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        fetch('/register-user', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            validateData(data); // Handle the registration validation
        });
    });
}

// Redirect to register.html when the "Don't have an account" button is clicked
if (dontHaveAccountBtn) {
    dontHaveAccountBtn.addEventListener('click', () => {
        location.href = '/register.html';
    });
}

// Validate data (works for both form login and Google login)
const validateData = (data) => {
    if (!data.name && !data.google) { // Check for Google or form login
        alertBox(data);
    } else if (data.google) { // Google login
        sessionStorage.name = data.name;
        sessionStorage.email = data.email;
        location.href = '/index1.html'; // Redirect after Google login success
    } else { // Traditional form login
        sessionStorage.name = data.name;
        sessionStorage.email = data.email;
        location.href = '/index1.html'; // Redirect after form login success
    }
};

// Google OAuth function to handle login
function handleCredentialResponse(response) {
    console.log('Encoded JWT ID token: ' + response.credential);
    
    // Send the token to the backend for further validation
    fetch('/google-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: response.credential })
    })
    .then(res => res.json())
    .then(data => {
        validateData({ google: true, name: data.name, email: data.email }); // Google login success
    })
    .catch(err => {
        console.error('Google login failed:', err);
        alertBox('Google login failed. Please try again.');
    });
}

// Alert box for errors or alerts
const alertBox = (data) => {
    const alertContainer = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');
    alertMsg.innerHTML = data;

    alertContainer.style.top = `5%`;
    setTimeout(() => {
        alertContainer.style.top = null;
    }, 5000);
};
