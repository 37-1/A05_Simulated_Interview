document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loaded');
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // 返回登录页
            window.location.href = '../login-page/login.html';
        });
    }
});