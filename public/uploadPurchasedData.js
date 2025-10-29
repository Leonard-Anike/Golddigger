/**
 * Handles purchase form submission, validates user input, 
 * sends purchase data to the server, and provides user feedback through a modal dialog.
 */

export async function updatePurchase() {

    // === DOM ELEMENT REFERENCES === //
    const form = document.querySelector('form')
    const investmentSummary = document.getElementById('investment-summary')
    const dialog = document.querySelector('dialog')
    const closeSummary = document.getElementById('close-summary')
    
    /**
     * Opens the purchase summary dialog with an animation.
     */
    const openDialog = () => {
        dialog.showModal();
        dialog.classList.add('is-open');
    }


    /**
     * Displays the investment summary message and opens the dialog.
     * 
     * @param {string} goldSoldValue - Amount of gold purchased (in ounces).
     * @param {number} investmentAmount - Total money invested (in GBP).
     */

    
    const investAction = (goldSoldValue, investmentAmount) => {
        investmentSummary.textContent = `
            You just bought ${goldSoldValue} ounces (ozt) for 
            £${investmentAmount}. You will receive confirmation Email shortly.
            `
        openDialog()
    }


     /**
     * Attaches the form submission handler to process and send purchase data.
     */
    const updatePurchasedData = () => {

        form.addEventListener('submit', async (e) => {
            e.preventDefault()

            const date = new Date().toISOString()
            const price = Number(document.getElementById('price-display').textContent.trim())
            const priceDisplay = `£${price}`
            const investmentAmount = Number(document.getElementById('investment-amount').value)
            const investmentAmountDisplay = `£${investmentAmount}`
            const goldSoldValue = `${(investmentAmount / price).toFixed(4)}`
            const goldSoldDisplay = `${goldSoldValue} Oz`
            const emailInput = document.getElementById('email').value.trim()

            if (!emailInput || !emailInput.includes('@')) {
                return
            }
                
            const data = {
                date: date,
                amount_paid: investmentAmountDisplay,
                price_per_oz: priceDisplay,
                gold_sold: goldSoldDisplay,
                user_email: emailInput
            }

            setTimeout(() => {
                investAction(goldSoldValue, investmentAmount)
            }, 650)
            
            closeSummary.addEventListener('click', () => {
                document.getElementById('email').value = ""
                document.getElementById('investment-amount').value = ""
                
                dialog.classList.add('closing')
                dialog.classList.remove('is-open');

                setTimeout(() => {
                    try {
                        dialog.close();
                    } catch {
                        dialog.removeAttribute('open');
                    }
                        dialog.classList.remove('closing');
                }, 800);
            })

            try {

                if(typeof price === 'number' && !Number.isNaN(price)) {
                    const response = await fetch ('/api', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(data)
                    })

                    if(response.ok) {
                        form.reset()
                    } else {
                        investmentSummary.textContent = 'Server error'
                        dialog.style.display = 'block'
                    }
                }

            } catch (err) {
                investmentSummary.textContent = 'Network error'
                dialog.style.display = 'block'
            }
        })
    }

    updatePurchasedData()
}