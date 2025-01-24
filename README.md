# QuickCast Animation Library

> **Beta** · **In Development** · **Unstable**

QuickCast — это лёгкая библиотека для анимаций на странице. На данный момент доступны **две основные анимации**: слайдер (**Slider**) и аккордеон (**Accordion**). В будущем планируются новые эффекты (например: «бегущая строка», «toggle-бары» и т. д.).

- [Установка](#установка)
- [Базовая настройка (брейкпоинты)](#базовая-настройка-брейкпоинты)
- [Работа со Slider](#slider)
  - [selectors](#selectors)
  - [animation](#animation)
  - [behavior](#behavior)
  - [Колбэки и кастомизация](#callbacks--customization)
  - [Пример использования](#пример-использования-slider)
- [Accordion](#accordion)
  - [selectors](#selectors-accordion)
  - [animation](#animation-accordion)
  - [behavior](#behavior-accordion)
  - [Колбэки и кастомизация](#callbacks--customization-1)
  - [Пример использования (Accordion)](#пример-использования-accordion)
- [API колбэков (qcApi)](#api-колбэков-qcapi)
  - [qcApi в Slider](#qcapi-в-slider)
  - [qcApi в Accordion](#qcapi-в-accordion)
- [В разработке](#в-разработке)

# Установка

Требуется обязательное покдлючение последней версии GSAP перед QC

```bash
npm install gsap
npm install quick-cast
```

или

```js
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Mishka122/quick-cast@main/dist/prod/qcast.min.js"></script>
```

## Особенности

- Гибкая настройка брейкпоинтов (брейкпоинты отвечают за классификацию устройств: `mobile`, `tablet`, `desktop`).
- Простая инициализация анимации через единый класс `Cast`.
- Две готовые анимации: `slider` и `accordion`.
- Поддержка колбэков для управления логикой во время анимации.
- Возможность использования пресетов `usePreset` или полной кастомизации анимации через колбэк `useCustom`.

# Базовая настройка (брейкпоинты)

Перед использованием любой анимации (не обязательно, если устраивают значения по умолчанию), вы можете задать собственные брейкпоинты под мобильную и планшетную версии. Это делается через:

```js
new Cast("settings", {
  mobileMax: 480, // Максимальная ширина для mobile
  tabletMax: 992, // Максимальная ширина для tablet
});
```

По умолчанию, если вы не вызываете "settings", mobileMax будет 480, а tabletMax — 992.

## Использование анимаций

Библиотека предоставляет класс Cast, который вы вызываете с нужным типом анимации и объектом опций.

```js
new Cast("тип_анимации", {
  /* ...настройки... */
});
```

Доступные типы на данный момент:

- `slider` — анимация-слайдер
- `accordion` — анимация-аккордеон

# Slider

Объект настроек для слайдера может содержать следующие поля (все поля — необязательные, кроме `target`). Ниже основные категории: `selectors`, `animation`, `behavior`, а также колбэки.

## selectors

| Параметр                | Тип      | По умолчанию                   | Описание                                                        |
| ----------------------- | -------- | ------------------------------ | --------------------------------------------------------------- |
| **slides**              | `string` | не задано                      | Селектор для отдельных слайдов (элементы внутри контейнера).    |
| **slidesContainer**     | `string` | `[qc-slider="content-parent"]` | Селектор родительского контейнера слайдов.                      |
| **swipeArea**           | `string` | не задано                      | Селектор области, по которой будет идти «свайп».                |
| **paginationContainer** | `string` | не задано                      | Селектор контейнера пагинации (если используется `pagination`). |
| **markers**             | `string` | не задано                      | Селектор для маркеров (точки, номера и т. д.).                  |
| **markersActiveClass**  | `string` | `".active"`                    | Класс для активного маркера.                                    |
| **leftArrow**           | `string` | `[qc-slider="left-arrow"]`     | Селектор левой стрелки.                                         |
| **rightArrow**          | `string` | `[qc-slider="right-arrow"]`    | Селектор правой стрелки.                                        |

## animation

| Параметр     | Тип      | По умолчанию     | Описание                                                                   |
| ------------ | -------- | ---------------- | -------------------------------------------------------------------------- |
| **delay**    | `number` | `0`              | Задержка перед началом анимации (в секундах).                              |
| **duration** | `number` | `0.2`            | Длительность анимации (в секундах).                                        |
| **ease**     | `string` | `"power1.inOut"` | Тип easing (в формате [Easing GSAP](https://www.gsap.com/docs/v3/Eases/)). |

## behavior

| Параметр       | Тип       | По умолчанию | Описание                                  |
| -------------- | --------- | ------------ | ----------------------------------------- |
| **swipe**      | `boolean` | `true`       | Включает/отключает «свайп» жест.          |
| **pagination** | `boolean` | `true`       | Включает/отключает пагинацию.             |
| **infinity**   | `boolean` | `true`       | Включает «бесконечную» прокрутку слайдов. |

## callbacks & customization

`{ qcApi }` для слайдера содержит: `direction`, `currentSlide`, `previousSlide`, `nextSlide`, `previousSlide2`, `nextSlide2`
| Параметр | Тип | Описание |
|---|---|---|
|**onStart**|`function`|Вызывается в начале анимации. Аргументом передаётся объект `{ qcApi }`, содержащий вспомогательные методы.|
|**onComplete**|`function`|Вызывается в конце анимации, также получает `{ qcApi }`.|
|**usePreset**|`string`|Название преднастроенного пресета анимации (Доступный пресет: `classic.opacity`).|
|**useCustom**|`function`|Полная ручная кастомизация анимации. При задании управление анимацией передаётся этой функции, все остальные параметры игнорируются, аргумент — `{ qcApi }`.|

## Пример использования Slider

```js
const swiperFirst = new Cast("slider", {
  target: ".swiper", // главный селектор блока, где будет слайдер
  devices: "desktop", // работать только на десктопе
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
```

# Accordion

Объект настроек для аккордеона имеет схожую структуру: `target` (обязательный), `devices`, `selectors`, `animation`, `behavior`, колбэки.

## selectors

| Параметр    | Тип      | По умолчанию | Описание                                                             |
| ----------- | -------- | ------------ | -------------------------------------------------------------------- |
| **panels**  | `string` | не задано    | Селектор для панелей аккордеона.                                     |
| **header**  | `string` | не задано    | Селектор заголовка (зоны, по которой кликать для открытия/закрытия). |
| **content** | `string` | не задано    | Селектор скрытой части, которая открывается при активации панели.    |

## animation

| Параметр             | Тип      | По умолчанию     | Описание                                                                            |
| -------------------- | -------- | ---------------- | ----------------------------------------------------------------------------------- |
| **delayStart**       | `number` | `0`              | Задержка перед началом открытия (секунды).                                          |
| **delayComplete**    | `number` | `0`              | Задержка перед завершением (закрытием).                                             |
| **durationStart**    | `number` | `0.8`            | Длительность анимации раскрытия (секунды).                                          |
| **durationComplete** | `number` | `0.8`            | Длительность анимации закрытия (секунды).                                           |
| **easeStart**        | `string` | `"power1.inOut"` | Easing для открытия (в формате [Easing GSAP](https://www.gsap.com/docs/v3/Eases/)). |
| **easeComplete**     | `string` | `"power2.out"`   | Easing для закрытия (в формате [Easing GSAP](https://www.gsap.com/docs/v3/Eases/)). |

## behavior

| Параметр         | Тип      | По умолчанию | Описание                                                        |
| ---------------- | -------- | ------------ | --------------------------------------------------------------- |
| **initialPanel** | `number` | не задано    | Номер панели, которая будет открыта при загрузке (начиная с 0). |

## callbacks & customization

`{ qcApi }` для аккордеона содержит: `currentPanel`, `previousPanel`, `event`.
| Параметр | Тип | Описание |
|---|---|---|
|**onStart**|`function`|Вызывается в начале открытия/закрытия, получает `{ qcApi }`.|
|**onComplete**|`function`|Вызывается в конце открытия/закрытия, также получает `{ qcApi }`.|
|**usePreset**|`string`|Название пресета анимации (Доступный пресет: `classic`).|
|**useCustom**|`function`|Полная ручная кастомизация анимации. При задании управление анимацией передаётся этой функции, все иные параметры игнорируются, аргумент — `{ qcApi }`.|

## Пример использования Accordion

```js
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
    initialPanel: 1, // Открыть вторую панель при загрузке (считаем с 0)
  },
  onStart: ({ qcApi }) => {
    console.log("Accordion onStart, currentPanel:", qcApi.currentPanel);
  },
});
```

# API колбэков (qcApi)

Во всех колбэках (`onStart`, `onComplete`, `useCustom` и т. д.) первым аргументом приходит объект, содержащий поле `qcApi`. С его помощью вы можете взаимодействовать с элементами анимации.

## qcApi в Slider

Для слайдера `slider` доступны геттеры:

```js
qcApi.currentSlide;
qcApi.previousSlide;
qcApi.nextSlide;
qcApi.previousSlide2;
qcApi.nextSlide2;
qcApi.direction;
```

- `currentSlide` — индекс (или ссылка) на текущий слайд.
- `previousSlide`, `previousSlide2` — предыдущий слайд и «ещё на один» до предыдущего (если нужно).
- `nextSlide`, `nextSlide2` — следующий слайд и «последующий» за ним.
- `direction` — направление прокрутки ("forward", "backward", etc.).

## qcApi в Accordion

Для аккордеона `accordion` состав такой:

```js
qcApi.currentPanel;
qcApi.previousPanel;
qcApi.event;
```

- `currentPanel` — индекс (или ссылка) на текущую панель, которая открывается.
- `previousPanel` — индекс (или ссылка) на предыдущую открытую панель.
- `event` — тип события, например "open", "close" и т. д.

# В разработке

- Перенос бибилотеки на TS.
- Новые анимации: бегущая строка (marquee), toggle-бары и прочие эффекты.
- Улучшенный механизм пресетов, расширение библиотеки пресетов.
- Расширенная документация и примеры.

Следите за обновлениями, библиотека находится в состоянии активной разработки и может изменяться (см. теги beta, in-development, unstable).
