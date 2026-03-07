document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const submitButton = loginForm.querySelector('button[type="submit"]');

            const username = usernameInput.value;
            const password = passwordInput.value;

            // Performance Monitoring Start
            const perfStart = performance.now();

            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Start Animation Sequence
                    
                    // 1. Get Elements
                    const loginBox = document.querySelector('.login-box');
                    const bgImg = document.querySelector('.bg-img');
                    const bgColor = document.querySelector('.bg-color');
                    
                    // 2. Trigger Login Box Fade Out (300ms)
                    if (loginBox) {
                        loginBox.classList.add('fade-out');
                    }
                    
                    // 3. Trigger Background Expansion (600ms)
                    if (bgImg && bgColor) {
                        bgImg.classList.add('expand-bg');
                        bgColor.classList.add('shrink-bg');
                    }
                    
                    // Performance Monitoring Check
                    requestAnimationFrame(() => {
                         const perfEnd = performance.now();
                         console.log(`Animation triggered at: ${perfEnd - perfStart}ms after request start`);
                    });

                    // 4. Wait for animation (600ms) + Hold (1000ms) = 1600ms
                    setTimeout(() => {
                        window.location.href = data.redirect;
                    }, 1600);

                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }
});
