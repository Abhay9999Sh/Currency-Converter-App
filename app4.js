let url = "https://v6.exchangerate-api.com/v6/b536ccb8000989e1584e5ff2/pair";

let btn = document.querySelector("button");
const dropdowns = document.querySelectorAll(".dropdown select");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".two select");

// Populate the dropdowns with currency codes
for (select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        // Set default selected options for 'from' and 'to' dropdowns
        if (select.name === "from" && currCode === "USD") { 
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        
        select.append(newOption);
    }

    // Update flag image when a dropdown value changes
    select.addEventListener("change", (event) => {
        updateFlag(event.target);
    });
}

// Function to update the flag image based on selected currency
function updateFlag(element) {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

// Handle button click to fetch exchange rate and convert currency
btn.addEventListener("click", async (evt) => {
    evt.preventDefault(); // Prevent default form submission behavior
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    
    // Default amount to 1 if input is empty or less than 1
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    // Construct the API URL with selected currencies and amount
    const URL = `${url}/${fromCurr.value}/${toCurr.value}/${amtVal}`;
    console.log(URL);

    try {
        let res = await fetch(URL);
        console.log(res);

        let data = await res.json();
        console.log(data);

        // Check if the API response indicates success and display the result
        if (data.result === "success") {
            let exchangeRate = data.conversion_rate;
            let convertedAmount = data.conversion_result;
            document.querySelector(".msg").textContent = `${amtVal} ${fromCurr.value} = ${convertedAmount.toFixed(2)} ${toCurr.value}`;
        } else {
            document.querySelector(".msg").textContent = "Error fetching conversion rate.";
        }
    } catch (error) {
        console.error('Fetch error:', error);
        document.querySelector(".msg").textContent = "Network error.";
    }
});
