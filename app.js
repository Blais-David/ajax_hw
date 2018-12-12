const stocks = ['ORCL', 'AAPL', 'MSFT', 'TSLA', 'WMT'];
let validationList = [''];

const render = function () {
    $("#buttons-view").empty();
    for (let i = 0; i < stocks.length; i++) {
        const button = $("<button>").addClass("btn stock-btn");
        button.attr('data-name', stocks[i]);
        $("#buttons-view").append(button.text(stocks[i]));
    }
}
render();

$.ajax({
    url: 'https://api.iextrading.com/1.0/ref-data/symbols',
    method: 'GET',
}).then(function (promise) {
    for (let i = 0; i < promise.length; i++) {
        validationList.push(promise[i].symbol);
    }
});
console.log(validationList);

const addButton = function (e) {
    e.preventDefault();
    const stockTicker = $("#stock-input").val().trim().toUpperCase();
    for (let i = 0; i < validationList.length; i++) {
        if (stockTicker === validationList[i]){
            stocks.push(stockTicker); 
        }
    }
    $("#stock-input").val('');
    render();
}

let favArr = []
const favorite = function (e) {
    e.preventDefault();
    const favStock = $("#stock-input").val().trim().toUpperCase();
    favArr.push(favStock);
    $("#stock-input").val('');
   addFav();
}

const addFav = function () {
    $('.favStocks').empty();
    for (let i = 0; i < favArr.length; i++) {
        const favBtn = $("<button>"). addClass("btn fav-btn");
        favBtn.attr("data-name", favArr[i]);
        $(".favStocks").append(favBtn.text(favArr[i]));

    }
}
addFav();

const clear = function () {
    $(".favStocks").empty();
}
clear();

const displayInfo = function () {

    const stock = $(this).attr('data-name');
    const queryUrl = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,logo,price,company,news`;
    //Ajax call
    $.ajax({
        url: queryUrl,
        method: 'GET',
    }).then(function (response) {
        console.log(queryUrl);
        console.log(response);
        $("#stock-view").empty();

        const cardBody = $('<h3>').addClass('card-title text-center');

        const companyLogo = response.logo.url;
        cardBody.append(`<img src=${companyLogo} alt='logo'>`);

        const companyName = response.quote.companyName;
        cardBody.append(`<strong>${companyName}</strong>`);

        const table = $('<table>').addClass('table table-bordered');
        table.append('<thead class="text-center"><tr><th scope="col-md-1">CEO</th><th scope="col-md-1">Sector</th><th scope="col-md-1">Industry</th><th scope="col-md-1" class="bg-danger">Stock Price</th></tr></thead>');

        const tbody = $('<tbody>');

        const trow = $('<tr class="text-center">');
 
        const CEO = $('<td>').text(response.company.CEO);
        const sector = $('<td>').text(response.company.sector);
        const industry = $('<td>').text(response.company.industry);
        const stockPrice = $('<td>').text(response.price);
 
        trow.append(CEO, sector, industry, stockPrice);
        tbody.append(trow);
        table.append(tbody);

        const descrpDiv = $('<div>').addClass('description');
        descrpDiv.html('<h5 class="card-title font-weight-bold" id="sub-title">Description</h5>');

        const description = response.company.description;
        descrpDiv.append(`<p>${description}</p>`);

        $("#stock-view").append(cardBody);

        $("#stock-view").append(descrpDiv);

        $("#stock-view").append(table);

        const list = $('<ul class="list-group list-group-flush news-list">');
        $("#stock-view").append(list);
        list.html('<li class="card-title"><h5 class="font-weight-bold" id="sub-title">News</h5></li>')

        const stockNews = response.news;
        for (let i = 0; i < stockNews.length; i++) {
            list.append(displayNews(stockNews[i], i));

        };


    });
}

displayNews = function (news, index) {

    const newsLink = $('<a>').attr('href', news.url);

    const headline = news.headline;
    newsLink.append(`<h5><span class="badge badge-info">${index + 1}</span><strong>${headline}</strong></h5>`);
    const newsItems = $('<li>').addClass("list-group-item");
    newsItems.append(newsLink);

    return newsItems;
}

$("#add-btn").on('click', addButton);
$('#favorite-btn').on('click', favorite);
$("#clear-btn").on('click', clear);
$("#buttons-view").on('click', '.stock-btn', displayInfo);
