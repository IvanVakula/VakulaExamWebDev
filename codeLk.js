// const API_BASE_URL = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru';
// const API_KEY = "20ddff6b-fba9-48fb-ba52-07f1cb37dcc1";

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
    for (let i = start, rowNumber = 1; i < end; i++, rowNumber++) {
        tableHTML +=
            `<tr>
              <th>${rowNumber}</th>
              <td scope="row">${data[i].name}</td>
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

// Функция для открытия модального окна
function openModal() {
    document.getElementById('myModal').style.display = 'flex';
}

// Функция для закрытия модального окна
function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

// Функция для открытия модального окна редактирования
function openEditModal() {
    // Заполнение полей редактирования данными из отображаемых элементов
    document.getElementById('editFIO').value = document.getElementById('fio').innerText.slice(10).trim();
    document.getElementById('editRoute').value = document.getElementById('route').innerText.slice(18).trim();
    document.getElementById('editDataEcs').value = document.getElementById('dataEcs').innerText.slice(18).trim();
    document.getElementById('editTimeEcs').value = document.getElementById('timeEcs').innerText.slice(18).trim();
    document.getElementById('editDurationEcs').value = document.getElementById('durationEcs').innerText.slice(23).trim();
    document.getElementById('editPeopleCnt').value = document.getElementById('PeoplesCnt').innerText.slice(23).trim();

    // Отображение модального окна редактирования
    document.getElementById('editModal').style.display = 'flex';
}

// Функция для закрытия модального окна редактирования
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}


// Функция для сохранения изменений после редактирования
function saveChanges() {
    // Получение значений из полей редактирования
    editedFIO = document.getElementById('editFIO').value;
    editedRoute = document.getElementById('editRoute').value;
    editedData = document.getElementById('editDataEcs').value;
    editedTime = document.getElementById('editTimeEcs').value;
    editedDuration = document.getElementById('editDurationEcs').value;
    editedCnt = document.getElementById('editPeopleCnt').value;

    // Обновление отображаемых элементов новыми данными
    document.getElementById('fio').innerText = 'ФИО Гида: ' + editedFIO;
    document.getElementById('route').innerText = 'Название маршрута: ' + editedRoute;
    document.getElementById('dataEcs').innerText = 'Дата экскурсии: ' + editedData;
    document.getElementById('timeEcs').innerText = 'Время начала: ' + editedTime;
    document.getElementById('durationEcs').innerText = 'Длительность экскурсии: ' + editedDuration;
    document.getElementById('PeoplesCnt').innerText = 'Количество человек: ' + editedCnt;

    // Закрытие модального окна редактирования
    closeEditModal();
}

// Функция для открытия модального окна удаления
function openDeleteModal() {
    document.getElementById('deleteModal').style.display = 'flex';
}

// Функция для закрытия модального окна удаления
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}


// Функция для удаления строки
function deleteRow() {
    // Получение элемента строки и удаление его
    var row = document.getElementById('rowNumber');
    row.parentNode.removeChild(row);
    // Закрытие модального окна удаления
    closeDeleteModal();
}
