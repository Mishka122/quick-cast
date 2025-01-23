# QuickCast Animation Library

> **Beta** · **In Development** · **Unstable**

QuickCast — это лёгкая библиотека для анимаций на странице. На данный момент доступны **две основные анимации**: слайдер (**Slider**) и аккордеон (**Accordion**). В будущем планируются новые эффекты (например, «бегущая строка», «toggle-бары» и т. д.).

- [Особенности](#особенности)
- [Установка](#установка)
- [Базовая настройка (брейкпоинты)](#базовая-настройка-брейкпоинты)
- [Использование анимаций](#использование-анимаций)
  - [Slider](#slider)
    - [Опции Slider](#опции-slider)
      - [selectors (Slider)](#selectors-slider)
      - [animation (Slider)](#animation-slider)
      - [behavior (Slider)](#behavior-slider)
      - [Колбэки и кастомизация (Slider)](#колбэки-и-кастомизация-slider)
    - [Пример использования Slider](#пример-использования-slider)
  - [Accordion](#accordion)
    - [Опции Accordion](#опции-accordion)
      - [selectors (Accordion)](#selectors-accordion)
      - [animation (Accordion)](#animation-accordion)
      - [behavior (Accordion)](#behavior-accordion)
      - [Колбэки и кастомизация (Accordion)](#колбэки-и-кастомизация-accordion)
    - [Пример использования Accordion](#пример-использования-accordion)
- [API колбэков (qcApi)](#api-колбэков-qcapi)
  - [qcApi в Slider](#qcapi-в-slider)
  - [qcApi в Accordion](#qcapi-в-accordion)
- [В разработке](#в-разработке)

---

## Особенности

- Гибкая настройка брейкпоинтов (брейкпоинты отвечают за классификацию устройств: `mobile`, `tablet`, `desktop`).
- Простая инициализация анимации через единый класс `Cast`.
- Две готовые анимации: `slider` и `accordion`.
- Поддержка колбэков для управления логикой во время анимации.
- Возможность использования пресетов или полной кастомизации анимации через колбэк `useCustom`.

---

## Установка

*(Пока нет точных сведений о способе установки — ниже условный пример. Можете адаптировать под свой пакет/репозиторий.)*

```bash
npm install quickcast
Либо подключить собранный quickCast.js через тег <script type="module">:

html
Копировать
<script type="module" src="https://cdn.example.com/dist/quickCast.js"></script>
Базовая настройка (брейкпоинты)
Перед использованием любой анимации (не обязательно, если устраивают значения по умолчанию), вы можете задать собственные брейкпоинты под мобильную и планшетную версии. Это делается через:

js
Копировать
new Cast("settings", {
  mobileMax: 480,   // Максимальная ширина для mobile
  tabletMax: 992,   // Максимальная ширина для tablet
});
По умолчанию, если вы не вызываете "settings", mobileMax будет 480, а tabletMax — 992.

Использование анимаций
Библиотека предоставляет класс Cast, который вы вызываете с нужным типом анимации и объектом опций.

js
Копировать
new Cast("тип_анимации", { /* ...настройки... */ });
Доступные типы на данный момент:

"slider" — анимация-слайдер
"accordion" — анимация-аккордеон
Также в любом конфиге вы можете указать параметр devices, чтобы ограничить инициализацию конкретными устройствами (например, только desktop, или desktop,mobile и т. п.).

Slider
Опции Slider
Объект настроек для слайдера может содержать следующие поля (все поля — необязательные, кроме target). Ниже основные категории: selectors, animation, behavior, а также колбэки.

selectors (Slider)
Параметр	Тип	По умолчанию	Описание
slides	string	не задано	Селектор для отдельных слайдов (элементы внутри контейнера).
slidesContainer	string	[qc-slider="content-parent"]	Селектор родительского контейнера слайдов.
swipeArea	string	не задано	Селектор области, по которой будет идти «свайп».
paginationContainer	string|boolean	false	Селектор контейнера пагинации (если используется pagination).
markers	string|boolean	false	Селектор для маркеров (точки, номера и т. д.).
markersActiveClass	string	".active"	Класс для активного маркера.
leftArrow	string	[qc-slider="left-arrow"]	Селектор левой стрелки.
rightArrow	string	[qc-slider="right-arrow"]	Селектор правой стрелки.
animation (Slider)
Параметр	Тип	По умолчанию	Описание
delay	number	0	Задержка перед началом анимации (секунды).
duration	number	0.2	Длительность анимации (секунды).
ease	string	"power1.inOut"	Тип easing (зависит от используемой библиотеки анимаций; например, power1.inOut).
behavior (Slider)
Параметр	Тип	По умолчанию	Описание
swipe	boolean	true?	Включает/отключает «свайп» жест.
pagination	boolean	true?	Включает/отключает управление через пагинацию.
infinity	boolean	true?	Включает «бесконечную» прокрутку слайдов.
Колбэки и кастомизация (Slider)
Параметр	Тип	Описание
onStart	function	Вызывается в начале анимации. Аргументом передаётся объект { qcApi }, содержащий вспомогательные методы и данные (например, direction, currentSlide и т. д.).
onComplete	function	Вызывается в конце анимации. Аналогично получает { qcApi }.
usePreset	string	Название преднастроенного пресета.
useCustom	function	Полная ручная кастомизация анимации: если задана, то управление анимацией передаётся этой функции. Получает { qcApi }.
Пример использования Slider
js
Копировать
const swiperFirst = new Cast("slider", {
  target: ".swiper",        // селектор блока, где будет слайдер
  devices: "desktop",       // работать только на десктопе
  selectors: {
    paginationContainer: ".pagination",
    // ... прочие селекторы
  },
  animation: {
    duration: 0.2,
    ease: "power1.inOut",
  },
  behavior: {
    pagination: true,
    infinity: true,
    swipe: true,
  },
  onStart: ({ qcApi }) => {
    console.log("Slider started, direction:", qcApi.direction);
  },
  // ... при желании onComplete, usePreset, useCustom и т.п.
});
Accordion
Опции Accordion
Объект настроек для аккордеона имеет схожую структуру: target, devices, selectors, animation, behavior, колбэки.

selectors (Accordion)
Параметр	Тип	По умолчанию	Описание
panels	string	не задано	Селектор для панелей аккордеона.
header	string	не задано	Селектор заголовка (зоны, по которой кликать для открытия/закрытия).
content	string	не задано	Селектор скрытой части, которая открывается при активации панели.
animation (Accordion)
Параметр	Тип	По умолчанию	Описание
delayStart	number	0	Задержка перед началом открытия.
delayComplete	number	0	Задержка перед завершением (закрытием).
durationStart	number	0.8	Длительность анимации раскрытия (секунды).
durationComplete	number	0.8	Длительность анимации закрытия (секунды).
easeStart	string	"power1.inOut"	Easing для открытия.
easeComplete	string	"power2.out"	Easing для закрытия.
behavior (Accordion)
Параметр	Тип	По умолчанию	Описание
initialPanel	number	не задано	Индекс панели, которая будет открыта при загрузке (начиная с 0 или 1).
Колбэки и кастомизация (Accordion)
Параметр	Тип	Описание
onStart	function	Вызывается в начале открытия/закрытия. Аргументом передаётся { qcApi }.
onComplete	function	Вызывается по завершении анимации. Аналогично получает { qcApi }.
usePreset	string	Название пресета анимации.
useCustom	function	Полная ручная кастомизация. Если указана, управление анимацией передаётся этой функции (вместо штатного механизма). Получает { qcApi }.
Пример использования Accordion
js
Копировать
new Cast("accordion", {
  target: ".faq-accordion",
  devices: "mobile,desktop", // Например, работать на мобилке и десктопе
  selectors: {
    panels: ".panel",
    header: ".panel-header",
    content: ".panel-content",
  },
  animation: {
    delayStart: 0,
    durationStart: 0.8,
    easeStart: "power1.inOut",
    // ...
  },
  behavior: {
    initialPanel: 1, // Открыть вторую панель при загрузке (если считаем с 0)
  },
  onStart: ({ qcApi }) => {
    console.log("Accordion onStart, currentPanel:", qcApi.currentPanel);
  },
});
API колбэков (qcApi)
Во всех колбэках (onStart, onComplete, useCustom и т. д.) первым аргументом приходит объект, содержащий поле qcApi. С его помощью вы можете узнать текущее состояние анимации.

qcApi в Slider
Для слайдера ("slider") доступны геттеры:

js
Копировать
{
  get currentSlide() { ... },
  get previousSlide() { ... },
  get nextSlide() { ... },
  get previousSlide2() { ... },
  get nextSlide2() { ... },
  get direction() { ... },
}
currentSlide — индекс (или ссылка) на текущий слайд.
previousSlide, previousSlide2 — предыдущий слайд и «ещё на один» до предыдущего (если нужно).
nextSlide, nextSlide2 — следующий слайд и «последующий» за ним.
direction — направление прокрутки ("forward", "backward", etc.).
qcApi в Accordion
Для аккордеона ("accordion") примерный состав такой:

js
Копировать
{
  get currentPanel() { ... },
  get previousPanel() { ... },
  get event() { ... },
}
currentPanel — индекс (или ссылка) на текущую панель, которая открывается.
previousPanel — индекс (или ссылка) на предыдущую открытую панель.
event — тип события, например "open", "close" и т. д.
В разработке
Новые анимации: бегущая строка (marquee), toggle-бары и прочие эффекты.
Улучшенный механизм пресетов.
Расширенная документация и примеры.
Следите за обновлениями, библиотека находится в состоянии активной разработки и может изменяться (см. теги beta, in-development, unstable).