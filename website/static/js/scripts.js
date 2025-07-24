let users = JSON.parse(localStorage.getItem("users")) || [];
let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
let loggedInUser = null;

// User Registration
function registerUser() {
    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let fatherName = document.getElementById("fatherName").value;
    let motherName = document.getElementById("motherName").value;
    let accountNo = document.getElementById("accountNo").value ; 
    let ifsc = document.getElementById("ifsc").value;
    let branch = document.getElementById("branch").value;
    let pan = document.getElementById("pan").value;
    let aadhaar = document.getElementById("aadhaar").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;           

    // Check if any field is empty
    if (!name || !age || !fatherName || !motherName || !accountNo || !ifsc || !branch || !pan || !aadhaar || !phone || !email || !password) {
        document.getElementById("errorMessage").innerHTML = "⚠️ Please fill out all fields before registering!";
        return; // Stop execution if fields are empty
    }

    // Create user object
    let user = {
        name, age, fatherName, motherName, accountNo, ifsc, branch, pan, aadhaar, phone, email, password
    };

    // Save user details in localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));     

    // Show success message
    document.getElementById("errorMessage").innerHTML = "<span style='color: green;'>✔️ User Registered Successfully!</span>";

    // Redirect to login page after 2 seconds
    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);
}




// User Login
function loginUser() {
    let username = document.getElementById("loginUsername").value;
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let user = users.find(u => u.email === email && u.password === password);
    if (user) {
        loggedInUser = user;
        alert("Login Successful!");
        window.location.href = "accountcreation.html";
    } else {
        alert("Invalid Credentials!");
    }
}
function loginUser() {
    
    localStorage.setItem("isLoggedIn", "true");  // Store login status
    window.location.href = "index.html";
}
function logout() {
    localStorage.removeItem("isLoggedIn");
    alert("Logged out successfully!");
    window.location.href = "login.html";
}

// Account Creation
function createAccount() {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        alert("You must be logged in to access this page!");
        window.location.href = "login.html"; // Redirect to login page
        return;
    }

    // Get values
    const accountNo = document.getElementById("accountNo").value.trim();
    const ifsc = document.getElementById("ifsc").value.trim();
    const branch = document.getElementById("branch").value.trim();
    const pin = document.getElementById("pin").value.trim();

    // Validation
    if (!accountNo || !ifsc || !branch || !pin) {
        alert("❌ Please fill in all the fields.");
        return;
    }

    if (!/^\d+$/.test(accountNo) || accountNo.length < 6) {
        alert("❌ Account number should be numeric and at least 6 digits.");
        return;
    }

    

    if (pin.length !== 4 || isNaN(pin)) {
        alert("❌ PIN must be a 4-digit number.");
        return;
    }

    // Prepare account object
    let account = {
        accountNo: accountNo,
        ifsc: ifsc,
        branch: branch,
        pin: pin,
        balance: 0
    };

    // Save account
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    accounts.push(account);
    localStorage.setItem("accounts", JSON.stringify(accounts));

    alert("✅ Account Created Successfully!");
    window.location.href = "index.html";
}


// Deposit Money
function depositMoney() {
    let accountNo = document.getElementById("accountNo").value;
    let pin = document.getElementById("pin").value;
    let username = document.getElementById("username").value;
    let amount = parseFloat(document.getElementById("amount").value);

    let account = accounts.find(a => a.accountNo === accountNo && a.pin === pin);
    if (account) {
        account.balance += amount;
        localStorage.setItem("accounts", JSON.stringify(accounts));
        document.getElementById("message").innerText = "💰 Amount Deposited Successfully!";
    } else {
        alert("Invalid Account Details!");
    }
}
function goHome() {
    window.location.href = "index.html";
}

// Withdraw Money
function withdrawMoney() {
    let accountNo = document.getElementById("accountNo").value;
    let pin = document.getElementById("pin").value;
    let amount = parseFloat(document.getElementById("amount").value);

    let account = accounts.find(a => a.accountNo === accountNo && a.pin === pin);
    if (account && account.balance >= amount) {
        account.balance -= amount;
        localStorage.setItem("accounts", JSON.stringify(accounts));
           alert("Withdrawal Successful!");
    } else {
        alert("Insufficient Balance or Invalid Details!");
    }
}

// Check Balance
function checkBalance() {
    let accountNo = document.getElementById("accountNo").value;
    let pin = document.getElementById("pin").value;

    let account = accounts.find(a => a.accountNo === accountNo && a.pin === pin);
    if (account) {
        alert(`Your Balance: ₹${account.balance}`);
    } else {
        alert("Invalid Account Details!");
    }
}
document.addEventListener("DOMContentLoaded", function () {
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = "0"; // Hide all slides
            if (i === index) {
                slide.style.opacity = "1"; // Show the selected slide
            }
        });
    }

    // Previous Slide Function
    window.prevSlide = function () {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    };

    // Next Slide Function
    window.nextSlide = function () {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    };

    // Ensure first slide is visible
    showSlide(currentIndex);
});




document.addEventListener("DOMContentLoaded", function () {
    // Add event listener to the Transaction Button
    let transactionBtn = document.getElementById("transactionButton");
    if (transactionBtn) {
        transactionBtn.addEventListener("click", displayTransactionHistory);
    }
});

// Function to Save Transactions (Call in Deposit/Withdraw)
function saveTransaction(accountNo, pin, type, amount) {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    let newTransaction = {
        accountNo: accountNo.trim(),  // Remove spaces
        pin: pin.trim(),
        type: type,
        amount: amount,
        dateTime: new Date().toLocaleString()
    };

    transactions.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to Display Transaction History
function displayTransactionHistory() {
    let accountNo = document.getElementById("transactionAccountNo").value.trim();
    let pin = document.getElementById("transactionPin").value.trim();
    let resultDiv = document.getElementById("transactionResult");

    if (accountNo === "" || pin === "") {
        resultDiv.innerHTML = "<p style='color: red;'>Please enter Account No and PIN!</p>";
        return;
    }

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let userTransactions = transactions.filter(txn => txn.accountNo === accountNo && txn.pin === pin);

    if (userTransactions.length === 0) {
        resultDiv.innerHTML = "<p>No transaction history found.</p>";
        return;
    }

    let tableHTML = `
        <table border="1" style="width:100%; border-collapse: collapse;">
            <tr>
                <th>Date & Time</th>
                <th>Transaction Type</th>
                <th>Amount</th>
            </tr>
    `;

    userTransactions.forEach(txn => {
        tableHTML += `
            <tr>
                <td>${txn.dateTime}</td>
                <td>${txn.type}</td>
                <td>${txn.amount}</td>
            </tr>
        `;
    });

    tableHTML += `</table>`;
    resultDiv.innerHTML = tableHTML;
}
let transactions = [];

function showTransactions() {
  const accountNo = document.getElementById("transactionAccountNo").value.trim();
  const pin = document.getElementById("transactionPin").value.trim();
  const resultDiv = document.getElementById("transactionResult");

  if (accountNo === "" || pin === "") {
    resultDiv.innerHTML = "<p style='color: red;'>Please fill in both Account Number and PIN.</p>";
    return;
  }

  resultDiv.innerHTML = "";

  if (transactions.length === 0) {
    resultDiv.innerHTML = "<p>No transactions available yet.</p>";
    return;
  }

  transactions.forEach(tx => {
    resultDiv.innerHTML += `
      <div class="transaction-entry">
        <strong>${tx.type}</strong> of ₹${tx.amount} on ${tx.date}
      </div>
    `;
  });
}

function simulateDeposit() {
  const amount = document.getElementById("amountInput").value;
  if (!amount || amount <= 0) {
    alert("Please enter a valid deposit amount.");
    return;
  }

  const now = new Date().toLocaleString();
  const newTransaction = { type: 'Deposit', amount: amount, date: now };
  transactions.push(newTransaction);

  alert(`₹${amount} deposited successfully!`);
}

function simulateWithdraw() {
  const amount = document.getElementById("amountInput").value;
  if (!amount || amount <= 0) {
    alert("Please enter a valid withdrawal amount.");
    return;
  }

  const now = new Date().toLocaleString();
  const newTransaction = { type: 'Withdraw', amount: amount, date: now };
  transactions.push(newTransaction);

  alert(`₹${amount} withdrawn successfully!`);
}