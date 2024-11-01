Creating a simple chatbot using HTML, CSS, jQuery and JSON involves setting up the basic structure of the page, styling it with CSS, and adding functionality with jQuery. 
Below is a Create a chatbot that enables user to select any of 3 Stock Exchanges (LSEG, NASDAQ, NYSE) and for the selected exchange provides 5 stocks that are traded in that exchange.
User can then select any one of those stocks to view the latest stock price.

---------------------------------------------
HTML Structure: (/Chatbot/Chatbot_Home.html)
---------------------------------------------
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LSEG Chatbot</title>
    <link rel="stylesheet" href="/Chatbot/styles/Chatbot_Style.css">
</head>
<body>
	<h1 role="LSEG Chatbot">LSEG Chatbot</h1>
	<div id="output" for="Chatbot Container"></div>
	<div id="input" for="Please pick an option.">Please pick an option.</div>
	<script src="/Chatbot/scripts/Chatbot_Script.js"></script>
</body>
</html>

------------------------------------------------
CSS Styles: (/Chatbot/styles/Chatbot_Style.css)
------------------------------------------------

		body { font-family: Arial, sans-serif; margin: 20px; font-size: 10px; width:625px;}
        #output { border: 1px solid #ccc; padding: 10px; width:100%; height: 400px; overflow-y: auto;}
		#input {padding:5px; background-color:lightgrey; background-image: url(/chatbot/images/Sent_Arrow.png); background-repeat: no-repeat;
    background-position: right; width: 637px;}
        button { border:none; background-color:transparent; font-family: Arial, sans-serif; font-size: 10px; width:100%;}
		button:hover {background-color: lightgray;font-family: Arial, sans-serif; font-size: 10px; cursor:pointer;}
		#ResponseMsg { float: right;} 
		h1 {background-color: blue; color:#fff; margin:0px; height:30px; padding:10px; background-image: url(/chatbot/images/Bot_Logo.jpg);
    background-size: 75px; background-repeat: no-repeat; text-align: center; font-size: 30px; width: 627px; border-top-right-radius: 5px;
    border-top-left-radius: 5px;}
	
		.col-left:hover {background-color: lightgray; cursor:pointer;}
		.col-right {background-color: lightgray; float:right; margin:5px; padding:5px; border-radius:5px;}
		.col-left {border: 1px solid lightblue; background-color: transparent; width:403px; text-align: center; margin-left:30px; }
		.col-left-main {margin-top:5px; padding:5px; border: 1px; background-color:lightblue; width:395px; background-image: url(/chatbot/images/Bot_logo.png);
		background-size: 30px; background-repeat: no-repeat; background-position: left; padding-left:35px; border-top-right-radius: 5px;
    border-top-left-radius: 5px;}

--------------------------------------------------
JQuery : (/Chatbot/scripts/Chatbot_Style.css)
--------------------------------------------------

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

--------------------------------------------------
JSON : (/Chatbot/stockExchange_data.json)
--------------------------------------------------

[
    {
        "code": "LSE",
        "stockExchange": "London Stock Exchange",
        "topStocks": [
            {
                "code": "CRDA",
                "stockName": "CRODA INTERNATIONAL PLC",
                "price": 4807.00
            },
            {
                "code": "GSK",
                "stockName": "GSK PLC",
                "price": 1574.80
            },
            {
                "code": "ANTO",
                "stockName": "ANTOFAGASTA PLC",
                "price": 1746.00
            },
            {
                "code": "FLTR",
                "stockName": "FLUTTER ENTERTAINMENT PLC",
                "price": 16340.00
            },
            {
                "code": "BDEV",
                "stockName": "BARRATT DEVELOPMENTS PLC",
                "price": 542.60
            }
        ]
    },
    {
        "code": "NYSE",
        "stockExchange": "New York Stock Exchange",
        "topStocks": [
            {
                "code": "AHT",
                "stockName": "Ashford Hospitality Trust",
                "price": 1.72
            },
            {
                "code": "KUKE",
                "stockName": "Kuke Music Holding Ltd",
                "price": 1.20
            },
            {
                "code": "ASH",
                "stockName": "Ashland Inc.",
                "price": 93.42
            },
            {
                "code": "NMR",
                "stockName": "Nomura Holdings Inc.",
                "price": 5.84
            },
            {
                "code": "LC",
                "stockName": "LendingClub Corp",
                "price": 9.71
            }
        ]
    },
    {
        "code": "NASDAQ",
        "stockExchange": "Nasdaq",
        "topStocks": [
            {
                "code": "AMD",
                "stockName": "Advanced Micro Devices, Inc.",
                "price": 164.21
            },
            {
                "code": "TSLA",
                "stockName": "Tesla, Inc.",
                "price": 190.35
            },
            {
                "code": "SOFI",
                "stockName": "SoFi Technologies, Inc.",
                "price": 8.24
            },
            {
                "code": "PARA",
                "stockName": "Paramount Global",
                "price": 14.92
            },
            {
                "code": "GOOGL",
                "stockName": "Alphabet Inc.",
                "price": 141.91
            }
        ]
    }
]

---------------------------------------------------------------------
Images: (/Chatbot/images/Bot_Logo.jpg, Bot_Logo.png, Sent_Arrow.jpg)
---------------------------------------------------------------------

Please include all 3 images with provided names in mentioned path.

-------------------
How It Works
-------------------

HTML: Sets up the structure of the chatbot with provided details.
CSS: Styles the chatbot, making it visually appealing.
jQuery: Handles user input, displays messages, and generates simple responses.
JSON: Sets up the structure of chatbot to provide responses.

------------------------
Running the Chatbot
------------------------

1. Create four files (Chatbot_Home.html, Chatbot_Style.css, Chatbot_Script.js, stockExchange_data.json) with the respective code and path provided above.
2. Please include all 3 images with provided names in mentioned path.
3. You can place all of them in AWS S3 bucket and create AWS CDN including cutover and link S3 bucket URL in origin of CDN.
   OR
   You can host them through XAMPP and place all the code in htdocs folder.
   OR
   You can host them on server where there is domain connectivity exists.
4. Open Chatbot_Home.html in a web browser to see the chatbot in action.

------------------------------
Operation / Steps to perform
------------------------------

1. Home Menu must consist of 3 Stock exchanges (LSEG, NASDAQ, NYSE)
2. Stock Menu - Upon selecting any of them, provide 5 stock names (different for each exchange)
3. Upon selection of any stock name, display its current value, and again provide Stock Menu (options to select 5 stocks)
4. Provide options to go to Home Menu at any point in time.