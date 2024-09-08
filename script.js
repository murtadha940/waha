// script.js

const customersData = loadCustomers();
const paymentsData = loadPayments();
const storeAddress = 'شارع المحل، المدينة، الدولة'; // عنوان المحل

function populateCustomerSelect() {
    const customerSelect = document.getElementById('customer-select');
    customerSelect.innerHTML = '<option value="">اختر الزبون</option>';

    customersData.forEach((customer, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = customer.name;
        customerSelect.appendChild(option);
    });
}

function submitPayment() {
    const customerIndex = document.getElementById('customer-select').value;
    const amount = parseFloat(document.getElementById('payment-amount').value);
    const customer = customersData[customerIndex];

    if (customerIndex !== '' && !isNaN(amount) && amount > 0) {
        paymentsData.push({ customer: customer.name, amount, date: new Date().toLocaleDateString() });
        savePayments();
        customer.amount = (customer.amount || 0) - amount;
        showCustomers();
        showPayments();
        printInvoice(customer.name, amount, customer.amount);
        document.getElementById('payment-amount').value = '';
    } else {
        alert('يرجى إدخال جميع الحقول بشكل صحيح.');
    }
}

function showCustomers() {
    const customersList = document.getElementById('customers-list');
    customersList.innerHTML = '';

    customersData.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>${customer.item}</td>
            <td>${customer.amount ? customer.amount.toLocaleString() + ' د.ع' : 'غير محدد'}</td>
        `;
        customersList.appendChild(row);
    });
}

function showPayments() {
    const paymentList = document.getElementById('payment-list');
    paymentList.innerHTML = '';

    paymentsData.forEach(payment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment.amount.toLocaleString()} د.ع</td>
            <td>${payment.date}</td>
        `;
        paymentList.appendChild(row);
    });
}

function printInvoice(customerName, amountPaid, remainingAmount) {
    const receiptWindow = window.open('', '', 'width=600,height=400');
    receiptWindow.document.write(`
        <html>
        <head>
            <title>فاتورة تسديد</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .receipt-container {
                    width: 100%;
                    padding: 20px;
                    border: 1px solid #ddd;
                    margin-top: 20px;
                }
                .receipt-logo {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .receipt-logo img {
                    width: 100px;
                }
                .receipt-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .receipt-header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .receipt-details {
                    margin-bottom: 20px;
                }
                .receipt-details table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .receipt-details th, .receipt-details td {
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: left;
                }
                .receipt-details th {
                    background-color: #f4f4f4;
                }
                .receipt-footer {
                    margin-top: 20px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="receipt-container">
                <div class="receipt-logo">
                    <img src="logo.png" alt="وهب للمحاسبة">
                </div>
                <div class="receipt-header">
                    <h1>فاتورة تسديد</h1>
                </div>
                <div class="receipt-details">
                    <table>
                        <tr>
                            <th>العميل</th>
                            <td>${customerName}</td>
                        </tr>
                        <tr>
                            <th>المبلغ المدفوع</th>
                            <td>${amountPaid.toLocaleString()} د.ع</td>
                        </tr>
                        <tr>
                            <th>المبلغ المتبقي</th>
                            <td>${remainingAmount.toLocaleString()} د.ع</td>
                        </tr>
                    </table>
                </div>
                <div class="receipt-footer">
                    <p>${storeAddress}</p>
                </div>
            </div>
        </body>
        </html>
    `);
    receiptWindow.document.close();
    receiptWindow.focus();
    receiptWindow.print();
}

// استرجاع البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    customersData.push(...loadCustomers());
    paymentsData.push(...loadPayments());
    populateCustomerSelect();
    showCustomers();
    showPayments();
});

// دالة لحفظ بيانات الزبائن
function saveCustomers() {
    localStorage.setItem('customers', JSON.stringify(customersData));
}

// دالة لحفظ بيانات المدفوعات
function savePayments() {
    localStorage.setItem('payments', JSON.stringify(paymentsData));
}

// دالة لاسترجاع بيانات الزبائن
function loadCustomers() {
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
        return JSON.parse(savedCustomers);
    }
    return [];
}

// دالة لاسترجاع بيانات المدفوعات
function loadPayments() {
    const savedPayments = localStorage.getItem('payments');
    if (savedPayments) {
        return JSON.parse(savedPayments);
    }
    return [];
}
