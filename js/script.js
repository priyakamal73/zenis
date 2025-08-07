// =====================
// 1. FILTER
// =====================
function filter() {
    let input = document.getElementById("search").value;
    let formattedInput = input.toLowerCase();

    let ul = document.getElementById("unorderedList");
    let li = ul.getElementsByTagName("li");

    let anyVisible = false;

    for (let i = 0; i < li.length - 1; i++) {
        let a = li[i].getElementsByTagName("a")[0];
        let filter = a.textContent || a.innerHTML;

        if (formattedInput === "") {
            li[i].style.display = "none";
            a.style.display = "none";
        } else if (filter.toLowerCase().includes(formattedInput)) {
            li[i].style.display = "block";
            a.style.display = "block";
            anyVisible = true;
        } else {
            li[i].style.display = "none";
            a.style.display = "none";
        }
    }

    let lastIndex = li.length - 1;
    if (formattedInput !== "" && !anyVisible) {
        li[lastIndex].style.display = "block";
        li[lastIndex].getElementsByTagName("a")[0].style.display = "block";
    } else {
        li[lastIndex].style.display = "none";
        li[lastIndex].getElementsByTagName("a")[0].style.display = "none";
    }

    ul.style.display = formattedInput !== "" ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const ul = document.getElementById("unorderedList");
    const li = ul.getElementsByTagName("li");

    for (let i = 0; i < li.length - 1; i++) {
        li[i].addEventListener("click", function () {
            const text = this.textContent.trim();
            searchInput.value = text;
            filter();
            ul.style.display = "none";
        });
    }
});

// =====================
// 2. ALL SECTION FLY-IN ANIMATION
// =====================
document.addEventListener("DOMContentLoaded", function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    const hiddenElements = document.querySelectorAll(".hidden");
    hiddenElements.forEach(el => observer.observe(el));
});

// =====================
// 3. HERO BANNER SLIDER
// =====================
const slides = document.querySelectorAll(".hero-slide");
let current = 0;

function showNextSlide() {
    if (!slides.length) {
        console.error("No slides found!");
        return;
    }

    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
}

if (slides.length > 0) {
    slides[current].classList.add("active");
    setInterval(showNextSlide, 3000);
} else {
    console.warn("No .hero-slide elements present in DOM.");
}

// =====================
// 4. CAROUSEL DUPLICATION
// =====================
document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    const carousel2 = document.querySelector(".carousel2");

    try {
        carousel.innerHTML += carousel.innerHTML;
        carousel2.innerHTML += carousel2.innerHTML;
    } catch (e) {
        console.log(e);
    }
});

// =====================
// 5. COUNTDOWN TIMER
// =====================
document.addEventListener("DOMContentLoaded", function () {
    let countDownDate = new Date("Dec 31, 2025 15:37:25").getTime();

    let x = setInterval(function () {
        let now = new Date().getTime();
        let distance = countDownDate - now;

        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        try {
            document.getElementById("days").innerHTML = days;
            document.getElementById("hours").innerHTML = hours;
            document.getElementById("minutes").innerHTML = minutes;
            document.getElementById("seconds").innerHTML = seconds;
        } catch (e) {
            console.log(e);
        }
    }, 1000);
});

// =====================
// 6. ADD TO CART
// =====================
function addToCart(button) {
    let productCard = button.closest(".item");
    let image = productCard.querySelector(".product-image").src;
    let name = productCard.querySelector(".name").innerHTML;
    let cost = productCard.querySelector(".cost").innerHTML;

    showToast(`${name} added to cart`);

    setTimeout(() => {
        let newProduct = { image, name, cost, quantity: 1 };
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let flag = false;

        cart.forEach(product => {
            if (
                product.image === newProduct.image &&
                product.name === newProduct.name &&
                product.cost === newProduct.cost
            ) {
                product.quantity += 1;
                flag = true;
            }
        });

        if (!flag) {
            cart.push(newProduct);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCounter();
    }, 500);
}

// =====================
// 7. TOAST MESSAGE
// =====================
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

// =====================
// 8. UPDATE CART NUMBER
// =====================
function updateCounter() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartCount = document.getElementById("cartCount");

    if (cartCount) {
        let totalQuantity = cart.reduce((sum, product) => sum + (product.quantity || 1), 0);
        cartCount.innerHTML = totalQuantity;
    }
}

// =====================
// 9. DISPLAY CART
// =====================
function displayCart() {
    updateCounter();
    const productDisplay = document.getElementById("productDisplay");
    const table = productDisplay.querySelector("table");

    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    const existingTbody = table.querySelector("tbody");
    if (existingTbody) {
        table.removeChild(existingTbody);
    }

    const emptyTexts = document.querySelectorAll(".empty-cart");
    if (cartItems.length > 0) {
        emptyTexts.forEach(elem => elem.remove());
    }

    if (cartItems.length === 0) {
        const productDisplay = document.getElementById("productDisplay");

        if (!document.querySelector(".empty-cart")) {
            const msg1 = document.createElement("p");
            msg1.className = "empty-cart";
            msg1.innerText = "Your cart is empty";


            const msg2 = document.createElement("p");
            msg2.className = "empty-cart";
            msg2.innerText = "Let's shop now!";


            productDisplay.appendChild(msg1);
            productDisplay.appendChild(msg2);
        }
    }

    const tbody = document.createElement("tbody");
    cartItems.forEach(product => {

        const tr = document.createElement("tr");
        tr.classList.add("dynamic-row");

        // 1. Product Image
        const td1 = document.createElement("td");
        td1.classList.add("td1");
        const divImg = document.createElement("div");
        divImg.classList.add("img");
        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;
        divImg.appendChild(img);
        td1.appendChild(divImg);
        tr.appendChild(td1);

        // 2. Product Details
        const td2 = document.createElement("td");
        td2.classList.add("td2");
        const a = document.createElement("a");
        a.classList.add("title");
        a.href = "productDetail.html";
        a.textContent = product.name;
        td2.appendChild(a);
        tr.appendChild(td2);

        // 3. Unit Price
        const td3 = document.createElement("td");
        td3.classList.add("td3");
        td3.textContent = product.cost;
        tr.appendChild(td3);

        // 4. Quantity
        const td4 = document.createElement("td");
        td4.classList.add("td4");
        const qtyDiv = document.createElement("div");
        qtyDiv.classList.add("details_qty_input");
        const qtyP = document.createElement("p");
        qtyP.textContent = product.quantity;
        qtyDiv.appendChild(qtyP);
        td4.appendChild(qtyDiv);
        tr.appendChild(td4);

        // 5. Subtotal
        const td5 = document.createElement("td");
        td5.classList.add("td5");
        const rawCost = product.cost.toString();
        const cost = parseFloat(rawCost.replace(/[^0-9.]/g, ""));
        const quantity = Number(product.quantity);
        const subtotal = cost * quantity;
        td5.textContent = "$" + subtotal.toFixed(2);
        tr.appendChild(td5);

        tbody.appendChild(tr);

        td1.setAttribute("data-label", "Product Image");
        td2.setAttribute("data-label", "Name");
        td3.setAttribute("data-label", "Unit Price");
        td4.setAttribute("data-label", "Quantity");
        td5.setAttribute("data-label", "Subtotal");
    });

    table.appendChild(tbody);

    calculateTotal();
}

// =====================
// 10. CLEAR CART
// =====================
function clearCart() {
    localStorage.removeItem("cart");
    updateCounter();
    displayCart();
}

// =====================
// 11. SET COUPON
// =====================
function setCoupon(button) {
    let code = button.textContent;
    let couponInputBox = document.getElementById("coupon");

    if (code.includes("TRX")) couponInputBox.value = "TRX8291KV";
    else if (code.includes("LMN")) couponInputBox.value = "LMN3487QP";
    else couponInputBox.value = "HEM4556JL";
}

// =====================
// 12. APPLY DISCOUNT
// =====================
function applyDiscount() {
    let subtotal = document.getElementById("subtotal");
    let couponCode = document.getElementById("coupon").value;
    let discount = document.getElementById("discount");
    let couponInputBox = document.getElementById("coupon");

    let subtotalCost = parseFloat(subtotal.innerHTML.replace(/[^0-9.]/g, ""));

    if (subtotalCost > 0) {
        if (couponCode.includes("TRX")) discount.innerHTML = "$20.75";
        else if (couponCode.includes("LMN")) discount.innerHTML = "$32.33";
        else discount.innerHTML = "$55.68";

        couponInputBox.value = "";
    } else {
        showToast("Cart is empty. Coupon not applicable");
        couponInputBox.value = "";
        discount.innerHTML = "$0.00";
    }

    calculateTotal();
}

// =====================
// 13. CALCULATE TOTAL
// =====================
function calculateTotal() {
    const subtotalElem = document.getElementById("subtotal");
    const taxElem = document.getElementById("tax");
    const discountElem = document.getElementById("discount");
    const totalElem = document.getElementById("total-cost");

    let subtotalValue = 0.00;

    const dynamicRows = document.querySelectorAll(".dynamic-row");
    dynamicRows.forEach(row => {
        const td5 = row.querySelector(".td5");
        if (td5) {
            const price = parseFloat(td5.innerText.replace(/[^0-9.]/g, ""));
            if (!isNaN(price)) subtotalValue += price;
        }
    });

    let taxValue = subtotalValue > 0 ? 10.00 : 0.00;
    let discountValue = parseFloat(discountElem?.innerText.replace(/[^0-9.]/g, "")) || 0;
    const totalValue = subtotalValue + taxValue - discountValue;

    subtotalElem.innerText = "$" + subtotalValue.toFixed(2);
    taxElem.innerText = "$" + taxValue.toFixed(2);
    totalElem.innerText = "$" + totalValue.toFixed(2);

    let total = [subtotalValue.toFixed(2), taxValue.toFixed(2), discountValue, totalValue.toFixed(2)];
    localStorage.setItem("total", total.toString());
}

// =====================
// 14. CHECKOUT PAGE REDIRECT
// =====================
function checkoutPage() {
    window.location.href = "checkout.html";
}

// =====================
// 15. TOGGLE ADDRESS FORM
// =====================
function displayForm() {
    const checkbox = document.getElementById("differentAddress");
    const form = document.getElementById("addressForm");
    form.style.display = checkbox.checked ? "block" : "none";
}

// =====================
// 16. DISPLAY TOTAL ON CHECKOUT
// =====================
document.addEventListener("DOMContentLoaded", displayTotalCheckout);
document.addEventListener("DOMContentLoaded", updateCounter);

function displayTotalCheckout() {
    let total = localStorage.getItem("total");
    const numArray = total.split(",").map(Number);

    let subtotalCheckout = document.querySelector(".subtotal");
    let taxCheckout = document.querySelector(".tax");
    let discountCheckout = document.querySelector(".discount");
    let totalCostCheckout = document.querySelector(".total-cost-checkout");

    subtotalCheckout.innerHTML = "$" + numArray[0].toFixed(2);
    taxCheckout.innerHTML = "$" + numArray[1].toFixed(2);
    discountCheckout.innerHTML = "$" + numArray[2].toFixed(2);
    totalCostCheckout.innerHTML = "$" + numArray[3].toFixed(2);
}

//===================
//17. SIDE SLIDER IN PRODUCT DETAIL PAGE
//===================

document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".side-slider");
    const fullImage = document.querySelector(".full-image img");
    const imageHeight = 108; // 100px + 8px margin
    let index = 0;

    let images = Array.from(slider.querySelectorAll("img"));

    // Clone all original images and append them for infinite loop
    images.forEach(img => {
        const clone = img.cloneNode(true);
        slider.appendChild(clone);
    });

    const allImages = slider.querySelectorAll("img");

    function update() {
        index++;
        slider.style.transition = "transform 0.5s ease-in-out";
        slider.style.transform = `translateY(-${index * imageHeight}px)`;

        const realIndex = index % images.length;
        fullImage.src = images[realIndex].src;
        fullImage.alt = images[realIndex].alt;

        // When we hit the end of original + clones, reset instantly
        if (index === images.length) {
            setTimeout(() => {
                slider.style.transition = "none";
                slider.style.transform = `translateY(0px)`;
                index = 0;
            }, 550);
        }
    }

    setInterval(update, 2000);
});

//===================
//18. SELECT SIZE
//===================
function selectSize(li) {
    const ul = document.querySelector(".stock-size");
    const allLi = ul.querySelectorAll("li");

    allLi.forEach(item => item.classList.remove("active"));

    li.classList.add("active");
    localStorage.setItem("selectedSize", li.getAttribute("data-size"));
}

document.addEventListener("DOMContentLoaded", function () {
    let selectedSize = localStorage.getItem("selectedSize");
    const ul = document.querySelector(".stock-size");

    if (selectedSize) {
        let allLi = ul.querySelectorAll("li");

        allLi.forEach(li => {
            if (li.getAttribute("data-size") == selectedSize) {
                li.classList.add("active");
            }
        })
    }
});

//===================
//18. REDUCE QUANTITY
//================

function reduceQuantity() {
    const countElement = document.getElementById("quantity-count");
    let count = parseInt(countElement.value, 10);

    // Fallback if value is empty or invalid
    if (isNaN(count)) count = 0;

    if (count > 0) {
        count -= 1;
    }

    countElement.value = count;
    localStorage.setItem("quantity-count", count);
}

//===================
//18. INCREASE QUANTITY
//================

function increaseQuantity() {
    const countElement = document.getElementById("quantity-count");
    let count = parseInt(countElement.value, 10);

    // Fallback if value is empty or invalid
    if (isNaN(count)) count = 0;

    count += 1;
    countElement.value = count;
    localStorage.setItem("quantity-count", count);
}

//===================
//19. RETAIN QUANTITY ON PAGE RELOAD
//================

document.addEventListener("DOMContentLoaded", function () {
    const countElement = document.getElementById("quantity-count");
    let savedCount = localStorage.getItem("quantity-count");

    if (savedCount === null || isNaN(parseInt(savedCount, 10))) {
        savedCount = 0;
    }

    countElement.value = parseInt(savedCount, 10);
});

//===================
//20. SHOW CONTENT BASED ON ACTIVE LI BUTTON
//================

function showContent(button) {

    const description = document.getElementById("description-content");

    const additionalInfo = document.getElementById("additional-info-content");

    document.querySelectorAll(".tab-list li").forEach(li => {
        li.classList.remove("active");
    });

    button.closest("li").classList.add("active");

    let title = button.innerHTML;

    if (title == "Description") {
        additionalInfo.style.display = "none";
        description.style.display = "block";
    }

    else {
        description.style.display = "none";
        additionalInfo.style.display = "block";
    }
}

//===================
//21. DISPLAY DEFAULT LI CONTENT 
//================

document.addEventListener("DOMContentLoaded", function () {
    let allLi = document.querySelectorAll(".tab-list li");

    allLi.forEach(li => {
        if (li.classList.contains("active")) {
            let activeButton = li.querySelector("button");
            showContent(activeButton); 
        }
    });
});