document.addEventListener('DOMContentLoaded', () => {
    const drinkButtons = document.querySelectorAll('.drink-btn');
    const orderSummary = document.getElementById('orderSummary');

    let order = {};

    function updateOrderSummary() {
        orderSummary.innerHTML = '';
        for (const drink in order) {
            const listItem = document.createElement('li');
            listItem.textContent = `${order[drink].quantity} x ${drink} - $${(order[drink].price * order[drink].quantity).toFixed(2)}`;
            orderSummary.appendChild(listItem);
        }
    }

    drinkButtons.forEach(button => {
        button.addEventListener('click', () => {
            const drink = button.getAttribute('data-drink');
            const price = parseFloat(button.getAttribute('data-price'));

            if (order[drink]) {
                order[drink].quantity += 1;
            } else {
                order[drink] = { price: price, quantity: 1 };
            }

            updateOrderSummary();
        });
    });

    const submitOrder = document.getElementById('submitOrder');
    submitOrder.addEventListener('click', () => {
        const orderData = {
            drinks: order,
            totalAmount: calculateTotal()
        };

        fetch('/submit-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Order submitted:', data);
            order = {};
            orderSummary.innerHTML = '';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    function calculateTotal() {
        let total = 0;
        for (const drink in order) {
            total += order[drink].price * order[drink].quantity;
        }
        return total;
    }
});
