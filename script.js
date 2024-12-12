document.addEventListener('DOMContentLoaded', async () => {
  const cartTableBody = document.querySelector('.cart-table tbody');
  const totalSubtotal = document.querySelector('.total-subtotal');
  const totalPrice = document.querySelector('.total-price');

  // Fetch the API data
  async function fetchCartData() {
    try {
      const response = await fetch('https://example.com/api/cart-data'); // Replace with actual API URL
      if (!response.ok) throw new Error('Failed to fetch cart data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching cart data:', error);
      return null; // Return null to handle error gracefully
    }
  }

  // Populate cart with API data
  async function populateCart() {
    const cartData = await fetchCartData();
    if (!cartData) return; // Exit if fetching fails

    // Clear existing rows
    cartTableBody.innerHTML = '';

    // Populate table rows
    cartData.items.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <img src="${item.image}" alt="${item.title}" width="50"> ${item.title}
        </td>
        <td>Rs. ${(item.price / 100).toLocaleString()}</td>
        <td>
          <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
        </td>
        <td class="subtotal">Rs. ${(item.line_price / 100).toLocaleString()}</td>
      `;
      cartTableBody.appendChild(row);
    });

    // Update totals
    updateTotals(cartData);

    // Attach quantity change listener
    attachQuantityChangeListener(cartData);
  }

  // Update totals dynamically
  function updateTotals(cartData) {
    const total = cartData.items.reduce((sum, item) => sum + item.quantity * item.price, 0) / 100; // Convert to rupees
    totalSubtotal.textContent = `Rs. ${total.toLocaleString()}`;
    totalPrice.textContent = `Rs. ${total.toLocaleString()}`;
  }

  // Add event listener for quantity changes
  function attachQuantityChangeListener(cartData) {
    cartTableBody.addEventListener('input', (e) => {
      if (e.target.classList.contains('quantity-input')) {
        const quantityInput = e.target;
        const itemId = parseInt(quantityInput.dataset.id);
        const newQuantity = Math.max(parseInt(quantityInput.value) || 1, 1); // Prevent zero/negative quantities
        quantityInput.value = newQuantity;

        const item = cartData.items.find(item => item.id === itemId);
        if (item) {
          item.quantity = newQuantity;
          item.line_price = item.price * newQuantity;

          // Update the subtotal for this row
          const subtotalCell = quantityInput.closest('tr').querySelector('.subtotal');
          subtotalCell.textContent = `Rs. ${(item.line_price / 100).toLocaleString()}`;

          // Update the total
          updateTotals(cartData);
        }
      }
    });
  }

  // Initialize cart
  populateCart();
});
