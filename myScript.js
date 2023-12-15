/*
        TRANSACTION OBJECT
    {
        date: urlParam.get('date')
        description: 'string'
        amount: float 512.23
        type: 'incoming'/'expense'
    }
*/
//______________________________________________________
/*
TRANSACTION innerHTML

<p class="m-0 text-white-50">${Description}</p> 
<div class="d-flex">
<p class="m-0 text-white-50">${amount}</p>
<button class="border-0 bg-transparent p-0 ps-2"><img src="./assets/img/delete.png" alt="" width="60%"></button>
</div>
*/
//__________________________________Code________________________________________//
// FUNCTION TO BUILD TRANSACTION NODES
function build(obj) {
    // Set the CSS classes for style
    let transactionClasses = "my-bg-light rounded p-2 d-flex justify-content-between w-100 border-start border-5"
    // Add the class for the left border to recognize the type of transaction
    let addOn = function () {
        if (obj.type == 'expense') {
            return ['border-danger', '-']
        } else return ['border-success', '+']
    }()
    // Create the div Node to build
    let transactionNode = document.createElement('div')
    transactionNode.className = `${transactionClasses} ${addOn[0]}`
    // Build the HTML resources with the details of the transaction
    transactionNode.innerHTML = `<p class="m-0 text-white-50">${obj.description}</p> 
    <div class="d-flex">
    <p class="m-0 text-white-50">${addOn[1] + obj.amount}</p>
    </div>`
    // Add the delete button
    const deleteBtn = document.createElement('button')
    deleteBtn.className = "border-0 bg-transparent p-0 ps-2"
    deleteBtn.innerHTML = `<img src="./assets/img/delete.png" alt="delete-ico" width="60%">`
    // This should add the button after the p-tag
    transactionNode.lastChild.appendChild(deleteBtn)
    // Add the delete function for button
    deleteBtn.addEventListener("click", () => {
        fetch(`${urlServer}/${obj.id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then(() => {
                history.removeChild(transactionNode);
            });
    })
    return transactionNode
}

// HISTORY BUILDER TODO: DASHBOARD BUILDER

let urlServer = 'http://localhost:3000/transactions'

fetch(urlServer)
    .then(res => res.json())
    .then(allTransactions => {
        let balance = 0
        let currentMonth = []
        let monthlyIncome = 0
        let monthlyExpense = 0
        let offset = 0
        // ITER ON CHRONOLOGICALLY ORDERED LIST
        for (let transaction of allTransactions.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
        })) {

            // Display only the last 4 transaction on the Homepage
            if (offset < 4){
                // Building the history section with the transactions
                let history = document.getElementById('history')
                history.appendChild(build(transaction))
            }
            offset++

            // Getting the balance
            if (transaction.type == 'incoming'){
                balance += transaction.amount
            }else {balance -= transaction.amount}

            // Monthly overview
            // ----- ?? Soluzione provvisoria ??-------
            const transactionMonth = new Date(transaction.date).getMonth()
            currentMonth.push(transactionMonth)
            if (transactionMonth == parseInt(currentMonth[0])){
                if (transaction.type == 'incoming'){
                    monthlyIncome += transaction.amount
                }else {monthlyExpense += Math.abs(transaction.amount)}
            }
            
        }
        console.log(typeof balance);
        // Display balance w/ only 2 digits and style replace if negative balance
        document.getElementById('balance').textContent = `$${balance.toFixed(2)}`
        if (balance<0){
            document.getElementById('balance').classList.replace('text-success', 'text-danger')
        }
        // Display monthly overview
        document.getElementById('income-month').textContent = `+$${monthlyIncome.toFixed(2)}`
        document.getElementById('expense-month').textContent = `-$${monthlyExpense.toFixed(2)}`
    })
    .catch(err => {
        console.log('Something went wrong: ' + err);
    })

// ADD NEW TRANSACTION
function add() {
    // Building the new transaction object
    let newTransaction = {
        date: document.getElementById('date').value,
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        type: document.querySelector('input[name="transactionType"]:checked').value
    }
    // Post it to the server
    fetch(urlServer, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction)
    })
        .then(res => res.json())
        .then(transaction => {
            let history = document.getElementById('history')
            // Build the transaction div dynamically
            history.appendChild(build(transaction))
        })
}
const addBtn = document.getElementById('add-btn')
addBtn.addEventListener('click', event =>{
    event.preventDefault()
    add()
})
