var productMain = document.querySelector('.product__main');
var receiptMain = document.querySelector('.receipt__main');
var receiptMainInner = document.querySelector('.receipt__main').innerHTML;
var clearBtn = document.querySelector('.receipt__header button');
var receiptList = document.querySelector('.receipt__list');
var receiptSubtotal = document.querySelector('.receipt__subtotal');
var receiptTotal = document.querySelector('.receipt__total');
var receiptDiscount = document.querySelector('.receipt__discount');
var receiptPrice = document.querySelector('.receipt__price');
var dataProduct = [
    {
        productName: 'A',
        productPrice: 50.00,
        productSalePiece: 3,
        productSalePrice: 130,
        productSale: false,
        productSoldCount: 0
    },
    {
        productName: 'B',
        productPrice: 30.00,
        productSalePiece: 2,
        productSalePrice: 45,
        productSale: false,
        productSoldCount: 0
    },
    {
        productName: 'C',
        productPrice: 20.00,
        productSale: false,
        productSoldCount: 0
    },
    {
        productName: 'D',
        productPrice: 15.00,
        productSale: false,
        productSoldCount: 0
    }
];
var _loop_1 = function (key) {
    var value = dataProduct[key];
    var productItem = document.createElement('DIV');
    productItem.setAttribute('class', 'product__item');
    // PRODUCT NAME
    var productIMG = document.createElement('DIV');
    productIMG.setAttribute('class', 'product__img');
    productIMG.innerHTML = value.productName;
    productItem.appendChild(productIMG);
    var productPriceDiv = document.createElement('DIV');
    productPriceDiv.setAttribute('class', 'product__price');
    var productPrice = document.createElement('SPAN');
    productPrice.innerHTML = "&euro;".concat(value.productPrice);
    productPriceDiv.append(productPrice);
    // EGER SALE BAR BOLSA
    if (value.productSalePiece) {
        var productSalePrice = document.createElement('span');
        productSalePrice.innerHTML = "".concat(value.productSalePiece, " for &euro;").concat(value.productSalePrice);
        var productSalePriceBack = document.createElement('DIV');
        productSalePriceBack.setAttribute('class', 'sale-block');
        productSalePrice.appendChild(productSalePriceBack);
        productPriceDiv.append(productSalePrice);
    }
    productItem.appendChild(productPriceDiv);
    productMain.appendChild(productItem);
    productItem.addEventListener('click', function () {
        value.productSoldCount++;
        myReceipt.getOrder(value);
    });
};
// CREATE CARDS
for (var key in dataProduct) {
    _loop_1(key);
}
// CLEAR RECEIPT MAIN
clearBtn.addEventListener('click', function () {
    myReceipt.clearReceipt();
});
var Receipt = /** @class */ (function () {
    function Receipt() {
        this.subtotal = 0;
        this.discount = 0;
        this.total = 0;
        this.totalOrder = [];
    }
    Receipt.prototype.discountSum = function () {
        var _this = this;
        this.discount = 0;
        dataProduct.forEach(function (element) {
            if (element.productSalePiece && element.productSoldCount >= element.productSalePiece)
                _this.discount += Math.floor(element.productSoldCount / element.productSalePiece) * (element.productPrice * element.productSalePiece - element.productSalePrice);
        });
        receiptDiscount.innerHTML = "<span>Discounts</span><span>&euro;".concat(this.discount, "</span>");
    };
    ;
    Receipt.prototype.subtotalSum = function () {
        var _this = this;
        this.subtotal = 0;
        this.totalOrder.forEach(function (element) {
            _this.subtotal += element.productPrice;
        });
        receiptSubtotal.innerHTML = "<span>Subtotal</span><span>&euro;".concat(this.subtotal, "</span>");
    };
    ;
    Receipt.prototype.totalSum = function () {
        this.total = this.subtotal - this.discount;
        receiptTotal.innerHTML = "<span>Total</span><span>&euro;".concat(this.total, "</span>");
    };
    ;
    Receipt.prototype.setOrder = function () {
        var _this = this;
        receiptList.innerHTML = "";
        this.totalOrder.forEach(function (value, i) {
            if (document.querySelector('.receipt-empty')) {
                document.querySelector('.receipt-empty').remove();
            }
            var LI = document.createElement('LI');
            LI.setAttribute('class', 'receipt__item');
            var orderName = document.createElement('DIV');
            orderName.innerHTML = "Product ".concat(value.productName);
            var orderPrice = document.createElement('DIV');
            orderPrice.innerHTML = "<span>&euro;".concat(value.productPrice, "</span>");
            var minusBTN = document.createElement('SPAN');
            minusBTN.innerHTML = '-';
            minusBTN.setAttribute('class', 'order-remove');
            orderPrice.appendChild(minusBTN);
            minusBTN.addEventListener('click', function () {
                dataProduct[dataProduct.indexOf(value)].productSoldCount--;
                _this.totalOrder.splice(i, 1);
                _this.render();
            });
            LI.appendChild(orderName);
            LI.appendChild(orderPrice);
            document.querySelector('.receipt__list').appendChild(LI);
        });
    };
    Receipt.prototype.getOrder = function (info) {
        // RECEIPT TI ESAPLAW USHIN DIV
        if (!document.querySelector('.receipt__footer')) {
            var receiptFooter = document.createElement('DIV');
            receiptFooter.setAttribute('class', 'receipt__footer');
            receiptMain.appendChild(receiptFooter);
        }
        receiptPrice.setAttribute('style', 'border-top: 1px solid #999');
        this.totalOrder.push(info);
        this.render();
    };
    ;
    Receipt.prototype.render = function () {
        this.setOrder();
        this.subtotalSum();
        this.discountSum();
        this.totalSum();
    };
    Receipt.prototype.clearReceipt = function () {
        receiptList.innerHTML = "";
        this.totalOrder = [];
        dataProduct.forEach(function (element) {
            element.productSoldCount = 0;
        });
    };
    return Receipt;
}());
var myReceipt = new Receipt();
