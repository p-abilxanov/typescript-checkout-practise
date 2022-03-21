const productMain = document.querySelector('.product__main');
const receiptMain = document.querySelector('.receipt__main');
const receiptMainInner = document.querySelector('.receipt__main').innerHTML;
const clearBtn = document.querySelector('.receipt__header button');
const receiptList = document.querySelector('.receipt__list');
const receiptSubtotal = document.querySelector('.receipt__subtotal');
const receiptTotal = document.querySelector('.receipt__total');
const receiptDiscount = document.querySelector('.receipt__discount');
const receiptPrice = document.querySelector('.receipt__price');

interface DataProduct {
    productName: string,
    productPrice: number,
    productSalePiece?: number,
    productSalePrice?: number,
    productSale?: boolean,
    productSoldCount: number
}

let dataProduct: DataProduct[] = [
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

// CREATE CARDS
for (let key in dataProduct) {
    let value = dataProduct[key];

    const productItem = document.createElement('DIV');
    productItem.setAttribute('class', 'product__item');

    // PRODUCT NAME
    const productIMG = document.createElement('DIV');
    productIMG.setAttribute('class', 'product__img');
    productIMG.innerHTML = value.productName;
    productItem.appendChild(productIMG);

    const productPriceDiv = document.createElement('DIV');
    productPriceDiv.setAttribute('class', 'product__price');

    const productPrice = document.createElement('SPAN');
    productPrice.innerHTML = `&euro;${value.productPrice}`;
    productPriceDiv.append(productPrice);

    // EGER SALE BAR BOLSA
    if (value.productSalePiece) {
        const productSalePrice = document.createElement('span');
        productSalePrice.innerHTML = `${value.productSalePiece} for &euro;${value.productSalePrice}`;
        const productSalePriceBack = document.createElement('DIV');
        productSalePriceBack.setAttribute('class', 'sale-block');
        productSalePrice.appendChild(productSalePriceBack);

        productPriceDiv.append(productSalePrice);
    }

    productItem.appendChild(productPriceDiv);

    productMain.appendChild(productItem);

    productItem.addEventListener('click', () => {
        value.productSoldCount++;
        myReceipt.getOrder(value);
    })
}

// CLEAR RECEIPT MAIN
clearBtn.addEventListener('click', () => {
    myReceipt.clearReceipt();
});

class Receipt {
    private subtotal: number = 0;
    private discount: number = 0;
    private total: number = 0;
    private totalOrder: DataProduct[] = [];

    private discountSum(): void {
        this.discount = 0;

        dataProduct.forEach(element => {
            if (element.productSalePiece && element.productSoldCount >= element.productSalePiece)
                this.discount += Math.floor(element.productSoldCount / element.productSalePiece) * (element.productPrice * element.productSalePiece - element.productSalePrice);
        });

        receiptDiscount.innerHTML = `<span>Discounts</span><span>&euro;${this.discount}</span>`;
    };

    private subtotalSum(): void {
        this.subtotal = 0;
        this.totalOrder.forEach(element => {
            this.subtotal += element.productPrice;
        });
        receiptSubtotal.innerHTML = `<span>Subtotal</span><span>&euro;${this.subtotal}</span>`;
    };

    private totalSum(): void {
        this.total = this.subtotal - this.discount;
        receiptTotal.innerHTML = `<span>Total</span><span>&euro;${this.total}</span>`;
    };

    private setOrder() {
        receiptList.innerHTML = "";

        this.totalOrder.forEach((value, i) => {
            if (document.querySelector('.receipt-empty')) { document.querySelector('.receipt-empty').remove() }
            const LI = document.createElement('LI');
            LI.setAttribute('class', 'receipt__item');

            const orderName = document.createElement('DIV');
            orderName.innerHTML = `Product ${value.productName}`;

            const orderPrice = document.createElement('DIV');
            orderPrice.innerHTML = `<span>&euro;${value.productPrice}</span>`;
            const minusBTN = document.createElement('SPAN');
            minusBTN.innerHTML = '-';
            minusBTN.setAttribute('class', 'order-remove');
            orderPrice.appendChild(minusBTN);

            minusBTN.addEventListener('click', () => {
                dataProduct[dataProduct.indexOf(value)].productSoldCount--;
                this.totalOrder.splice(i, 1);
                this.render();
            })

            LI.appendChild(orderName);
            LI.appendChild(orderPrice);
            document.querySelector('.receipt__list').appendChild(LI);
        });
    }

    getOrder(info: DataProduct): void {
        // RECEIPT TI ESAPLAW USHIN DIV
        if (!document.querySelector('.receipt__footer')) {
            const receiptFooter = document.createElement('DIV');
            receiptFooter.setAttribute('class', 'receipt__footer')
            receiptMain.appendChild(receiptFooter);
        }

        receiptPrice.setAttribute('style', 'border-top: 1px solid #999');
        this.totalOrder.push(info);
        this.render();
    };

    private render() {
        this.setOrder();
        this.subtotalSum();
        this.discountSum();
        this.totalSum();
    }

    clearReceipt(): void {
        receiptList.innerHTML = "";
        this.totalOrder = [];

        dataProduct.forEach(element => {
            element.productSoldCount = 0
        });
    }
}

let myReceipt = new Receipt();