$(document).ready(function() {
	//Retrieving JSON file and loading default content in chatbot container.
    let products = [];
    $.getJSON('stockExchange_data.json', function(data) {
        products = data;
        showHomeMenu();
    }).fail(function() {
	//Notify with Error message in case of any issue in loading JSON file.
        console.error("Error loading JSON file.");
		displayMessage("Hello! Welcome to LSEG, Chatbot is currently unavailable. Please try again later. Thank you for your patience!");
    });
    
	//This function is used to Display message.
    function displayMessage(message) {
        $('#output').append(`<div for="Message">${message}</div>`);
        $('#output').scrollTop($('#output')[0].scrollHeight);
    }
	
	//This function is used to Display HomeMenu - All Stock Exchanges present in JSON.
    function showHomeMenu() {
        displayMessage("Hello! Welcome to LSEG, I'm here to help you.");
		$('#output').append(`<div class="col-left-main" for="Please select a Stock Exchange.">Please select a Stock Exchange.</div>`);
        $.each(products, (i, product) => {
            $('#output').append(`<div class="col-left" for="Please select ${product.stockExchange}."><button class="product" type="button" role="${product.stockExchange}">${product.stockExchange}</button></div>`);
        });
    }
	
	//This function is used to display respective stocks for the selected Stock Exchange.
    function showVariants(product) {                         
        // Retrieve product object based on product selected.
        const prodObj = products.filter(p => p.stockExchange === product);

        displayMessage(`<br/><div class="col-right">${product}</div><br/>`);
		$('#output').append(`<br/><div class="col-left-main" for="Please select a Stock.">Please select a Stock.</div>`);
        
		// Retrieve all top stocks - stock names for the product object.
		$.each(prodObj[0].topStocks, (index, variant ) => {
            $('#output').append(`<div class="col-left" for="Please select ${variant.stockName}."><button class="variant" type="button" role="${variant.stockName}" data-product="${product}" data-variant="${variant.stockName}" >${variant.stockName}</button></div>`);
        });
    }

	//This function is used to display respective stock price for the selected Stock.
    function showVariantDetails(product, variantName) {
		// Retrieve product object based on product selected.
        const prodObj = products.filter(p => p.stockExchange === product);
		// Retrieve variant object - Stock name based on variant selected.
        const variant = prodObj[0].topStocks.find(v => v.stockName === variantName);
        if (variant) {
			displayMessage(`<br/><div class="col-right" for="${variant.stockName}">${variant.stockName}</div><br/>`);
            displayMessage(`<div class="col-left-main" for="Stock Price of ${variant.stockName} is ${variant.price}">Stock Price of ${variant.stockName} is £ ${variant.price}. Please select an option.</div>`);
        }
        $('#output').append('<div class="col-left" for="Navigate to Home Menu"><button class="back" role="Navigate to Home Menu">Back to Home Menu</button></div>');
    }

	//This button is used to retrive all Stock Names of selected Stock Exchange.
    $(document).on('click', '.product', function() {
        const product = $(this).text();
        
        showVariants(product);
    });
	
	//This button is used to retrive Stock Price of selected Stock.
    $(document).on('click', '.variant', function() {
        const product = $(this).data('product');
        const variantName = $(this).data('variant');
        
        showVariantDetails(product, variantName);
    });

	//This button is used to retrive all Stock Names of selected Stock Exchange - Home Menu .
    $(document).on('click','.back', function() {
        $('#output').empty();
        showHomeMenu();
    });
});