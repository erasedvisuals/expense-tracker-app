/*
        TRANSACTION OBJECT

    {
        date: DateObject
        description: 'string'
        amount: float 512.23
        type: 'incoming'/'expense'
    }



*/

let transactionClasses = "my-bg-light rounded p-2 d-flex justify-content-between w-100 border-start border-5" //+ border-danger/success
/*
<p class="m-0 text-white-50">${Description}</p> 
            <div class="d-flex">
                <p class="m-0 text-white-50">${amount}</p>
                <button class="border-0 bg-transparent p-0 ps-2"><img src="./assets/img/delete.png" alt="" width="60%"></button>
            </div>
*/

let arrObj = [ {}, {}, {}]
let d1 = new Date
console.log(d1.toLocaleString())