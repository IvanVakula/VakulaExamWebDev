const API_BASE_URL = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru';
const API_KEY = "20ddff6b-fba9-48fb-ba52-07f1cb37dcc1";

function renderRoutes(data, page = 4) {
    let tableHTML = "";
    page = page - 1;
    let start = page * 10;
    let end = (start + 10 < data.length) ? start + 10 : data.length;

    for (let i = start; i < end; i++) {
        tableHTML +=
        `<tr>
          <th scope="row">${data[i].name}</th>
          <td>${data[i].description}</td>
          <td>${data[i].mainObject}</td>
          <td><button>Выбрать</button></td>
        </tr>`;
    }

    document.getElementById("routes-table-body").innerHTML = tableHTML;
}

function getRoutes() {
    const url = new URL(API_BASE_URL + '/api/routes');
    url.searchParams.set('api_key', API_KEY);

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = 'json';
    xhr.send();

    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        } else {
            renderRoutes(xhr.response);
        }
    };
}

function onLoad() {
    getRoutes();
}

window.onload = onLoad;
