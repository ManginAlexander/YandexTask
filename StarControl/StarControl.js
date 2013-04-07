/*global
 $:false,
 window:false
 */
(function (toExport) {
    "use strict";

        /**
         * @function Функция извлекаект из $stars активные элементы,
         * пока не найдет самый большой по номеру элемент
         * @param $stars {Array} коллекция звездочек
         * @param startNumber {Number} коллекция номер звезды с которой начьнется извлечение
         * @param enableClass {String} название класса, которым помеченны активные элементы
         */
    var    getEnableStars = function ($stars, startNumber, enableClass) {
            var i,
                $items = [];
            for (i = startNumber; i < $stars.length; i += 1) {
                if ($stars[i].hasClass(enableClass)) {
                    $items.push($stars[i]);
                } else {
                    return $items;
                }
            }
            return $items;
        },
        /**
         * @function Функция извлекаект из $stars не активные элементы,
         * пока не найдет самый маленький по номеру элемент
         * @param $stars {Array} коллекция звездочек
         * @param startNumber {Number} коллекция номер звезды с которой начьнется извлечение
         * @param enableClass {String} название класса, которым помеченны активные элементы
         */
        getDisableStars = function ($stars, startNumber, enableClass) {
            var i,
                $items = [];
            for (i = startNumber; i >= 0; i -= 1) {
                if (!$stars[i].hasClass(enableClass)) {
                    $items.push($stars[i]);
                } else {
                    return $items;
                }
            }
            return $items;
        },
    /**
     * @private
     * @function Функция инициализирует звездочки
     * @param $root родитель, содержащий звездочки
     */
        initStarItems = function ($root) {
            var $stars = [],
                i,
                starControl = this;
            for (i = 0; i < this.maxCount; i += 1) {
                $stars.push($("<div/>", {
                }).data(this.attrNameForNumberOfStar, i));
                if (i <= this.currentStarCount) {
                    $stars[i].addClass(this.enableClass);
                }
            }
            $stars.forEach(function ($star) {
                $star.hover(function () {
                    var starNumber = $star.data(starControl.attrNameForNumberOfStar),
                        $enableStars,
                        $disableStars;
                    if ($star.hasClass(starControl.enableClass)) {
                        $enableStars = getEnableStars($stars, starNumber, starControl.enableClass);
                        for (i = $enableStars.length - 1; i > 0; i -= 1) {
                            $enableStars[i].removeClass(starControl.enableClass);
                        }
                    } else {
                        $disableStars = getDisableStars($stars, starNumber, starControl.enableClass);
                        for (i = $disableStars.length - 1; i >= 0; i -= 1) {
                            $disableStars[i].addClass(starControl.enableClass);
                        }
                    }
                    if ($root.data(starControl.attrNameForStarCount) !== starNumber) {
                        $root.data(starControl.attrNameForStarCount, starNumber);
                        starControl.subscribers.forEach(function (subscriber) {
                            if ($.isFunction(subscriber)) {
                                subscriber(starNumber);
                            }
                        });
                    }
                });
                $star.appendTo($root);
            });
        };
    /**
     * @param $root jQuery объект в котором будет создан StarControl
     * @param setings {Object} объект, содержащий настройки текущего StarControl
     * @field maxCount {Numeric} количество звездочек.
     * @field enableClass {String} класс, которым будут помечаться активные звездочки
     * @field subscribers {Array} массив, содержащий подписщиков на события изменения активных звездочек
     * @field attrNameForNumberOfStar {String} имя data-att звездочки, в котором хранится ее порядковый номер
     * @field attrNameForStarCount {String} имя data-att звездочки, в которой храниться количество выбранных звездочек
     * @field currentStarCount {Numeric} количество выбранных звездочек
     *
     * @constructor
     *
     * @author Мангин Александр Андреевич
     */

    toExport.StarControl = function ($root, setings) {
        if (!$root || !$root.length || $root.length === 0) {
            return;
        }
        setings = setings || {};

        this.maxCount = setings.maxCount || 5;
        this.enableClass = setings.enableClass || "";
        this.subscribers = setings.subscribers || [];

        this.attrNameForNumberOfStar = setings.attrNameForNumberOfStar || "";
        this.attrNameForStarCount = setings.attrNameForStarCount || "";

        if (!$root.data(this.attrNameForStarCount)) {
            $root.data(this.attrNameForStarCount, 0);
        }
        this.currentStarCount = $root.data(this.attrNameForStarCount);

        initStarItems.call(this, $root);
    };
}(window));