// Константы для базового URL и ключа API
const API_BASE_URL = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru';
const API_KEY = "20ddff6b-fba9-48fb-ba52-07f1cb37dcc1";

// Функция для отрисовки маршрутов в таблице
// Параметры:
// - data: данные маршрутов
// - page: номер страницы, по умолчанию 4
function renderRoutes(data, page = 4) {
    // Инициализация HTML для таблицы
    let tableHTML = "";
    // Вычисление индексов начала и конца отображаемых маршрутов
    page = page - 1;
    let start = page * 10;
    let end = (start + 10 < data.length) ? start + 10 : data.length;

    // Цикл для создания HTML для каждого маршрута
    for (let i = start; i < end; i++) {
        tableHTML +=
        `<tr>
          <th scope="row">${data[i].name}</th>
          <td>${data[i].description}</td>
          <td>${data[i].mainObject}</td>
          <td><button>Выбрать</button></td>
        </tr>`;
    }

    // Вставка HTML в тело таблицы
    document.getElementById("routes-table-body").innerHTML = tableHTML;
}

// Функция для получения данных о маршрутах с сервера
function getRoutes() {
    // Формирование URL с параметрами API_KEY
    const url = new URL(API_BASE_URL + '/api/routes');
    url.searchParams.set('api_key', API_KEY);

    // Создание объекта XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = 'json';
    xhr.send();

    // Обработка ответа от сервера
    xhr.onload = function () {
        // Если статус ответа не 200, выводим сообщение об ошибке
        if (xhr.status != 200) {
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        } else {
            // Выводим полученные данные на странице
            renderRoutes(xhr.response);
        }
    };
}

// Функция для выполнения при загрузке страницы
function onLoad() {
    // Получение данных о маршрутах
    getRoutes();
}

// Запуск функции onLoad при загрузке страницы
window.onload = onLoad;
