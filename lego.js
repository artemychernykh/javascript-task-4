'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var PRIORITIES = ['sortBy', 'filterIn', 'select', 'limit', 'format'];

function clone(collection) {
    var cloneCollection = [];
    for (var key in collection) {
        if (collection.hasOwnProperty(key)) {
            cloneCollection[key] = collection[key];
        }
    }

    return cloneCollection;
}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    // var newCollection = collection.slice();
    var newCollection = clone(collection);
    var functions = [].slice.call(arguments, 1);

    functions.sort(function (a, b) {
        return PRIORITIES.indexOf(a.name) - PRIORITIES.indexOf(b.name);
    });
    newCollection = functions.reduce(function (currentCollection, currentFunction) {
        return currentFunction(currentCollection);
    }, newCollection);

    return newCollection;
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Array}
 */
exports.select = function () {
    var fields = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (person) {
            var updatePerson = {};
            for (var property in person) {
                if (fields.indexOf(property) !== -1) {
                    updatePerson[property] = person[property];
                }
            }

            return updatePerson;
        });
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Array} newCollection
 */
exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (person) {
            return values.indexOf(person[property]) !== -1;
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Array} collection
 */
exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        if (order === 'asc') {
            collection.sort(function (a, b) {
                return (a[property] > b[property] ? 1 : -1);
            });
        } else {
            collection.sort(function (a, b) {
                return (a[property] > b[property] ? -1 : 1);
            });
        }

        return collection;
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Array} newCollection
 */
exports.format = function (property, formatter) {
    return function format(collection) {
        return collection.map(function (person) {
            person[property] = formatter(person[property]);

            return person;
        });
    };
};


/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Array} collection
 */
exports.limit = function (count) {
    return function limit(collection) {

        return collection.slice(0, count);
    };
};


if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        return;
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        return;
    };
}
