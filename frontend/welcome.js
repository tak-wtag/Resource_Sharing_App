window.onload = function() {
    // Get buttons
    const createAccountBtn = document.getElementById('create-account-btn');
    const loginBtn = document.getElementById('login-btn');
    const continueBtn = document.getElementById('continue-btn');
  
    // Event listener for creating an account
    createAccountBtn.addEventListener('click', function() {
      window.location.href = 'register.html';  // Redirect to register page
    });
  
    // Event listener for logging in
    loginBtn.addEventListener('click', function() {
      window.location.href = 'login.html';  // Redirect to login page
    });
  
    // Event listener for continuing without logging in
    continueBtn.addEventListener('click', function() {
      window.location.href = 'all_resource.html';  // Redirect to the app's main page or dashboard
    });
  };
  