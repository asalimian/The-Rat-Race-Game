document.addEventListener("DOMContentLoaded", function () {
    let cashOnHand = 0;

    // Function to save all form data to localStorage
    function saveToLocalStorage() {
        const formData = {
            // Income fields
            salary: document.getElementById("salary").value,
            spouseSalary: document.getElementById("spouseSalary").value,
            sideGigSalary: document.getElementById("sideGigSalary").value,
            
            // Expense fields
            taxes: document.getElementById("taxes").value,
            mortgage: document.getElementById("mortgage").value,
            schoolLoanAmount: document.getElementById("schoolLoanAmount").value,
            carLoan: document.getElementById("carLoan").value,
            otherExpenses: document.getElementById("otherExpenses").value,
            children: document.getElementById("children").value,
            costPerChild: document.getElementById("costPerChild").value,
            personalLoan: document.getElementById("personalLoan").value,
            businessLoan: document.getElementById("businessLoan").value,
            
            // Stock fields
            stockAQty: document.getElementById("stockAQty").value,
            stockACost: document.getElementById("stockACost").value,
            stockBQty: document.getElementById("stockBQty").value,
            stockBCost: document.getElementById("stockBCost").value,
            
            // Gold fields
            goldQty: document.getElementById("goldQty").value,
            goldCost: document.getElementById("goldCost").value,
            
            // Trading cards fields
            tradingCardsQty: document.getElementById("tradingCardsQty").value,
            tradingCardsCost: document.getElementById("tradingCardsCost").value,
            
            // Cash on hand
            cashOnHand: cashOnHand
        };

        // Save properties table data
        const propertyRows = [];
        const propertyTable = document.getElementById("properties");
        const rows = propertyTable.getElementsByTagName("tr");
        
        for (let i = 1; i < rows.length; i++) { // Skip header row
            const inputs = rows[i].getElementsByTagName("input");
            if (inputs.length === 3) {
                propertyRows.push({
                    name: inputs[0].value,
                    dp: inputs[1].value,
                    cashFlow: inputs[2].value
                });
            }
        }
        formData.properties = propertyRows;

        localStorage.setItem('incomeStatementData', JSON.stringify(formData));
    }

    // Function to load data from localStorage
    function loadFromLocalStorage() {
        const savedData = localStorage.getItem('incomeStatementData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            // Restore basic form fields
            const fieldMap = {
                salary: "salary",
                spouseSalary: "spouseSalary", 
                sideGigSalary: "sideGigSalary",
                taxes: "taxes",
                mortgage: "mortgage",
                schoolLoanAmount: "schoolLoanAmount",
                carLoan: "carLoan",
                otherExpenses: "otherExpenses",
                children: "children",
                costPerChild: "costPerChild",
                personalLoan: "personalLoan",
                businessLoan: "businessLoan",
                stockAQty: "stockAQty",
                stockACost: "stockACost",
                stockBQty: "stockBQty",
                stockBCost: "stockBCost",
                goldQty: "goldQty",
                goldCost: "goldCost",
                tradingCardsQty: "tradingCardsQty",
                tradingCardsCost: "tradingCardsCost"
            };

            Object.keys(fieldMap).forEach(key => {
                const element = document.getElementById(fieldMap[key]);
                if (element && formData[key] !== undefined) {
                    element.value = formData[key];
                }
            });

            // Restore cash on hand
            if (formData.cashOnHand !== undefined) {
                cashOnHand = parseFloat(formData.cashOnHand) || 0;
            }

            // Restore properties table data
            if (formData.properties) {
                const propertyTable = document.getElementById("properties");
                const rows = propertyTable.getElementsByTagName("tr");
                
                for (let i = 1; i < rows.length && i - 1 < formData.properties.length; i++) {
                    const inputs = rows[i].getElementsByTagName("input");
                    const propertyData = formData.properties[i - 1];
                    
                    if (inputs.length === 3 && propertyData) {
                        inputs[0].value = propertyData.name || "";
                        inputs[1].value = propertyData.dp || "";
                        inputs[2].value = propertyData.cashFlow || "";
                    }
                }
            }
        }
    }

    // Function to update calculations
    function updateCalculations() {
        // Get Income Values
        let salary = parseFloat(document.getElementById("salary").value) || 0;
        let spouseSalary = parseFloat(document.getElementById("spouseSalary").value) || 0;
        let sideGigSalary = parseFloat(document.getElementById("sideGigSalary").value) || 0;
        let stockBQty = parseFloat(document.getElementById("stockBQty").value) || 0;
        let propertyIncome = 0;

        // Calculate Stock Dividends
        let stockDividends = stockBQty * 0.1;
        document.getElementById("stockDividends").value = stockDividends.toFixed(2);

        // Calculate Property/Business Income (Sum of Column 3 in Properties Table)
        document.querySelectorAll(".cashFlowInput").forEach(input => {
            propertyIncome += parseFloat(input.value) || 0;
        });
        document.getElementById("propertyIncome").value = propertyIncome.toFixed(2);

        // Total Passive Income
        let totalPassiveIncome = stockDividends + propertyIncome;
        document.getElementById("totalPassiveIncome").value = totalPassiveIncome.toFixed(2);

        // Total Income
        let totalIncome = salary + spouseSalary + sideGigSalary + totalPassiveIncome;
        document.getElementById("totalIncome").value = totalIncome.toFixed(2);

        // Get Expenses
        let taxes = parseFloat(document.getElementById("taxes").value) || 0;
        let mortgage = parseFloat(document.getElementById("mortgage").value) || 0;
        let schoolLoanAmount = parseFloat(document.getElementById("schoolLoanAmount").value) || 0;
        let schoolLoanPayment = schoolLoanAmount * 0.005;
        document.getElementById("schoolLoanPayment").value = schoolLoanPayment.toFixed(2);

        let carLoan = parseFloat(document.getElementById("carLoan").value) || 0;
        let otherExpenses = parseFloat(document.getElementById("otherExpenses").value) || 0;
        let children = parseInt(document.getElementById("children").value) || 0;
        let costPerChild = parseFloat(document.getElementById("costPerChild").value) || 0;
        let totalChildExpenses = children * costPerChild;
        document.getElementById("totalChildExpenses").value = totalChildExpenses.toFixed(2);

        let personalLoanAmount = parseFloat(document.getElementById("personalLoan").value) || 0;
        let personalLoanPayment = personalLoanAmount * 0.1;
        document.getElementById("personalLoanPayment").value = personalLoanPayment;
        
        let businessLoanAmount = parseFloat(document.getElementById("businessLoan").value) || 0;
        let businessLoanPayment = businessLoanAmount * 0.005;
        document.getElementById("businessLoanPayment").value = businessLoanPayment.toFixed(2);

        // Total Expenses
        let totalExpenses = taxes + mortgage + schoolLoanPayment + carLoan + otherExpenses + totalChildExpenses + personalLoanPayment + businessLoanPayment;
        document.getElementById("totalExpenses").value = totalExpenses.toFixed(2);

        // Cash Flow Calculation
        let totalCashFlow = totalIncome - totalExpenses;
        document.getElementById("totalCashFlow").value = totalCashFlow.toFixed(2);

        // Update Cash on Hand
        document.getElementById("cashOnHand").value = cashOnHand.toFixed(2);

        // Save to localStorage after calculations
        saveToLocalStorage();
    }

    // Function to update cash on hand based on Properties and Businesses table changes (Removed logic for cashOnHand update here)
    function updateCashOnHand() {
        // The logic for adjusting cashOnHand based on DP/Initial Investment is removed.
        document.getElementById("cashOnHand").value = cashOnHand.toFixed(2);
        saveToLocalStorage();
    }

    // Load saved data when page loads
    loadFromLocalStorage();

    // Add Event Listeners for Real-Time Updates
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => {
            updateCalculations();
            updateCashOnHand();
        });
    });

    // Initial calculation to set everything up
    updateCalculations();

    // Get Paid Button
    let getPaidButton = document.getElementById("getPaid");
    let canClick = true;
    getPaidButton.addEventListener("click", function () {
        if (canClick) {
            let totalCashFlow = parseFloat(document.getElementById("totalCashFlow").value) || 0;
            cashOnHand += totalCashFlow;
            document.getElementById("cashOnHand").value = cashOnHand;
            saveToLocalStorage();

            canClick = false;
            setTimeout(() => {
                canClick = true;
            }, 5000);
        }
    });

    // Add Money
    document.getElementById("addMoney").addEventListener("click", function () {
        let amount = parseFloat(prompt("Enter amount to add:")) || 0;
        cashOnHand += amount;
        document.getElementById("cashOnHand").value = cashOnHand.toFixed(2);
        saveToLocalStorage();
    });

    // Take Away Money
    document.getElementById("takeMoney").addEventListener("click", function () {
        let amount = parseFloat(prompt("Enter amount to take away:")) || 0;
        cashOnHand -= amount;
        document.getElementById("cashOnHand").value = cashOnHand.toFixed(2);
        saveToLocalStorage();
    });

    // Buy Stock
    document.getElementById("buyStock").addEventListener("click", function () {
        let stockType = prompt("Enter Stock Type (A or B):").toUpperCase();
        while(!((["A","B"]).includes(stockType))){
            stockType = prompt("Enter Stock Type (A or B):").toUpperCase();
        }
    
        let quantity = parseInt(prompt("Enter Quantity:")) || 0;
        let costPerShare = parseFloat(prompt("Enter Cost per Share:")) || 0;
        let totalCost = quantity * costPerShare;
        let currentCPS = document.getElementById(`stock${stockType}Cost`).value

        if (cashOnHand >= totalCost) {
            cashOnHand -= totalCost;
            document.getElementById("cashOnHand").value = cashOnHand;
            document.getElementById(`stock${stockType}Qty`).value = parseInt(document.getElementById(`stock${stockType}Qty`).value) + quantity;
            if(currentCPS!=0){
                document.getElementById(`stock${stockType}Cost`).value = (parseInt(document.getElementById(`stock${stockType}Cost`).value)+ costPerShare)/2;
            }else{
                document.getElementById(`stock${stockType}Cost`).value = costPerShare;
            }
            // After purchasing stock, update calculations to refresh the stock dividends
            updateCalculations();
        } else {
            alert("Not enough cash!");
        }
    });

    // Sell Stock
    document.getElementById("sellStock").addEventListener("click", function () {
        let stockType = prompt("Enter Stock Type (A or B):").toUpperCase();
        while(!((["A","B"]).includes(stockType))){
            stockType = prompt("Enter Stock Type (A or B):").toUpperCase();
        }
        let quantity = parseInt(prompt("Enter Quantity:")) || 0;
        let costPerShare = parseFloat(prompt("Enter Selling Price per Share:")) || 0;
        let totalSale = quantity * costPerShare;

        let stockQty = document.getElementById(`stock${stockType}Qty`);
        if (parseInt(stockQty.value) >= quantity) {
            cashOnHand += totalSale;
            document.getElementById("cashOnHand").value = cashOnHand.toFixed(2);
            stockQty.value = parseInt(stockQty.value) - quantity;
            // After selling stock, update calculations to refresh the stock dividends
            updateCalculations();
        } else {
            alert("Not enough stock to sell!");
        }
    });

    // Buy Gold
    document.getElementById("buyGold").addEventListener("click", function () {
        let quantity = parseInt(prompt("Enter Quantity of Gold Coins:")) || 0;
        if(quantity>0){
            let costPerCoin = parseFloat(prompt("Enter Cost per Coin:")) || 0;
            let totalCost = quantity * costPerCoin;
            let currentCPC = document.getElementById("goldCost").value;

            if (cashOnHand >= totalCost) {
                cashOnHand -= totalCost;
                document.getElementById("cashOnHand").value = cashOnHand.toFixed(2);
                document.getElementById("goldQty").value = parseInt(document.getElementById("goldQty").value) + quantity;
                if(currentCPC!=0){
                    document.getElementById("goldCost").value = ((parseInt(document.getElementById("goldCost").value))+ costPerCoin)/2;
                }else{
                    document.getElementById("goldCost").value = costPerCoin;
                }
                saveToLocalStorage();
            } else {
                alert("Not enough cash!");
            }
        }
    });

    // Sell Gold
    document.getElementById("sellGold").addEventListener("click", function () {
        if(document.getElementById("goldQty").value!=0){
            let quantity = parseInt(prompt("Enter Quantity to Sell:")) || 0;
            if(quantity>0){
            let costPerCoin = parseFloat(prompt("Enter Selling Price per Coin:")) || 0;
            let totalSale = quantity * costPerCoin;

            if (parseInt(document.getElementById("goldQty").value) >= quantity) {
                cashOnHand += totalSale;
                document.getElementById("cashOnHand").value = cashOnHand;
                if((document.getElementById("goldQty").value) == quantity){
                        document.getElementById("goldCost").value = 0;
                }
                document.getElementById("goldQty").value -= quantity;
                    saveToLocalStorage();
            } else {
                alert("Not enough gold to sell!");
            }
            }
        }else{
            alert("No gold to sell")
        }
    });

// Buy Trading Cards
document.getElementById("buyTradingCards").addEventListener("click", function () {
    let quantity = parseInt(prompt("Enter Quantity of Trading Cards to Buy:")) || 0;
    if(quantity>0){
        let costPerCard = parseFloat(prompt("Enter Cost per Trading Card:")) || 0;
        let totalCost = quantity * costPerCard;

        if (cashOnHand >= totalCost) {
            cashOnHand -= totalCost;
            document.getElementById("cashOnHand").value = cashOnHand;
            document.getElementById("tradingCardsQty").value = parseInt(document.getElementById("tradingCardsQty").value) + quantity;
            document.getElementById("tradingCardsCost").value = costPerCard;
                saveToLocalStorage();
        } else {
            alert("Not enough cash!");
            }
        }
});

// Sell Trading Cards
document.getElementById("sellTradingCards").addEventListener("click", function () {
    let quantity = parseInt(prompt("Enter Quantity to Sell:")) || 0;
    if(quantity>0){
    let costPerCard = parseFloat(prompt("Enter Selling Price per Trading Card:")) || 0;
    let totalSale = quantity * costPerCard;

    if (parseInt(document.getElementById("tradingCardsQty").value) >= quantity) {
        cashOnHand += totalSale;
        document.getElementById("cashOnHand").value = cashOnHand;
        document.getElementById("tradingCardsQty").value -= quantity;
                saveToLocalStorage();
    } else {
        alert("Not enough trading cards to sell!");
            }
        }
 });

    // Optional: Add a clear data button
    document.getElementById("clearCalculator").addEventListener("click", function () {
        if (confirm("Are you sure you want to clear all data?")) {
            localStorage.removeItem('incomeStatementData');
            location.reload();
            document.getElementById('myform').reset();
        }
    });
});