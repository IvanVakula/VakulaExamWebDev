const API_ADDRESS = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru';
const API_KEY = "20ddff6b-fba9-48fb-ba52-07f1cb37dcc1";

// Инициализируем массивы маршрутов и заявок
let ORDERS_DATA = [];
let ROUTES_DATA = [];

// Функция для отображения всплывающего сообщения
function showAlert(message, type) {
    // Создаем div для всплывающего сообщения
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    // Добавляем HTML-код для сообщения и кнопки закрытия
    alert.innerHTML = `${message} 
    <button type="button" class="btn-close" data-bs-dismiss="alert" 
    aria-label="Close"></button>`;
    // Добавляем сообщение на страницу
    document.getElementById('alert-container').appendChild(alert);
    // Устанавливаем таймер для автоматического закрытия сообщения через 5 сек
    setTimeout(() => alert.remove(), 5000);
}

// Функция для получения списка маршрутов с сервера
function getRoutes(callback) {
    // Формируем URL для запроса
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
            // В случае ошибки, выводим всплывающее уведомление
            showAlert('Произошла ошибка при получении маршрутов', 'danger');
        } else {
            // Заполняем массив ROUTES_DATA данными о маршрутах
            xhr.response.forEach(route => {
                ROUTES_DATA[route.id] = route.name;
            });
            // Вызываем колбэк после успешного получения данных
            callback();
        }
    };
}

// Функция для удаления заказа
function deleteOrder() {
    // Получаем модальное окно для удаления заказа
    const deleteModal = document.getElementById('deleteModal');
    // Формируем URL для запроса на удаление заказа
    url = new URL(API_ADDRESS + `/api/orders/${deleteModal.dataset.orderId}`);
    url.searchParams.set('api_key', API_KEY);
    // Создаем объект XMLHttpRequest для выполнения DELETE-запроса
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);
    xhr.responseType = 'json';
    xhr.send();
    // Обработчик события, срабатывающий при завершении запроса
    xhr.onload = function () {
        // Проверяем успешность выполнения запроса
        if (xhr.status != 200) {
            // В случае ошибки, выводим всплывающее уведомление
            showAlert('Произошла ошибка при удалении заявки', 'danger');
        } else {
            // Скрываем модальное окно, 
            // выводим успешное уведомление и обновляем список заказов
            bootstrap.Modal.getInstance(deleteModal).hide();
            showAlert('Заявка успешно удалена', 'success');
            getOrders();
        }
    };
}

// Функция для получения информации о гиде
function getGuideInfo(guideId, callback) {
    // Формируем URL для запроса информации о гиде
    url = new URL(API_ADDRESS + `/api/guides/${guideId}`);
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
            // В случае ошибки, выводим критическое уведомление
            showAlert('Произошла ошибка при получении имени гида', 'danger');
        } else {
            // Вызываем колбэк с полученной информацией о гиде
            callback(xhr.response);
        }
    };
}
function prepareModal(rowElement, onlyForView) {
    // Получение данных из data-атрибутов
    let table = document.getElementById("orderModal");
    const orderId = rowElement.dataset.orderId;
    const routeId = rowElement.dataset.routeId;
    const guideId = rowElement.dataset.guideId;
    const date = rowElement.dataset.date;
    const time = rowElement.dataset.time;
    const duration = rowElement.dataset.duration;
    const persons = rowElement.dataset.persons;
    const price = rowElement.dataset.price;
    const optionFirst = rowElement.dataset.optionFirst === 'true';
    const optionSecond = rowElement.dataset.optionSecond === 'true';

    // Получение имени гида и обновление поля
    document.getElementById('guideName').value = 'Загрузка...';
    getGuideInfo(guideId, function (response) {
        document.getElementById('guideName').value = response.name;
        table.dataset.pricePerHour = response.pricePerHour;
    });

    // Заполнение данных модального окна
    document.getElementById('routeName').value = ROUTES_DATA[routeId];
    document.getElementById('dateInput').value = date;
    document.getElementById('timeInput').value = time;
    document.getElementById('durationSelect').value = duration;
    document.getElementById('peopleInput').value = persons;
    document.getElementById('option1').checked = optionFirst;
    document.getElementById('option2').checked = optionSecond;
    document.getElementById('totalCost').value = `${price}р`;

    if (onlyForView) {
        // Если режим просмотра
        // делаем поля только для чтения и скрываем кнопку отправки формы
        document.getElementById('dateInput').readOnly = true;
        document.getElementById('timeInput').readOnly = true;
        document.getElementById('durationSelect').disabled = true;
        document.getElementById('peopleInput').readOnly = true;
        document.getElementById('option1').disabled = true;
        document.getElementById('option2').disabled = true;
        document.getElementById('sendForm').classList.add('d-none');
    } else {
        // Если это не только просмотр,делаем поля доступными
        // для редактирования и показываем кнопку отправки формы
        document.getElementById('dateInput').readOnly = false;
        document.getElementById('timeInput').readOnly = false;
        document.getElementById('durationSelect').disabled = false;
        document.getElementById('peopleInput').readOnly = false;
        document.getElementById('option1').disabled = false;
        document.getElementById('option2').disabled = false;
        document.getElementById('sendForm').classList.remove('d-none');
    }

    // Устанавливаем data-атрибуты для таблицы заказов
    table.dataset.orderId = orderId;
    table.dataset.routeId = routeId;
    table.dataset.guideId = guideId;
}


// Функция для отображения заказов на конкретной странице
function renderOrdersByPage(data, newPage) {
    // Получаем элемент таблицы заказов
    const ordersTable = document.getElementById("routes-table-body");
    // Очищаем содержимое таблицы перед отрисовкой новых данных
    ordersTable.innerHTML = '';

    // Вычисляем индексы начала и конца отображаемых заказов на текущей странице
    let start = (newPage - 1) * 5;
    let end = Math.min(start + 5, data.length);

    // Итерируем по заказам для отображения на странице
    for (let index = start; index < end; index++) {
        // Получаем текущий заказ
        const currentOrder = data[index];
        // Получаем детали заказа из данных маршрутов
        const orderDetails = ROUTES_DATA[currentOrder.route_id];

        // Создаем HTML-код строки таблицы для текущего заказа
        const rowHtml = ` 
            <tr data-order-id="${currentOrder.id}"
             data-route-id="${currentOrder.route_id}" 
                data-guide-id="${currentOrder.guide_id}"
                 data-date="${currentOrder.date}" 
                data-time="${currentOrder.time}" 
                data-persons="${currentOrder.persons}" 
                data-duration="${currentOrder.duration}" 
                data-price="${currentOrder.price}" 
                data-option-first="${currentOrder.optionFirst}"  
                data-option-second="${currentOrder.optionSecond}"> 
                <td>${index + 1}</td> 
                <td>${orderDetails}</td> 
                <td>${currentOrder.date}</td> 
                <td>${currentOrder.price}</td> 
                <td> 
                    <button type="button" 
                    class="btn btn-outline-primary btn-sm" 
                        onclick="prepareModal(this.closest('tr'), true)" 
                        data-bs-toggle="modal" data-bs-target="#orderModal"> 
                        <span class="bi bi-eye-fill"></span> 
                    </button> 
                    <button type="button" 
                    class="btn btn-outline-secondary btn-sm" 
                        onclick="prepareModal(this.closest('tr'), false)" 
                        data-bs-toggle="modal" data-bs-target="#orderModal"> 
                        <span class="bi bi-pencil-fill"></span> 
                    </button> 
                    <button type="button" 
                    class="btn btn-outline-danger btn-sm"  
                        onclick="prepareDeleteModal(${currentOrder.id})" 
                        data-bs-toggle="modal" data-bs-target="#deleteModal"> 
                        <span class="bi bi-trash-fill"></span> 
                    </button> 
                </td> 
            </tr> 
        `;
        // Добавляем сформированную строку в таблицу заказов
        ordersTable.innerHTML += rowHtml;
    }
}

// Функция для смены текущей страницы заказов
function changeOrdersPage(newPage) {
    // Отрисовываем заказы на новой странице
    renderOrdersByPage(ORDERS_DATA, newPage);
    // Вычисляем количество страниц и отрисовываем пагинацию
    const pageCount = Math.ceil(ORDERS_DATA.length / 5); // Количество страниц
    renderOrdersPaginationElement(pageCount, newPage);
}

// Функция для создания элемента пагинации
function createPageItem(page, isActive = false, 
    isDisabled = false, text = page) {
    // Создаем элемент списка
    const li = document.createElement('li');
    // Устанавливаем классы в зависимости от состояния элемента
    li.className = `page-item ${isActive ? 'active' : ''} 
    ${isDisabled ? 'disabled' : ''}`;
    
    // Создаем элемент якоря для каждой страницы
    const a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#routes-list';
    a.innerHTML = text;

    // Добавляем слушатель события 
    //только для активных и не отключенных элементов
    if (!isDisabled) {
        a.addEventListener('click', (e) => {
            changeOrdersPage(page);
        });
    }

    // Добавляем элемент якоря в элемент списка
    li.appendChild(a);
    return li;
}

// Функция для отрисовки элементов пагинации
function renderOrdersPaginationElement(pageCount, currentPage) {
    // Получаем элемент пагинации
    const pagination = document.getElementById('pagination');
    // Очищаем содержимое пагинации перед отрисовкой новых элементов
    pagination.innerHTML = '';

    // Добавляем кнопку "Предыдущая"
    pagination.appendChild(createPageItem(currentPage - 1, false, 
        currentPage === 1, '&laquo;'));

    // Генерируем элементы страниц
    const from = Math.max(currentPage - 2, 1);
    const to = Math.min(currentPage + 2, pageCount);
    for (let i = from; i <= to; i++) {
        pagination.appendChild(createPageItem(i, i === currentPage));
    }

    // Добавляем кнопку "Следующая"
    pagination.appendChild(createPageItem(currentPage + 1, false, 
        currentPage === pageCount, '&raquo;'));
}


// Функция для получения списка заявок
function getOrders(event) {
    // Формируем URL для запроса к API
    url = new URL(API_ADDRESS + `/api/orders`);
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
            showAlert('Произошла ошибка при получении списка заявок', 'danger');
        } else {
            // Обновляем данные о заявках и вызываем функцию смены страницы
            ORDERS_DATA = xhr.response;
            console.log(xhr.response);
            changeOrdersPage(1);
        }
    };
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
    let duration = parseInt(
        document.getElementById('durationSelect').value, 10);
    let peopleCount = parseInt(
        document.getElementById('peopleInput').value, 10);
    let dateValue = document.getElementById('dateInput').value;
    let timeValue = document.getElementById('timeInput').value;
    let dateTime = new Date(dateValue + 'T' + timeValue);

    let option1 = document.getElementById('option1').checked;
    let option2 = document.getElementById('option2').checked;

    // Инициализируем переменные для опций
    let option1Multiplayer = option1 ? 0.85 : 1;
    let option2Allowance = option2 ? peopleCount * 500 : 0;

    let dayOfWeek = dateTime.getDay(); // воскресенье - это 0.
    let hour = dateTime.getHours();
    
    // Увеличение стоимости от дня и времени
    let isThisDayOff = (dayOfWeek == 0 || dayOfWeek == 6) ? 1.5 : 1;
    let isItMorning = (isBetween(9, hour, 13)) ? 400 : 0;
    let isItEvening = (isBetween(20, hour, 23)) ? 1000 : 0;

    // Установка стоимости в зависимости от количества посетителей
    let numberOfVisitors;
    if (isBetween(10, peopleCount, 20)) numberOfVisitors = 1500;
    else if (isBetween(5, peopleCount, 9)) numberOfVisitors = 1000;
    else if (isBetween(1, peopleCount, 4)) numberOfVisitors = 0;

    // Формула расчета из методички
    let totalPrice = (pricePerHour * duration * isThisDayOff)
        + isItMorning + isItEvening + numberOfVisitors;
    
    // Умножение на множитель опции и добавление дополнительной опции
    totalPrice = totalPrice * option1Multiplayer + option2Allowance;

    // Устанавливаем общую стоимость в поле формы
    document.getElementById('totalCost').value = `${Math.round(totalPrice)}₽`;
}


// Функция для изменения заявки
function changeOrder(event) {
    // Создаем объект XMLHttpRequest для выполнения PUT-запроса
    const xhr = new XMLHttpRequest();
    const FD = new FormData();
    
    // Получаем идентификатор заказа
    let orderId = document.getElementById('orderModal').dataset.orderId;
    
    // Формируем URL для запроса на изменение заказа
    url = new URL(API_ADDRESS + `/api/orders/${orderId}`);
    url.searchParams.set('api_key', API_KEY);

    // Получаем значения из полей формы и добавляем их в FormData
    let modal = document.getElementById('orderModal');
    FD.append("guide_id", modal.dataset.guideId);
    FD.append("route_id", modal.dataset.routeId);
    FD.append("date", document.getElementById('dateInput').value);
    FD.append("time", document.getElementById('timeInput').value);
    FD.append("duration", parseInt(
        document.getElementById('durationSelect').value, 10)
    );
    FD.append("persons", parseInt(
        document.getElementById('peopleInput').value, 10)
    );
    FD.append("price", parseInt(
        document.getElementById('totalCost').value, 10)
    );
    FD.append("time", document.getElementById('timeInput').value);
    FD.append("optionFirst", Number(
        document.getElementById('option1').checked)
    );
    FD.append("optionSecond", Number(
        document.getElementById('option1').checked)
    );

    // Отправляем PUT-запрос с данными заказа
    xhr.open("PUT", url);
    xhr.responseType = 'json';
    xhr.send(FD);
    
    // Обработчик события, срабатывающий при завершении запроса
    xhr.onload = function () {
        // Проверяем успешность выполнения запроса
        if (xhr.status != 200) {
            // В случае ошибки, выводим всплывающее уведомление
            showAlert('Произошла ошибка при изменении заявки', 'danger');
        } else {
            // Скрываем модальное окно,
            // выводим успешное уведомление и обновляем список заказов
            bootstrap.Modal.getInstance(modal).hide();
            showAlert('Заявка успешно изменена', 'success');
            getOrders();
        }
    };
}

// Функция для подготовки модального окна удаления заказа
function prepareDeleteModal(orderId) {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.dataset.orderId = orderId;
}

// Функция, выполняемая при загрузке страницы
function onLoad() {
    // Получение данных о маршрутах и заявках при загрузке страницы
    getRoutes(getOrders);
}

// Добавляем обработчики событий для элементов формы
document.getElementById('deleteModal').querySelector('.btn-primary')
    .addEventListener('click', deleteOrder);
document.getElementById('dateInput').addEventListener('change', calculatePrice);
document.getElementById('timeInput').addEventListener('change', calculatePrice);
document.getElementById('durationSelect')
    .addEventListener('change', calculatePrice);
document.getElementById('peopleInput')
    .addEventListener('change', calculatePrice);
document.getElementById('option1').addEventListener('change', calculatePrice);
document.getElementById('option2').addEventListener('change', calculatePrice);

// Добавляем обработчик события для кнопки отправки формы
document.getElementById('sendForm').addEventListener("click", changeOrder);

// Запуск функции onLoad при загрузке страницы
window.onload = onLoad;