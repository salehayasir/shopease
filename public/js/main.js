// ShopEase - Main JavaScript

// Flash messages auto-dismiss (not used currently but useful)
document.querySelectorAll('.alert').forEach(alert => {
  setTimeout(() => {
    alert.style.transition = 'opacity 0.5s';
    alert.style.opacity = '0';
    setTimeout(() => alert.remove(), 500);
  }, 5000);
});

// Quantity input: auto-submit cart update on change
document.querySelectorAll('.qty-form input[type=number]').forEach(input => {
  input.addEventListener('change', function() {
    this.form.submit();
  });
});

// Add to cart button: brief loading state
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    const btn = this.querySelector('button[type=submit]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Adding...';
    }
  });
});
