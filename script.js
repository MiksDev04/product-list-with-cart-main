
// define elements
const addToCart = document.querySelectorAll('.add-to-cart');
const addToCartButton = document.querySelectorAll('.add-to-cart .select');
const increment = document.querySelectorAll('.add-to-cart .increment');
const decrement = document.querySelectorAll('.add-to-cart .decrement');
const addToCartImg = document.querySelectorAll('.add-to-cart .img-container');
const cardProduct = document.querySelectorAll('.card');
const productTitle = document.querySelectorAll('.card .title');
const productPrice = document.querySelectorAll('.card .price');
const foodCartEmpty = document.querySelector('.food-cart figure');
const totalQuantity = document.querySelector('.food-cart h1');
const foodCartLoaded = document.querySelectorAll('.food-cart >:not(figure, h1)');
const foodCartContainer = document.querySelector('.food-cart-container');
const orderConfirmedContainer = document.querySelector('.order-confirmed-container');



// declare variables
let totalCartProductQuantity = 0;
let totalCartProductPrice = [];
let productListSelected = [];
let thumbnailARR;


// ===================  get json data  ===========================
const getData = new Promise((resolve, reject) => {
    const data = fetch('./data.json')
        .then( value => value.json())
    // if resolve / have data
    resolve(data);
})

// add to cart function
function addProductToCart(e) {
    // get the index of selected product
    let index = Array.from(addToCart).indexOf(e.currentTarget);
    totalCartProductQuantity++; // add quantity each click
    addToCart[index].removeEventListener('click', addProductToCart)

    // get data from json file and compare it to the application
    let productListData = function(product) {
        saveTheProductSelected(product[index].name, product[index].price, index)
        thumbnailARR = product.map( function(p) {
            return p.image.thumbnail;
        })
    };
    getData.then(productListData)
    cartLoaded()
  
} 
// add event listener again to product if it is remove from cart
addToCart.forEach(cart => {
    cart.addEventListener('click', addProductToCart)
})

// ======================================================
// ===================== Check if cart is empty =========
function cartLoaded() {
    
    if (totalCartProductQuantity < 1) {
        foodCartEmpty.style.display = 'grid';
        foodCartLoaded.forEach(load => {
            load.style.display = 'none'
        })
    } else {
        foodCartEmpty.style.display = 'none';
        foodCartLoaded.forEach(load => {
            load.style.display = 'grid'
            foodCartContainer.style.display = 'flex'
        })
    }
    
    // increment and decrement quantity of product added to cart
    increment.forEach(inc => {
        inc.addEventListener('click', increaseProductQuantity);
    })
    decrement.forEach(dec => {
        dec.addEventListener('click', decreaseProductQuantity);
    })
    updateproductMenu();
}
cartLoaded();


// ========================= Increase quantity ==============================
function increaseProductQuantity(e) {
    const index = Array.from(increment).indexOf(e.currentTarget);
    productListSelected.forEach(product => {
        if (product.productNumber === index) {
            product.productQuantity++;
            totalCartProductQuantity++;
        }
    })
    
    cartLoaded()
}
// ========================= Decrease quantity ==============================
function decreaseProductQuantity(e) {
    const index = Array.from(decrement).indexOf(e.currentTarget);
    productListSelected.forEach(product => {
        if (product.productNumber === index) {
            product.productQuantity--;
            totalCartProductQuantity--;
        }
    })
    cartLoaded()
}

// ================== Update the application  =============================
// ================= every change or  interaction========================
function saveTheProductSelected(productName, productPrice, index) {
    // cardProduct[index].classList.add('product-added');
    let addedProductToCart = {
        name: productName,
        price: productPrice,
        productNumber: index,
        productQuantity: 1
    };
    productListSelected.push(addedProductToCart);
    
    // list the product added from menu
    updateproductMenu();
    // pass the product details every time it is saved
}
function updateproductMenu() {
    cardProduct.forEach(card => card.classList.remove('product-added'));
    addToCartButton.forEach(button => {
        button.innerHTML = `
            <button class="decrement">
              <img src="./assets/images/icon-decrement-quantity.svg" alt="">
            </button>
            <button class="select">
              <img src="./assets/images/icon-add-to-cart.svg" alt="">
              <span>Add to Cart</span>
            </button>
            <button class="increment">
              <img src="./assets/images/icon-increment-quantity.svg" alt="">
            </button>`
    })
    productListSelected.forEach((product, index) => {
        if (product.productQuantity < 1) {
            productListSelected.splice(index, 1);
            console.log(productListSelected)
            setTimeout(() => {
                addToCart[product.productNumber].addEventListener('click', addProductToCart)
            })
        }
        
    })
    productListSelected.forEach((product) => {
        addToCartButton[product.productNumber].innerHTML = `${product.productQuantity}`;
        cardProduct[product.productNumber].classList.add('product-added');
    })
    createCartProduct();
}



// add the product details to the cart
function createCartProduct() {
    foodCartContainer.innerHTML = '';
    totalCartProductPrice = []

    // update the total product count each user interaction
    totalQuantity.textContent = `Your Cart(${totalCartProductQuantity})`
    productListSelected.forEach(function(product) {
        const newProduct = document.createElement('div');
        newProduct.className = 'product-selected';
        newProduct.innerHTML = `
            <h5 class="cart-product-title">${product.name}</h5>
            <div class="product-details">
            <strong class="quantity">${product.productQuantity}x</strong>
            <span class="cart-product-price">@$${Number(product.price).toFixed(2)}</span>
            <span class="cart-product-total-price">$${Number(product.price * product.productQuantity).toFixed(2)}</span>
            </div>
            <button class="remove-product">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
            </button>`;
            
        foodCartContainer.append(newProduct);

        totalCartProductPrice.push(Number(product.price * product.productQuantity));
        // add event listener to each product added to the cart
        document.querySelectorAll('.remove-product').forEach( remove => {
            remove.addEventListener('click', removeProductFromCart)
        })
    })

    // confirm order list
    const confirmOrder = document.querySelector('.confirm-order');
    confirmOrder.addEventListener('click', confirmOrderList);

    //  count the total list of product price
    const totalPrice = document.querySelector('.total-price');
    totalPrice.textContent = '$' + totalCartProductPrice.reduce((a, b) => a + b, 0)
    
}


// ================ remove the product from the cart ==================
function removeProductFromCart(e) {
    let product = document.querySelectorAll('.product-selected')
    const element = Array.from(product).indexOf(e.currentTarget.parentNode);
    
    const productIndex = productListSelected[element].productNumber;
    // remove element from product listed selected from the cart
    productListSelected.splice(element, 1);
    totalCartProductQuantity--;
    // update

    addToCart[productIndex].addEventListener('click', addProductToCart);
    
    cartLoaded();
}

// confirm the order list  from the product
function confirmOrderList(e) {
    e.currentTarget.removeEventListener('click', confirmOrderList);
    orderConfirmedContainer.style.display = 'grid';
    // if (window.innerWidth < 500) {
    //     orderConfirmedContainer.show();
    // } else {
    // }
    orderConfirmedContainer.showModal();

    createConfirmProduct();
    
    // click to close modal
    const startNewOrder = document.querySelector('.start-new-order');
    startNewOrder.addEventListener('click', function() {
        orderConfirmedContainer.style.display = 'none';
        orderConfirmedContainer.close();
        totalCartProductQuantity = 0;
        productListSelected = [];
        addToCart.forEach(cart => {
            cart.addEventListener('click', addProductToCart)
        })
        cartLoaded();
    })
}

function createConfirmProduct() {

    // confirm cart container
    const confirmCartList = document.querySelector('.confirm-cart-list');
    confirmCartList.innerHTML = ''
    // update the total product count each user interaction
    totalQuantity.textContent = `Your Cart(${totalCartProductQuantity})`
    productListSelected.forEach(function(product) {
        const newProduct = document.createElement('div');
        newProduct.className = 'confirmed-product';
        newProduct.innerHTML = `
            <img src="${thumbnailARR[product.productNumber]}" alt="">
            <div class="product-details">
                <h5 class="cart-product-title">${cutName(product.name)}</h5>
                <div class="product-price">
                <strong class="quantity">${product.productQuantity}x</strong>
                <span class="cart-product-price">@$${Number(product.price).toFixed(2)}</span>
                </div>
            </div>
            <h3 class="cart-product-total-price">$${Number(product.price * product.productQuantity).toFixed(2)}</>`;

            confirmCartList.append(newProduct);
    })
    //  count the total list of product price
    const finalOrderTotal = document.querySelector('.final-order-total h1');
    finalOrderTotal.textContent = '$' + totalCartProductPrice.reduce((a, b) => a + b, 0).toFixed(2)
}

// cut the product name
function cutName(name) {
    if (name.length < 20) return name;
    return name.slice(0, 20) + '...'; 
}


