const API_ADDRESS = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru';
const API_KEY = "20ddff6b-fba9-48fb-ba52-07f1cb37dcc1";
// Инициализируем массив данных маршрутов
let ROUTES_DATA = [];


// Функция для отображения всплывающего сообщения
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `${message} 
    <button type="button" class="btn-close" data-bs-dismiss="alert" 
    aria-label="Close"></button>`;

    document.getElementById('alert-container').appendChild(alert);

    setTimeout(() => alert.remove(), 5000);
}

// Функция для отрисовки страницы маршрутов
function renderRoutesByPage(data, newPage) {
    let tableBody = document.getElementById("routes-table-body");
    let tableContent = ''; // Инициализация строки для содержимого таблицы
    //Вычисляем начальный и конечный индексы маршрутов для отображениянастранице
    let start = (newPage - 1) * 10;
    let end = Math.min(start + 10, data.length);
    // Итерируем по маршрутам и создаем строки для отображения
    for (let i = start; i < end; i++) {

        // Создание строки для каждого маршрута
        tableContent +=
            `<tr>
                <th scope="row">${data[i].name}</th>
                <td>${data[i].description}</td>
          <td>${data[i].mainObject}</td>
                <td>
                    <button data-route-id="${data[i].id}" 
                        data-route-name="${data[i].name}" 
                        onclick="getGuides(event)">
                        Выбрать
                    </button>
                </td>
            </tr>`;
    }
    // Установка HTML-кода для содержимого таблицы
    tableBody.innerHTML = tableContent;
}

// Функция для создания элемента страницы
function createPageItem
(page, isActive = false, isDisabled = false, text = page) {
    // Создаем элемент li для страницы
    const li = document.createElement('li');
    li.className = `page-item ${isActive ? 'active' : ''} 
    ${isDisabled ? 'disabled' : ''}`;
    // Создаем ссылку для элемента
    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#routes-list';
    a.innerHTML = text;
    // Добавляем слушатель события для смены страницы при клике
    a.addEventListener('click', () => changeRoutesPage(page));
    li.appendChild(a);
    return li;
}

// Функция для отрисовки элементов пагинации
function renderRoutesPaginationElement(pageCount, currentPage) {
    // Получаем элемент пагинации
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Добавляем кнопку "Предыдущая"
    pagination.appendChild(createPageItem(currentPage - 1, 
        false, currentPage === 1, '&laquo;'));

    // Генерация элементов страниц
    const from = Math.max(currentPage - 2, 1);
    const to = Math.min(currentPage + 2, pageCount);
    for (let i = from; i <= to; i++) {
        // Добавляем элемент страницы
        pagination.appendChild(createPageItem(i, i === currentPage));
    }

    // Кнопка "Следующая"
    pagination.appendChild(createPageItem(currentPage + 1, false, 
        currentPage === pageCount, '&raquo;'));
}

// Функция для смены текущей страницы маршрутов
function changeRoutesPage(newPage) {
    // Отрисовываем маршруты на новой странице
    renderRoutesByPage(ROUTES_DATA, newPage);
    // Вычисляем количество страниц и отрисовываем пагинацию
    const pageCount = Math.ceil(ROUTES_DATA.length / 10); // Количество страниц
    renderRoutesPaginationElement(pageCount, newPage);
}


// Функция для получения списка маршрутов через API
function getRoutes() {
    // Создаем объект URL для формирования запроса к API
    url = new URL(API_ADDRESS + '/api/routes');
    url.searchParams.set('api_key', API_KEY);
    // Создаем объект XMLHttpRequest для выполнения GET-запроса
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = 'json';
    xhr.send();
    // Обработчик события, срабатывающий при завершении запроса
    xhr.onload = function () {
        // Проверяем успешность выполнения запроса
        if (xhr.status != 200) {
        // В случае ошибки, выводим сообщение и отображаемвсплывающееуведомление
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
            showAlert('Произошла ошибка при получении списка маршрутов',
                'danger');
        } else {
            //сохраняем полученные данные и отображаем первую страницу маршрутов
            ROUTES_DATA = xhr.response;
            changeRoutesPage(1);
        }
    };
}

// Функция для склонения года в зависимости от числа
function pluralizeYears(n) {
    let res;
    let forms = ['год', 'года', 'лет'];
    let n_last2 = n % 100;
    let n_last1 = n % 10;
    // Определяем форму слова "год" в зависимости от числа
    if (n_last2 > 10 && n_last2 < 15) res = forms[2];
    else if (n_last1 == 1) res = forms[0];
    else if (n_last1 > 1 && n_last1 < 5) res = forms[1];
    else res = forms[2];
    // Возвращаем отформатированную строку
    return `${n} ${res}`;
}
// Функция для отображения кнопки "Купить" при выборе гида
function renderBuyButton(event) {
    const button = event.target;

    // Использование шаблонной строки для создания кнопки
    const buyButtonHtml = `
        <button type="button" class="btn btn-success" data-route-id="$
        {button.dataset.routeId}"
                data-route-name="${button.dataset.routeName}" data-guide-id="
                ${button.dataset.guideId}"
                data-guide-name="${button.dataset.guideName}" 
                data-price-per-hour="${button.dataset.pricePerHour}"
                data-bs-toggle="modal" 
                data-bs-target="#orderModal" onclick="prepareForm(event)">
            Оформить заявку
        </button>`;
    // Получаем контейнер для кнопки и устанавливаем HTML-код для кнопки
    const container = document.getElementById("buyContainer");
    container.innerHTML = buyButtonHtml; // Установка HTML-кода для кнопки
    container.scrollIntoView({ behavior: 'smooth' });
}


// Функция для отрисовки списка гидов
function renderGuides(data, routeId, routeName) {
    let tableBody = document.getElementById("guides-table-body");
    let tableContent = ''; // Инициализация строки для содержимого таблицы

    data.forEach(guide => {
        // Создание строки для каждого гида
        tableContent +=
            `<tr>
                <td><img src="gid.png" class="img" width="50"></td>
                <td>${guide.name}</td>
                <td>${guide.language}</td>
                <td>${pluralizeYears(guide.workExperience)}</td>
                <td>${guide.pricePerHour}₽/час</td>
                <td>
                    <button class="button btn-sm" data-route-id="${routeId}" 
                        data-route-name="${routeName}" 
                        data-guide-id="${guide.id}" 
                        data-guide-name="${guide.name}" 
                        data-price-per-hour="${guide.pricePerHour}"
                        onclick="renderBuyButton(event)">
                        Выбрать
                    </button>
                </td>
            </tr>`;
    });
    // Установка HTML-кода для содержимого таблицы
    tableBody.innerHTML = tableContent; 
    // Получаем элемент списка гидов и убираем класс 'd-none' для отображения
    let guidesList = document.getElementById('guides-list');
    if (guidesList.classList.contains('d-none')) {
        guidesList.classList.remove('d-none');
    }
    // Прокручиваем страницу к списку гидов с использованием плавного скроллинга
    guidesList.scrollIntoView({ behavior: 'smooth' });
}
// Функция для получения списка гидов по выбранному маршруту
function getGuides(event) {
    const button = event.target;
    const routeId = button.dataset.routeId;
    const routeName = button.dataset.routeName;
    // Устанавливаем текст для элемента страницы, 
    //отображающего доступные гиды по выбранному маршруту
    let text = `Доступные гиды по маршруту «${routeName}»`;
    document.getElementById("guides-text").innerHTML = text;
    // Создаем объект URL для формирования запроса к API
    url = new URL(API_ADDRESS + `/api/routes/${routeId}/guides`);
    url.searchParams.set('api_key', API_KEY);
    // Создаем объект XMLHttpRequest для выполнения GET-запроса
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = 'json';
    xhr.send();
    // Обработчик события, срабатывающий при завершении запроса
    xhr.onload = function () {
        // Проверяем успешность выполнения запроса
        if (xhr.status != 200) {
            // В случае ошибки, выводим всплывающее уведомление
            showAlert('Произошла ошибка при получении списка гидов', 'danger');
            //alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        } else {
            // В случае успеха, отображаем список гидов на странице
            renderGuides(xhr.response, routeId, routeName);
        }
    };
}

// Функция для предзаполнения формы заказа
function prepareForm() {
    var modalTriggerButton = 
    document.querySelector("[data-bs-target='#orderModal']");
    var routeId = modalTriggerButton.dataset.routeId;
    var routeName = modalTriggerButton.dataset.routeName;
    var guideId = modalTriggerButton.dataset.guideId;
    var guideName = modalTriggerButton.dataset.guideName;
    var pricePerHour = modalTriggerButton.dataset.pricePerHour;
    // Устанавливаем значения в поля формы заказа
    document.getElementById("guideName").value = guideName;
    document.getElementById("routeName").value = routeName;

    var modalElement = document.getElementById('orderModal');
    modalElement.dataset.routeId = routeId;
    modalElement.dataset.guideId = guideId;
    modalElement.dataset.pricePerHour = pricePerHour;
    document.getElementById("guideName").value = guideName;
    document.getElementById("routeName").value = routeName;

    // установить следующий день
    var dateInput = document.getElementById('dateInput');
    var today = new Date();
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    var dd = String(tomorrow.getDate()).padStart(2, '0');
    var mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    var yyyy = tomorrow.getFullYear();
    tomorrow = yyyy + '-' + mm + '-' + dd;
    dateInput.value = tomorrow;
}
// Функция для проверки, находится ли число между двумя значениями
function isBetween(lower, number, upper) {
    return number >= lower && number <= upper;
}
// Функция для расчета общей стоимости заказа
function calculatePrice() {
    // Получаем элемент модального окна заказа
    let modalElement = document.getElementById('orderModal');
    let pricePerHour = modalElement.dataset.pricePerHour;
    // Получаем значения из полей формы
    let duration = parseInt(document.getElementById(
        'durationSelect').value, 10);
    let peopleCount = parseInt(document.getElementById(
        'peopleInput').value, 10);
    let dateValue = document.getElementById('dateInput').value;
    let timeValue = document.getElementById('timeInput').value;
    let dateTime = new Date(dateValue + 'T' + timeValue);

    let option1 = document.getElementById('option1').checked;
    let option2 = document.getElementById('option2').checked;

    let option1Multiplayer = option1 ? 0.85 : 1;
    if (option2) {
        option2Allowance = peopleCount * 500;
    } else {
        option2Allowance = 0;
    }

    let dayOfWeek = dateTime.getDay(); // воскресенье - это 0.
    let hour = dateTime.getHours();
    // Увеличение стоимости от дня и времени
    let isThisDayOff = (dayOfWeek == 0 || dayOfWeek == 6) ? 1.5 : 1;
    let isItMorning = (isBetween(9, hour, 13)) ? 400 : 0;
    let isItEvening = (isBetween(20, hour, 23)) ? 1000 : 0;
    if (isBetween(10, peopleCount, 20)) numberOfVisitors = 1500;
    else if (isBetween(5, peopleCount, 9)) numberOfVisitors = 1000;
    else if (isBetween(1, peopleCount, 4)) numberOfVisitors = 0;
    // Формула расчёта из методички
    let totalPrice = (pricePerHour * duration * isThisDayOff)
     + isItMorning + isItEvening + numberOfVisitors;
    totalPrice = totalPrice * option1Multiplayer;
    totalPrice = totalPrice + option2Allowance;
    // Устанавливаем общую стоимость в поле формы
    document.getElementById('totalCost').value = `${Math.round(totalPrice)}₽`;
}
// Функция для создания заказа через API
function createOrder(event) {
    const xhr = new XMLHttpRequest();
    const FD = new FormData();
    url = new URL(API_ADDRESS + '/api/orders');
    url.searchParams.set('api_key', API_KEY);
    // Получаем данные из модального окна заказа
    let modalElement = document.getElementById('orderModal');
    FD.append("guide_id", modalElement.dataset.guideId);
    FD.append("route_id", modalElement.dataset.routeId);
    FD.append("date", document.getElementById('dateInput').value);
    FD.append("time", document.getElementById('timeInput').value);
    FD.append("duration", parseInt(
        document.getElementById('durationSelect').value, 10));
    FD.append("persons", parseInt(
        document.getElementById('peopleInput').value, 10));
    FD.append("price", parseInt(
        document.getElementById('totalCost').value, 10));
    FD.append("time", document.getElementById('timeInput').value);
    FD.append("optionFirst", Number(
        document.getElementById('option1').checked));
    FD.append("optionSecond", Number(
        document.getElementById('option1').checked));

    // Отправляем POST-запрос с данными заказа
    xhr.open("POST", url);
    xhr.responseType = 'json';
    xhr.send(FD);
    xhr.onload = function () {
        const container = document.getElementById("alert-container");
        if (xhr.status != 200) {
            // В случае ошибки, выводим всплывающее уведомление
            showAlert('Произошла ошибка при создании заявки', 'danger');
            container.scrollIntoView({ behavior: 'smooth' });
        } else {
            // В случае успеха, выводим всплывающее уведомление
            showAlert('Заявка успешно создана', 'success');
            container.scrollIntoView({ behavior: 'smooth' });
        }
    };

}

// Добавляем слушатели событий изменения для элементов формы
document.getElementById('dateInput').addEventListener('change', calculatePrice);
document.getElementById('timeInput').addEventListener('change', calculatePrice);
document.getElementById('durationSelect').addEventListener(
    'change', calculatePrice);
document.getElementById('peopleInput').addEventListener(
    'change', calculatePrice);
document.getElementById('option1').addEventListener('change', calculatePrice);
document.getElementById('option2').addEventListener('change', calculatePrice);
document.getElementById('sendForm').addEventListener("click", createOrder);

// Загружаем список маршрутов после полной загрузки страницы
window.onload = getRoutes;