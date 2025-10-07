      //ЗВУКИ
      //Звук прокрутки
      const tickSound = document.getElementById("tickSound"); 
      function playTick() { 
        tickSound.currentTime = 0;
        tickSound.play(); 
      }

      //Звук при победе
      const winSound = document.getElementById("winSound"); 
      function playWin() { 
        winSound.currentTime = 0;
        winSound.play(); 
      }
      // Звуки меча
      const bladeSound = document.getElementById("blade-sound");
      const reflectSound = document.getElementById("reflect-sound");
      //Звуки Хаоса
      const chaosSound = document.getElementById("chaose");
      //Громкость звуков
      tickSound.volume = 0.1;
      chaosSound.volume = 0.3;
      winSound.volume = 0.3;
      bladeSound.volume = 0.2;
      reflectSound.volume = 0.2;
      //ПЕРЕМЕННЫЕ ДЛЯ СМЕНЫ ЯЗЫКА
      const optionMenu = document.querySelector(".select-menu"),
      selectBtn = optionMenu.querySelector(".select-btn"),
      options = optionMenu.querySelectorAll(".option"),
      sBtn_text = optionMenu.querySelector(".sBtn-text");
      option_text = optionMenu.querySelector(".option-text");

      // ДОБАВЛЕНИЕ ТЕКСТА В РУЛЕТКУ КСГО


let isRolling = false;
let animationStart = null;
let duration = 5000; // общая длительность
let startOffset = 0;
let targetOffset = 0;
let currentOffset = 0;
let winnerIndex = 0;
let lastTickThreshold = 0; // порог для следующего тика
let cardStep = 110; // измерим из DOM
const visibleCards = 4;
const startBtn = document.querySelector(".start");
// Генерация карточек
function generateCards() {
  const inputs = [
    inp1.value,
    inp2.value,
    inp3.value,
    inp4.value,
    inp5.value,
    inp6.value,
    inp7.value,
    inp8.value,
    inp9.value,
    inp10.value
  ];

  const cardsBlock = document.querySelector(".cards");
  cardsBlock.innerHTML = "";

  const totalCards = 150;
  for (let i = 0; i < totalCards; i++) {
    const text = inputs[Math.floor(Math.random() * inputs.length)];
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = text;
    cardsBlock.appendChild(card);
  }

  // Сбрасываем визуальные стили победителя, если были
  Array.from(cardsBlock.children).forEach((card) => {
    card.style.background = "white";
    card.style.color = "#6A6A6A";
  });

  // Измеряем реальный шаг карточки: ширина + горизонтальные маргины
  const first = cardsBlock.children[0];
  if (first) {
    const cs = getComputedStyle(first);
    const ml = parseFloat(cs.marginLeft) || 0;
    const mr = parseFloat(cs.marginRight) || 0;
    cardStep = first.getBoundingClientRect().width + ml + mr;
  }
}

// Кривая замедления
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
// Основной цикл анимации
function animateScroll(timestamp) {
  if (!animationStart) animationStart = timestamp;
  const elapsed = timestamp - animationStart;
  const progress = Math.min(elapsed / duration, 1);
  const eased = easeOutCubic(progress);

  currentOffset = startOffset + (targetOffset - startOffset) * eased;

  const cardsBlock = document.querySelector(".cards");
  // Никаких CSS-transition — только прямой transform
  cardsBlock.style.transform = `translateX(-${currentOffset}px)`;

  // Тики: каждый раз, когда пересекли следующий шаг
  while (currentOffset >= lastTickThreshold + cardStep - 0.5) {
    lastTickThreshold += cardStep;
    playTick();
  }

  if (progress < 1) {
    requestAnimationFrame(animateScroll);
  } else {
    // Гарантируем точное попадание в целевой offset (субпиксельное выравнивание)
    cardsBlock.style.transform = `translateX(-${targetOffset}px)`;

    // Подсветка победителя: winnerIndex — тот, кто должен быть строго в центре
    const winnerCard = cardsBlock.children[winnerIndex - 1];
    if (winnerCard) {
      winnerCard.classList.add("winner");
    }
    playWin();

    isRolling = false;
    startBtn.disabled = false;
  }
}

// Старт
function start() {
  const cardsBlock = document.querySelector(".cards");
  const totalCards = cardsBlock.children.length;
  const centerOffset = Math.floor(visibleCards / 2);

  if (isRolling) return;
  isRolling = true;
  startBtn.disabled = true;
  cardsBlock.querySelectorAll(".winner").forEach((el) => el.classList.remove("winner"));
  generateCards();

  // Выбираем индекс, который окажется в центре окна
  // Ограничиваем диапазон, чтобы центр не ушёл за край
  const minIndex = centerOffset;
  const maxIndex = totalCards - (visibleCards - centerOffset) - 1;
  winnerIndex = Math.max(
    minIndex,
    Math.min(minIndex + Math.floor(Math.random() * (totalCards - visibleCards)), maxIndex)
  );

  // Целевой сдвиг так, чтобы winnerIndex оказался в центре
  targetOffset = (winnerIndex - centerOffset) * cardStep;

  // Сброс состояния анимации
  animationStart = null;
  startOffset = 0;
  currentOffset = 0;
  lastTickThreshold = 0;

  // Убираем любые CSS transition на всякий
  cardsBlock.style.transition = "none";
  // Старт
  requestAnimationFrame(animateScroll);
}

// Заполняем рулетку при загрузке
window.addEventListener("DOMContentLoaded", () => {
  generateCards();
});
const prizes = [
  { text: "", color: "hsl(210, 60%, 60%)" },
  { text: "", color: "hsl(160, 55%, 55%)" },
  { text: "", color: "hsl(45, 85%, 65%)" },
  { text: "", color: "hsl(25, 70%, 60%)" },
  { text: "", color: "hsl(0, 70%, 60%)" },
  { text: "", color: "hsl(340, 60%, 65%)" },
  { text: "", color: "hsl(95, 45%, 55%)" },
  { text: "", color: "hsl(200, 40%, 70%)" },
  { text: "", color: "hsl(280, 45%, 65%)" },
  { text: "", color: "hsl(180, 30%, 60%)" }
];

// Селекторы
const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");

// Звуки
function playTick() {
  const tickSound = document.getElementById("tickSound");
  if (tickSound) {
    tickSound.currentTime = 0;
    tickSound.play().catch(() => {});
  }
}
function playWin() {
  const winSound = document.getElementById("winSound");
  if (winSound) {
    winSound.currentTime = 0;
    winSound.play().catch(() => {});
  }
}
function stopTickSound() {
  const tickSound = document.getElementById("tickSound");
  if (tickSound) {
    tickSound.pause();
    tickSound.currentTime = 0;
  }
}

// Геометрия
const prizeSlice = 360 / prizes.length;
const prizeOffset = Math.floor(180 / prizes.length);

// Классы
const spinClass = "is-spinning";
const selectedClass = "selected";

// Состояния
let tickerAnim = null;
let rotation = 0;
let currentSlice = 0;
let prizeNodes = [];

// Фон через conic-gradient — НЕ перезаписываем весь атрибут style!
function createConicGradient() {
  spinner.style.background = `conic-gradient(
      from -90deg,
      ${prizes.map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`).reverse()}
    )`;
}

// Текстовые подписи для каждого сектора
function createPrizeNodes() {
  prizes.forEach(({ text }, i) => {
    const rot = prizeSlice * i * -1 - prizeOffset;
    spinner.insertAdjacentHTML(
      "beforeend",
      `<li class="prize" style="--rotate: ${rot}deg">
          <span class="text">${text}</span>
        </li>`
    );
  });
}

// Сборка колеса: фон + текст + список нод
function setupWheel() {
  spinner.innerHTML = ""; // очистить прошлые подписи
  createConicGradient(); // обновить фон
  createPrizeNodes(); // создать подписи заново
  prizeNodes = wheel.querySelectorAll(".prize");
  // Сброс начального угла через CSS-переменную
  spinner.style.setProperty("--rotate", rotation % 360);
}

// Случайная инерция
function spinertia(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Безопасное получение угла из transform; если transform = 'none' — вернуть 0
function getSpinnerAngleDeg() {
  const transform = window.getComputedStyle(spinner).transform;
  if (!transform || transform === "none") return 0;
  const values = transform.split("(")[1].split(")")[0].split(",");
  const a = parseFloat(values[0]);
  const b = parseFloat(values[1]);
  let rad = Math.atan2(b, a);
  if (rad < 0) rad += 2 * Math.PI;
  return Math.round(rad * (180 / Math.PI));
}

// Анимация тика язычка: дергаем при смене сектора
function runTickerAnimation() {
  const angle = getSpinnerAngleDeg();
  const slice = Math.floor(angle / prizeSlice);

  if (currentSlice !== slice) {
    ticker.style.animation = "none";
    setTimeout(() => (ticker.style.animation = null), 10);
    currentSlice = slice;
    playTick();
  }

  tickerAnim = requestAnimationFrame(runTickerAnimation);
}

// Выбор призового сектора по финальному rotation
let lastWinnerIndex = null;

function selectPrize() {
  const selected = Math.floor((rotation % 360) / prizeSlice);
  if (prizeNodes && prizeNodes[selected]) {
    prizeNodes[selected].classList.add(selectedClass);
    lastWinnerIndex = selected;
  }
}

// Сброс состояния колеса: нужен при переключении режимов
function resetWheel() {
  // Остановка тикера
  if (tickerAnim) {
    cancelAnimationFrame(tickerAnim);
    tickerAnim = null;
  }

  // Визуальные сбросы
  wheel.classList.remove(spinClass);
  trigger.disabled = false;

  // Снять выделения
  if (prizeNodes && prizeNodes.length) {
    prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
  }

  // Сброс угла (оставляем корректный 0..359)
  rotation = rotation % 360;
  spinner.style.setProperty("--rotate", rotation);

  // Остановить звук
  stopTickSound();
}

// Запуск
setupWheel();

// Кнопка "Крутить"
trigger.addEventListener("click", () => {
  if (trigger.disabled) return;
  if (!prizeNodes || prizeNodes.length === 0) {
    setupWheel(); // если вдруг очистилось, пересобрать
  }

  trigger.disabled = true;
  rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));

  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
  wheel.classList.add(spinClass);

  // через CSS-переменную меняем поворот — transform всегда валиден
  spinner.style.setProperty("--rotate", rotation);

  // запуск тикера
  ticker.style.animation = "none";
  runTickerAnimation();
});

// Окончание анимации вращения (CSS transition)
spinner.addEventListener("transitionend", () => {
  if (tickerAnim) {
    cancelAnimationFrame(tickerAnim);
    tickerAnim = null;
  }

  rotation = rotation % 360;
  selectPrize();
  playWin();

  wheel.classList.remove(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  trigger.disabled = false;
});



// При входе в режим "Колесо удачи"
function enterWheelMode() {
  resetAllModes();
  document.getElementById("wheelluck").style.display = "block";

  // если есть прошлый победитель — подсветим его
  if (lastWinnerIndex !== null && prizeNodes && prizeNodes[lastWinnerIndex]) {
    prizeNodes[lastWinnerIndex].classList.add(selectedClass);
  }
}


  // При выходе из режима "Колесо удачи" — ОЧЕНЬ ВАЖНО сбросить колесо
 function leaveWheelMode() {
  cancelAnimationFrame(tickerAnim);
  tickerAnim = null;
  wheel.classList.remove('is-spinning');
  rotation = rotation % 360;
  spinner.style.setProperty('--rotate', rotation);
  selectPrize(); // ← назначаем победителя
  trigger.disabled = false;
  stopTickSound();
   
}
// Универсальный сброс проекта (заполни своими очистками)
  function resetAllModes() {
    // Остановить любые звуки рулеток/тикеров
    stopTickSound();
  }

      // ТЕКСТ В КОЛЕСЕ + ОТРИСОВКА

      function updatePrizes() {
        const inputs = [inp1, inp2, inp3, inp4, inp5, inp6, inp7, inp8, inp9, inp10];

        inputs.forEach((inp, i) => {
          prizes[i].text = inp.value;
        });

        setupWheel();
      }

      // Список всех элементов, на которые нужен обработчик
      const slotIds = [
        "firstl",
        "secondl",
        "thirdl",
        "fourl",
        "fivel",
        "firstr",
        "secondr",
        "thirdr",
        "fourr",
        "fiver"
      ];

      slotIds.forEach((id) => {
        const slot = document.querySelector(`[data-id="${id}"]`);
        if (slot) {
          const input = slot.querySelector("input");
          if (input) {
            input.addEventListener("input", updatePrizes);
          }
        }
      });

//ФУНКЦИЯ РАНДОМА

function getRandomInt(max) {
  return Math.round(Math.random() * max);
}  


//ПЕРЕКЛЮЧЕНИЕ РЕЖИМОВ
//Функции для режима боя
function enableBattleMode() {
  document.body.classList.add("battle-mode");
}
function disableBattleMode() {
  document.body.classList.remove("battle-mode");
}


// Дефолтные настройки
var mode = 0;
enableBattleMode();

// Первый режим
classic.addEventListener("click", function () {
  mode = 0;
  enableBattleMode();
  // Сбрасываем активный класс у всех кнопок
  [classic, rand, frand, roul, whl, chl, whatelse].forEach((btn) => {
    btn.classList.remove("active-mode");
  });
  tickSound.volume = 0;
  // Добавляем активный класс на текущую
  this.classList.add("active-mode");

  document.getElementById("last").style.display = "none";
  document.getElementById("roulette").style.display = "none";
  document.getElementById("wheelluck").style.display = "none";
  document.getElementById("center").style.visibility = "visible";
  document.getElementById("center").style.display = "flex";
  document.getElementById("challenges").style.display = "none";
  document.getElementById("downloadall").style.display = "none";
  slotIds.forEach((id) => {
    const slot = document.querySelector(`[data-id="${id}"]`);
    if (slot) {
      const input = slot.querySelector("input");
      if (input) {
        leaveWheelMode();

        // Сброс бордера
        slotIds.forEach((id) => {
          const slot = document.querySelector(`[data-id="${id}"]`);
          if (slot) {
            const input = slot.querySelector("input");
            if (input) {
              // Сброс классов удара
              input.classList.remove("hit-red", "hit-green");
              // Можно ещё явно убрать рамку
              input.style.border = "1px solid transparent";
            }
          }
        });
      }
    }
  });
});

//Режим босс файта

rand.addEventListener("click", function () {
  mode = 1;
  enableBattleMode();
  // Сбрасываем активный класс у всех кнопок
  [classic, rand, frand, roul, whl, chl, whatelse].forEach((btn) => {
    btn.classList.remove("active-mode");
  });

  // Добавляем активный класс на текущую
  this.classList.add("active-mode");
  tickSound.volume = 0;
  document.getElementById("center").style.display = "flex";
  document.getElementById("wheelluck").style.display = "none";
  document.getElementById("last").style.display = "flex";
  document.getElementById("roulette").style.display = "none";
  document.getElementById("center").style.visibility = "visible";
  document.getElementById("challenges").style.display = "none";
  document.getElementById("downloadall").style.display = "none";
  slotIds.forEach((id) => {
    const slot = document.querySelector(`[data-id="${id}"]`);
    if (slot) {
      const input = slot.querySelector("input");
      if (input) {
        leaveWheelMode();

        // Сброс бордера
        slotIds.forEach((id) => {
          const slot = document.querySelector(`[data-id="${id}"]`);
          if (slot) {
            const input = slot.querySelector("input");
            if (input) {
              // Сброс классов удара
              input.classList.remove("hit-red", "hit-green");
              // Можно ещё явно убрать рамку
              input.style.border = "1px solid transparent";
            }
          }
        });
      }
    }
  });
});

//Режим рандома

frand.addEventListener("click", function () {
  mode = 2;
  enableBattleMode();
  // Сбрасываем активный класс у всех кнопок
  [classic, rand, frand, roul, whl, chl, whatelse].forEach((btn) => {
    btn.classList.remove("active-mode");
  });

  // Добавляем активный класс на текущую
  this.classList.add("active-mode");
  tickSound.volume = 0;
  document.getElementById("center").style.display = "flex";
  document.getElementById("wheelluck").style.display = "none";
  document.getElementById("last").style.display = "none";
  document.getElementById("roulette").style.display = "none";
  document.getElementById("center").style.visibility = "visible";
  document.getElementById("challenges").style.display = "none";
  document.getElementById("downloadall").style.display = "none";
  slotIds.forEach((id) => {
    const slot = document.querySelector(`[data-id="${id}"]`);
    if (slot) {
      const input = slot.querySelector("input");
      if (input) {
        leaveWheelMode();
        // Сброс бордера
        slotIds.forEach((id) => {
          const slot = document.querySelector(`[data-id="${id}"]`);
          if (slot) {
            const input = slot.querySelector("input");
            if (input) {
              // Сброс классов удара
              input.classList.remove("hit-red", "hit-green");
              // Можно ещё явно убрать рамку
              input.style.border = "1px solid transparent";
            }
          }
        });
      }
    }
  });
});

//Режим рулетка ксго

roul.addEventListener("click", function () {
  mode = 3;
  disableBattleMode();
  // Сбрасываем активный класс у всех кнопок
  [classic, rand, frand, roul, whl, chl, whatelse].forEach((btn) => {
    btn.classList.remove("active-mode");
  });
  leaveWheelMode();
  // Добавляем активный класс на текущую
  this.classList.add("active-mode");
  tickSound.volume = 0.1;
  document.getElementById("center").style.display = "flex";
  document.getElementById("wheelluck").style.display = "none";
  document.getElementById("roulette").style.display = "flex";
  document.getElementById("last").style.display = "none";
  document.getElementById("center").style.visibility = "visible";
  document.getElementById("challenges").style.display = "none";
  document.getElementById("downloadall").style.display = "none";
  slotIds.forEach((id) => {
    const slot = document.querySelector(`[data-id="${id}"]`);
    if (slot) {
      const input = slot.querySelector("input");
      if (input) {
        slotIds.forEach((id) => {
          const slot = document.querySelector(`[data-id="${id}"]`);
          if (slot) {
            const input = slot.querySelector("input");
            if (input) {
              // Сброс классов удара
              input.classList.remove("hit-red", "hit-green");
              // Можно ещё явно убрать рамку
              input.style.border = "1px solid transparent";
            }
          }
        });
      }
    }
  });
});

//Режим колесо удачи

whl.addEventListener("click", function () {
  mode = 4;
  disableBattleMode();
  // Сбрасываем активный класс у всех кнопок
  [classic, rand, frand, roul, whl, chl, whatelse].forEach((btn) => {
    btn.classList.remove("active-mode");
  });
  enterWheelMode();
  // Добавляем активный класс на текущую
  this.classList.add("active-mode");
  tickSound.volume = 0.1;
  document.getElementById("center").style.display = "flex";
  document.getElementById("wheelluck").style.display = "inline-block";
  document.getElementById("roulette").style.display = "none";
  document.getElementById("last").style.display = "none";
  document.getElementById("wheelluck").style.display = "inline-block";
  document.getElementById("center").style.visibility = "visible";
  document.getElementById("challenges").style.display = "none";
  document.getElementById("downloadall").style.display = "none";
  slotIds.forEach((id) => {
    const slot = document.querySelector(`[data-id="${id}"]`);
    if (slot) {
      const input = slot.querySelector("input");
      if (input) {
        slotIds.forEach((id) => {
          const slot = document.querySelector(`[data-id="${id}"]`);
          if (slot) {
            const input = slot.querySelector("input");
            if (input) {
              // Сброс классов удара
              input.classList.remove("hit-red", "hit-green");
              // Можно ещё явно убрать рамку
              input.style.border = "1px solid transparent";
            }
          }
        });
      }
    }
  });
});

//Челленджы

chl.addEventListener("click", function () {
  mode = 5;
  disableBattleMode();
  // Сбрасываем активный класс у всех кнопок
  [classic, rand, frand, roul, whl, chl, whatelse].forEach((btn) => {
    btn.classList.remove("active-mode");
  });
  leaveWheelMode();

  // Добавляем активный класс на текущую
  this.classList.add("active-mode");
  tickSound.volume = 0;
  document.getElementById("center").style.display = "none";
  document.getElementById("wheelluck").style.display = "none";
  document.getElementById("roulette").style.display = "none";
  document.getElementById("last").style.display = "none";
  document.getElementById("center").style.visibility = "hidden";
  document.getElementById("challenges").style.display = "flex";
  document.getElementById("downloadall").style.display = "none";
  slotIds.forEach((id) => {
    const slot = document.querySelector(`[data-id="${id}"]`);
    if (slot) {
      const input = slot.querySelector("input");
      if (input) {
        // Сброс бордера
        slotIds.forEach((id) => {
          const slot = document.querySelector(`[data-id="${id}"]`);
          if (slot) {
            const input = slot.querySelector("input");
            if (input) {
              // Сброс классов удара
              input.classList.remove("hit-red", "hit-green");
              // Можно ещё явно убрать рамку
              input.style.border = "1px solid transparent";
            }
          }
        });
      }
    }
  });
});

//Другое

whatelse.addEventListener("click", function () {
  mode = 6;
  disableBattleMode();
  // Сбрасываем активный класс у всех кнопок
  [classic, rand, frand, roul, whl, chl, whatelse].forEach((btn) => {
    btn.classList.remove("active-mode");
  });
  leaveWheelMode();

  // Добавляем активный класс на текущую
  this.classList.add("active-mode");
  tickSound.volume = 0;

  document.getElementById("center").style.display = "none";
  document.getElementById("wheelluck").style.display = "none";
  document.getElementById("roulette").style.display = "none";
  document.getElementById("last").style.display = "none";
  document.getElementById("center").style.visibility = "hidden";
  document.getElementById("challenges").style.display = "none";
  document.getElementById("downloadall").style.display = "inline-block";

  slotIds.forEach((id) => {
    const slot = document.querySelector(`[data-id="${id}"]`);
    if (slot) {
      const input = slot.querySelector("input");
      if (input) {
        input.style.border = "1px solid transparent";
      }
    }
  });
});


      //РЕЖИМ КЛАССИКИ + БОСС ФАЙТ + РАНДОМ С ЗАПРЕТАМИ



slotIds.forEach((id) => {
  const slot = document.querySelector(`[data-id="${id}"]`);
  if (slot) {
    const input = slot.querySelector("input");
    slot.addEventListener("dblclick", () => {
      const isClassicOrBoss = mode === 0 || mode === 1;
      const colorClass = isClassicOrBoss ? "hit-red" : getRandomInt(2) === 1 ? "hit-green" : "hit-red";

      if (input) {
        input.classList.remove("hit-red", "hit-green"); // сброс
        void input.offsetWidth; // хак для перезапуска анимации
        input.classList.add(colorClass);
      }
      if (colorClass === "hit-red") {
        bladeSound.currentTime = 0;
        bladeSound.play().catch((err) => console.log("play blocked:", err));
      } else if (colorClass === "hit-green") {
        reflectSound.currentTime = 0;
        reflectSound.play().catch((err) => console.log("play blocked:", err));
      }
    });
  }
});



      //БОСС ФАЙТ ФИНАЛЬНЫЙ БОЙ

      fight.addEventListener("click", function () {
        const left1 = document.querySelector("#lastfl input");
        const left2 = document.querySelector("#lastsl input");
        const right1 = document.querySelector("#lastfr input");
        const right2 = document.querySelector("#lastsr input");

        function applyResult(input, isWin) {
          input.classList.remove("hit-red", "hit-green");
          void input.offsetWidth; // перезапуск анимации
          if (isWin) {
            input.classList.add("hit-green");
            reflectSound.currentTime = 0;
            reflectSound.play().catch(() => {});
          } else {
            input.classList.add("hit-red");
            bladeSound.currentTime = 0;
            bladeSound.play().catch(() => {});
          }
        }

        // Левая пара
        const winl = getRandomInt(2);
        applyResult(left1, winl === 0);
        applyResult(left2, winl !== 0);

        // Правая пара
        const winr = getRandomInt(2);
        applyResult(right1, winr === 0);
        applyResult(right2, winr !== 0);
      });

      //ЧЕЛЛЕНДЖЫ

      let answersEN = {
        1: {
          name: "Pos6",
          description: "Forester. Stay and farm in the woods"
        },
        2: {
          name: "Sniper",
          description: "Don't use active skills"
        },
        3: {
          name: "Noground",
          description: "Character selection randomly by button"
        },
        4: {
          name: "Blind",
          description: "The game without the added build"
        },
        5: {
          name: "Homeless",
          description: "Don't buy anything in the game"
        },
        6: {
          name: "Venomancer",
          description: "Only play with things that give poison."
        },
        7: {
          name: "Farmy guy",
          description: "Buying stuff only for the team or the midas"
        },
        8: {
          name: "Peacefull",
          description: "Don't kill creeps"
        },
        9: {
          name: "The strongest",
          description: "You only buy things that give you strength"
        },
        10: {
          name: "The most agile",
          description: "You only buy things for agility"
        },
        11: {
          name: "The smartest",
          description: "You only buy things with intelligence"
        },
        12: {
          name: "Good everywhere.",
          description: "You only buy things that give you strength, agility and intelligence at once."
        },
        13: {
          name: "Dark Gay",
          description: "No regen items (all stats), regen only through the base"
        },
        14: {
          name: "Fruit lover",
          description: "Buying things only after you've collected 300 tangos."
        },
        15: {
          name: "Wood scientist",
          description: "Only sticks in the inventory"
        },
        16: {
          name: "AFK",
          description: "Play only through controlled creeps"
        },
        17: {
          name: "Chin Chon Chung",
          description: "Change the language to Chinese"
        },
        18: {
          name: "Jerk",
          description: "Always go only with another player(1000)"
        },
        19: {
          name: "Photographer",
          description: "Don't get involved in teamfights"
        },
        20: {
          name: "ZXC GHOUL",
          description: "Pause and write in chat after every death/kill"
        },
        21: {
          name: "Knowledgeable",
          description: "Write out a chat for every wrong(or not) action of the team"
        },
        22: {
          name: "Comeback of year",
          description: "Specially die three times at the beginning of the game and win."
        },
        23: {
          name: "Immortal",
          description: "Collect the mega cheese"
        },
        24: {
          name: "Where's the R button?",
          description: "Playing without the ultimate"
        },
        25: {
          name: "Moved out of my mom's house",
          description: "Do not approach the base further than t3(tp counts)"
        },
        26: {
          name: "Homemade",
          description: "Go no further than t2"
        },
        27: {
          name: "Hooskar player",
          description: "Kill roshan solo 3 times"
        },
        28: {
          name: "Fighter",
          description: "Don't defeat or break the towers."
        },
        29: {
          name: "How do you move the map?",
          description: "Move the map only through the map"
        },
        30: {
          name: "Numpad player",
          description: "Rebind item usage to the numpad"
        },
        31: {
          name: "My tp is canceled",
          description: "Move on the lines only through tp"
        },
        32: {
          name: "I don't have to",
          description: "Don't do lasthits"
        },
        33: {
          name: "Self-delivery",
          description: "Don't use a courier"
        },
        34: {
          name: "The Pacifist",
          description: "Win the game with 0 hero kills."
        },
        35: {
          name: "One Man Army",
          description: "Your team can only buy support items (wards, dust, smoke). You are the only core."
        },
        36: {
          name: "Role Reversal",
          description: "Play a hard carry hero as a hard support (position 5)."
        },
        37: {
          name: "The Collector",
          description: "Fill your inventory with 6 different types of boots."
        },
        38: {
          name: "Shrine Hog",
          description:
            "You can only regenerate health/mana using neutral items (no fountain, no consumables for regen)."
        },
        39: {
          name: "First Blood or Nothing",
          description: "You must get First Blood. If you don't, you can only buy consumables for the rest of the game."
        },
        40: {
          name: "The Tourist",
          description: "Visit all 4 corners of the map within the first 10 minutes."
        },
        41: {
          name: "No Boots Allowed",
          description: "Play the entire game without buying any kind of boots."
        },
        42: {
          name: "The Bodyguard",
          description:
            "Pick one allied hero at the start. Your sole mission is to protect them. If they die, you must die avenging them."
        },
        43: {
          name: "Ancient Whisperer",
          description: "You cannot attack enemy heroes until an enemy Ancient is exposed."
        },
        44: {
          name: "The Hoarder",
          description: "You cannot sell any items you buy."
        },
        45: {
          name: "Skill Shot Master",
          description: "You can only deal damage to heroes with skill shots. No right-clicks."
        },
        46: {
          name: "Random Skill Build",
          description: "Level up your skills in a random order (e.g., roll a dice for which skill to level)."
        },
        47: {
          name: "No Vision Quest",
          description: "You are not allowed to buy or place any observer or sentry wards."
        },
        48: {
          name: "The Acrobat",
          description: "You must use an item (Force Staff, Blink Dagger) off cooldown, even if it's into danger."
        },
        49: {
          name: "The Positional Player",
          description: "You can only buy items that grant bonus attack or cast range."
        },
        50: {
          name: "One Spell Wonder",
          description:
            "You are only allowed to level up and use your hero's first spell (Q). Other spells and ultimate remain unleveled."
        }
      };
      let answersRU = {
        1: {
          name: "Pos6",
          description: "Лесник"
        },
        2: {
          name: "Снайпер",
          description: "Не использовать скиллы"
        },
        3: {
          name: "Нограунд",
          description: "Выбор персонажа рандомно"
        },
        4: {
          name: "Вслепую",
          description: "Игра без добавленной сборки"
        },
        5: {
          name: "Бомж",
          description: "Не покупать ничего в игре"
        },
        6: {
          name: "Веномансер",
          description: "Играть только с вещами которые дают яд"
        },
        7: {
          name: "Фармила",
          description: "Покупаешь вещи только для тимы или мидасы"
        },
        8: {
          name: "Мирный",
          description: "Не убивать крипов"
        },
        9: {
          name: "Самый сильный",
          description: "Покупаешь вещи только на силу"
        },
        10: {
          name: "Самый ловкий",
          description: "Покупаешь вещи только на ловкость"
        },
        11: {
          name: "Самый умный",
          description: "Покупаешь вещи только на интеллект"
        },
        12: {
          name: "И в рот и в жопу",
          description: "Покупаешь вещи только которые дают и силу и ловкость и интелект сразу"
        },
        13: {
          name: "Геюга",
          description: "Без вещей на реген(всех показателей), реген только через базу"
        },
        14: {
          name: "Любитель фруктов",
          description: "Покупка вещей только после того как соберёшь 300 танго"
        },
        15: {
          name: "Древовед",
          description: "Только ветки в инвенторе"
        },
        16: {
          name: "Афк",
          description: "Игра только через подконтрольных крипов"
        },
        17: {
          name: "Шин чон чун",
          description: "Сменить язык на китайский"
        },
        18: {
          name: "Дрочер",
          description: "Всегда ходишь только с другим игроком(1000)"
        },
        19: {
          name: "Фотограф",
          description: "Не участвовать в тимфайтах"
        },
        20: {
          name: "ZXC GHOUL",
          description: "Ставить паузу и писать в чат после каждой смерти/кила"
        },
        21: {
          name: "Знающий",
          description: "Выписывать чат на каждое неправильное(или нет) действие тимы"
        },
        22: {
          name: "Камбек года",
          description: "Нафидить 3 смерти в начале катки и выиграть"
        },
        23: {
          name: "Бессмертный",
          description: "Собрать мега сыр"
        },
        24: {
          name: "Где кнопка R?",
          description: "Сыграть без ульты"
        },
        25: {
          name: "Съехал от мамы",
          description: "Не подходить к базе дальше т3(тп считается)"
        },
        26: {
          name: "Домашний",
          description: "Не заходить дальше т2"
        },
        27: {
          name: "Хусик с нулевой",
          description: "Убить рошана в соло 3 раза"
        },
        28: {
          name: "Файтер",
          description: "Не дефать и не ломать вышки"
        },
        29: {
          name: "Как двигать карту?",
          description: "Двигать карту только через карту"
        },
        30: {
          name: "Нумпад плеер",
          description: "Перебиндить использование предметов на нумпад"
        },
        31: {
          name: "Тп отменён",
          description: "Перемещаться по линиям только через тп"
        },
        32: {
          name: "А мне и не надо",
          description: "Не делать ластхиты"
        },
        33: {
          name: "Самовывоз",
          description: "Не использовать курьера"
        },
        34: {
          name: "Пацифист",
          description: "Выиграть игру с 0 убийств героев."
        },
        35: {
          name: "Армия Одного",
          description:
            "Ваша команда может покупать только предметы поддержки (варды, дасты, смоки). Вы единственный кор-герой."
        },
        36: {
          name: "Смена Ролей",
          description: "Играть за керри-героя как за саппорта пятой позиции."
        },
        37: {
          name: "Коллекционер",
          description: "Заполнить инвентарь 6 различными типами ботинок."
        },
        38: {
          name: "Фанат Святилищ",
          description:
            "Вы можете восстанавливать здоровье/ману только с помощью нейтралок (без фонтана, без расходников на реген)."
        },
        39: {
          name: "Первая Кровь или Ничего",
          description: "Вы должны сделать Первую Кровь. Если нет, до конца игры можете покупать только расходники."
        },
        40: {
          name: "Турист",
          description: "Посетить все 4 угла карты в течение первых 10 минут."
        },
        41: {
          name: "Без Ботинок",
          description: "Играть всю игру, не покупая никаких ботинок."
        },
        42: {
          name: "Телохранитель",
          description:
            "В начале выберите одного союзного героя. Ваша единственная миссия - защищать его. Если он умирает, вы должны умереть, мстя за него."
        },
        43: {
          name: "Шепчущий с Древним",
          description: "Вы не можете атаковать вражеских героев, пока не открыт вражеский Древний."
        },
        44: {
          name: "Плюшкин",
          description: "Вы не можете продавать ни один купленный предмет."
        },
        45: {
          name: "Мастер Скиллшотов",
          description: "Вы можете наносить урон героям только скиллами. Никаких авто-атак."
        },
        46: {
          name: "Случайная Прокачка",
          description:
            "Прокачивайте свои способности в случайном порядке (например, бросайте кубик, чтобы выбрать способность)."
        },
        47: {
          name: "Квест без Видения",
          description: "Вам запрещено покупать или ставить любые обсерверы или сентри варды."
        },
        48: {
          name: "Акробат",
          description:
            "Вы должны использовать предмет (Force Staff, Blink Dagger) сразу после отката его перезарядки, даже если это опасно."
        },
        49: {
          name: "Позиционный Игрок",
          description:
            "Вы можете покупать только предметы, которые дают бонус к дальности атаки или дальности применения способностей."
        },
        50: {
          name: "Чудо Одного Заклинания",
          description:
            "Вам разрешено прокачивать и использовать только первую способность вашего героя (Q). Остальные способности и ультимейт остаются непрокачанными."
        }
      };
      answer.addEventListener("click", () => {
        let n = getRandomInt(50);
        if (sBtn_text.innerHTML == "EN" || sBtn_text.innerHTML == "<h2> EN</h2>") {
          chex.innerHTML = answersEN[n].name;
          chex2.innerHTML = answersEN[n].description;
        } else {
          chex.innerHTML = answersRU[n].name;
          chex2.innerHTML = answersRU[n].description;
        }
      });

      //JSON
      const heroesEn = [
        {
          name: "antimage",
          id: 1,
          localized_name: "Anti-Mage"
        },
        {
          name: "axe",
          id: 2,
          localized_name: "Axe"
        },
        {
          name: "bane",
          id: 3,
          localized_name: "Bane"
        },
        {
          name: "bloodseeker",
          id: 4,
          localized_name: "Bloodseeker"
        },
        {
          name: "crystal_maiden",
          id: 5,
          localized_name: "Crystal Maiden"
        },
        {
          name: "drow_ranger",
          id: 6,
          localized_name: "Drow Ranger"
        },
        {
          name: "earthshaker",
          id: 7,
          localized_name: "Earthshaker"
        },
        {
          name: "juggernaut",
          id: 8,
          localized_name: "Juggernaut"
        },
        {
          name: "mirana",
          id: 9,
          localized_name: "Mirana"
        },
        {
          name: "nevermore",
          id: 11,
          localized_name: "Shadow Fiend"
        },
        {
          name: "morphling",
          id: 10,
          localized_name: "Morphling"
        },
        {
          name: "phantom_lancer",
          id: 12,
          localized_name: "Phantom Lancer"
        },
        {
          name: "puck",
          id: 13,
          localized_name: "Puck"
        },
        {
          name: "pudge",
          id: 14,
          localized_name: "Pudge"
        },
        {
          name: "razor",
          id: 15,
          localized_name: "Razor"
        },
        {
          name: "sand_king",
          id: 16,
          localized_name: "Sand King"
        },
        {
          name: "storm_spirit",
          id: 17,
          localized_name: "Storm Spirit"
        },
        {
          name: "sven",
          id: 18,
          localized_name: "Sven"
        },
        {
          name: "tiny",
          id: 19,
          localized_name: "Tiny"
        },
        {
          name: "vengefulspirit",
          id: 20,
          localized_name: "Vengeful Spirit"
        },
        {
          name: "windrunner",
          id: 21,
          localized_name: "Windranger"
        },
        {
          name: "zuus",
          id: 22,
          localized_name: "Zeus"
        },
        {
          name: "kunkka",
          id: 23,
          localized_name: "Kunkka"
        },
        {
          name: "lina",
          id: 25,
          localized_name: "Lina"
        },
        {
          name: "lich",
          id: 31,
          localized_name: "Lich"
        },
        {
          name: "lion",
          id: 26,
          localized_name: "Lion"
        },
        {
          name: "shadow_shaman",
          id: 27,
          localized_name: "Shadow Shaman"
        },
        {
          name: "slardar",
          id: 28,
          localized_name: "Slardar"
        },
        {
          name: "tidehunter",
          id: 29,
          localized_name: "Tidehunter"
        },
        {
          name: "witch_doctor",
          id: 30,
          localized_name: "Witch Doctor"
        },
        {
          name: "riki",
          id: 32,
          localized_name: "Riki"
        },
        {
          name: "enigma",
          id: 33,
          localized_name: "Enigma"
        },
        {
          name: "tinker",
          id: 34,
          localized_name: "Tinker"
        },
        {
          name: "sniper",
          id: 35,
          localized_name: "Sniper"
        },
        {
          name: "necrolyte",
          id: 36,
          localized_name: "Necrophos"
        },
        {
          name: "warlock",
          id: 37,
          localized_name: "Warlock"
        },
        {
          name: "beastmaster",
          id: 38,
          localized_name: "Beastmaster"
        },
        {
          name: "queenofpain",
          id: 39,
          localized_name: "Queen of Pain"
        },
        {
          name: "venomancer",
          id: 40,
          localized_name: "Venomancer"
        },
        {
          name: "faceless_void",
          id: 41,
          localized_name: "Faceless Void"
        },
        {
          name: "skeleton_king",
          id: 42,
          localized_name: "Skeleton King"
        },
        {
          name: "death_prophet",
          id: 43,
          localized_name: "Death Prophet"
        },
        {
          name: "phantom_assassin",
          id: 44,
          localized_name: "Phantom Assassin"
        },
        {
          name: "pugna",
          id: 45,
          localized_name: "Pugna"
        },
        {
          name: "templar_assassin",
          id: 46,
          localized_name: "Templar Assassin"
        },
        {
          name: "viper",
          id: 47,
          localized_name: "Viper"
        },
        {
          name: "luna",
          id: 48,
          localized_name: "Luna"
        },
        {
          name: "dragon_knight",
          id: 49,
          localized_name: "Dragon Knight"
        },
        {
          name: "dazzle",
          id: 50,
          localized_name: "Dazzle"
        },
        {
          name: "rattletrap",
          id: 51,
          localized_name: "Clockwerk"
        },
        {
          name: "leshrac",
          id: 52,
          localized_name: "Leshrac"
        },
        {
          name: "furion",
          id: 53,
          localized_name: "Nature's Prophet"
        },
        {
          name: "life_stealer",
          id: 54,
          localized_name: "Lifestealer"
        },
        {
          name: "dark_seer",
          id: 55,
          localized_name: "Dark Seer"
        },
        {
          name: "clinkz",
          id: 56,
          localized_name: "Clinkz"
        },
        {
          name: "omniknight",
          id: 57,
          localized_name: "Omniknight"
        },
        {
          name: "enchantress",
          id: 58,
          localized_name: "Enchantress"
        },
        {
          name: "huskar",
          id: 59,
          localized_name: "Huskar"
        },
        {
          name: "night_stalker",
          id: 60,
          localized_name: "Night Stalker"
        },
        {
          name: "broodmother",
          id: 61,
          localized_name: "Broodmother"
        },
        {
          name: "bounty_hunter",
          id: 62,
          localized_name: "Bounty Hunter"
        },
        {
          name: "weaver",
          id: 63,
          localized_name: "Weaver"
        },
        {
          name: "jakiro",
          id: 64,
          localized_name: "Jakiro"
        },
        {
          name: "batrider",
          id: 65,
          localized_name: "Batrider"
        },
        {
          name: "chen",
          id: 66,
          localized_name: "Chen"
        },
        {
          name: "spectre",
          id: 67,
          localized_name: "Spectre"
        },
        {
          name: "doom_bringer",
          id: 69,
          localized_name: "Doom"
        },
        {
          name: "ancient_apparition",
          id: 68,
          localized_name: "Ancient Apparition"
        },
        {
          name: "ursa",
          id: 70,
          localized_name: "Ursa"
        },
        {
          name: "spirit_breaker",
          id: 71,
          localized_name: "Spirit Breaker"
        },
        {
          name: "gyrocopter",
          id: 72,
          localized_name: "Gyrocopter"
        },
        {
          name: "alchemist",
          id: 73,
          localized_name: "Alchemist"
        },
        {
          name: "invoker",
          id: 74,
          localized_name: "Invoker"
        },
        {
          name: "silencer",
          id: 75,
          localized_name: "Silencer"
        },
        {
          name: "obsidian_destroyer",
          id: 76,
          localized_name: "Outworld Devourer"
        },
        {
          name: "lycan",
          id: 77,
          localized_name: "Lycanthrope"
        },
        {
          name: "brewmaster",
          id: 78,
          localized_name: "Brewmaster"
        },
        {
          name: "shadow_demon",
          id: 79,
          localized_name: "Shadow Demon"
        },
        {
          name: "lone_druid",
          id: 80,
          localized_name: "Lone Druid"
        },
        {
          name: "chaos_knight",
          id: 81,
          localized_name: "Chaos Knight"
        },
        {
          name: "meepo",
          id: 82,
          localized_name: "Meepo"
        },
        {
          name: "treant",
          id: 83,
          localized_name: "Treant Protector"
        },
        {
          name: "ogre_magi",
          id: 84,
          localized_name: "Ogre Magi"
        },
        {
          name: "undying",
          id: 85,
          localized_name: "Undying"
        },
        {
          name: "rubick",
          id: 86,
          localized_name: "Rubick"
        },
        {
          name: "disruptor",
          id: 87,
          localized_name: "Disruptor"
        },
        {
          name: "nyx_assassin",
          id: 88,
          localized_name: "Nyx Assassin"
        },
        {
          name: "naga_siren",
          id: 89,
          localized_name: "Naga Siren"
        },
        {
          name: "keeper_of_the_light",
          id: 90,
          localized_name: "Keeper of the Light"
        },
        {
          name: "wisp",
          id: 91,
          localized_name: "Wisp"
        },
        {
          name: "visage",
          id: 92,
          localized_name: "Visage"
        },
        {
          name: "slark",
          id: 93,
          localized_name: "Slark"
        },
        {
          name: "medusa",
          id: 94,
          localized_name: "Medusa"
        },
        {
          name: "troll_warlord",
          id: 95,
          localized_name: "Troll Warlord"
        },
        {
          name: "centaur",
          id: 96,
          localized_name: "Centaur Warrunner"
        },
        {
          name: "magnataur",
          id: 97,
          localized_name: "Magnus"
        },
        {
          name: "shredder",
          id: 98,
          localized_name: "Timbersaw"
        },
        {
          name: "bristleback",
          id: 99,
          localized_name: "Bristleback"
        },
        {
          name: "tusk",
          id: 100,
          localized_name: "Tusk"
        },
        {
          name: "skywrath_mage",
          id: 101,
          localized_name: "Skywrath Mage"
        },
        {
          name: "abaddon",
          id: 102,
          localized_name: "Abaddon"
        },
        {
          name: "elder_titan",
          id: 103,
          localized_name: "Elder Titan"
        },
        {
          name: "legion_commander",
          id: 104,
          localized_name: "Legion Commander"
        },
        {
          name: "ember_spirit",
          id: 106,
          localized_name: "Ember Spirit"
        },
        {
          name: "earth_spirit",
          id: 107,
          localized_name: "Earth Spirit"
        },
        {
          name: "abyssal_underlord",
          id: 108,
          localized_name: "Abyssal Underlord"
        },
        {
          name: "terrorblade",
          id: 109,
          localized_name: "Terrorblade"
        },
        {
          name: "phoenix",
          id: 110,
          localized_name: "Phoenix"
        },
        {
          name: "techies",
          id: 105,
          localized_name: "Techies"
        },
        {
          name: "oracle",
          id: 111,
          localized_name: "Oracle"
        },
        {
          name: "winter_wyvern",
          id: 112,
          localized_name: "Winter Wyvern"
        },
        {
          name: "arc_warden",
          id: 113,
          localized_name: "Arc Warden"
        },
        {
          name: "grimstroke",
          id: 121,
          localized_name: "Grimstroke"
        },
        {
          name: "hoodwink",
          id: 123,
          localized_name: "Hoodwink"
        },
        {
          name: "mars",
          id: 129,
          localized_name: "Mars"
        },
        {
          name: "monkey_king",
          id: 114,
          localized_name: "Monkey King"
        },
        {
          name: "dark_willow",
          id: 119,
          localized_name: "Dark Willow"
        },
        {
          name: "pangolier",
          id: 120,
          localized_name: "Pangolier"
        },
        {
          name: "snapfire",
          id: 128,
          localized_name: "Snapfire"
        },
        {
          name: "void_spirit",
          id: 126,
          localized_name: "Void Spirit"
        },
        {
          name: "kez",
          id: 130,
          localized_name: "Kez"
        },
        {
          name: "marci",
          id: 131,
          localized_name: "Marci"
        },
        {
          name: "dawnbreaker",
          id: 132,
          localized_name: "Dawnbreaker"
        },
        {
          name: "ringmaster",
          id: 133,
          localized_name: "Ringmaster"
        },
        {
          name: "muerta",
          id: 134,
          localized_name: "Muerta"
        },
        {
          name: "primal_beast",
          id: 135,
          localized_name: "Primal Beast"
        }
      ];
      
      // Массив с вариантами для подсказок
      const suggestions = heroesEn.map((hero) => hero.localized_name);

      //ПОДСКАЗКИ

      const createAutocomplete = (inputElement, datalistElement) => {
  inputElement.addEventListener("input", function () {
    datalistElement.innerHTML = "";
    const value = this.value.toLowerCase(); // приводим введённое к нижнему регистру

    suggestions.forEach((suggestion) => {
      if (suggestion.toLowerCase().startsWith(value)) { // приводим и вариант из списка
        const optionElement = document.createElement("option");
        optionElement.value = suggestion;
        datalistElement.appendChild(optionElement);
      }
    });
  });
};

      const applyAutocompleteToInput = (inputId, datalistId) => {
        const inputElement = document.getElementById(inputId);
        const datalistElement = document.getElementById(datalistId);

        createAutocomplete(inputElement, datalistElement);
      };

      applyAutocompleteToInput("inp1", "Datalist1l");
      applyAutocompleteToInput("inp2", "Datalist2l");
      applyAutocompleteToInput("inp3", "Datalist3l");
      applyAutocompleteToInput("inp4", "Datalist4l");
      applyAutocompleteToInput("inp5", "Datalist5l");
      applyAutocompleteToInput("inp6", "Datalist1r");
      applyAutocompleteToInput("inp7", "Datalist2r");
      applyAutocompleteToInput("inp8", "Datalist3r");
      applyAutocompleteToInput("inp9", "Datalist4r");
      applyAutocompleteToInput("inp10", "Datalist5r");
      applyAutocompleteToInput("inpfight", "Datalistfightl1");
      applyAutocompleteToInput("inpfight1", "Datalistfightl2");
      applyAutocompleteToInput("inpfight2", "Datalistfightr1");
      applyAutocompleteToInput("inpfight3", "Datalistfightr2");


          //рандомное число в другое

          const minInput = document.getElementById("minrandnumber");
          const maxInput = document.getElementById("maxrandnumber");
          const result = document.getElementById("resultrandnumber");
          const randBtn = document.getElementById("randnumberbutton");

          randnumberbutton.addEventListener("click", function () {
            const min = parseInt(minInput.value, 10);
            const max = parseInt(maxInput.value, 10);
            if (isNaN(min) || isNaN(max) || min > max) {
              if (sBtn_text.innerHTML == "EN" || sBtn_text.innerHTML == "<h2> EN</h2>") {
                result.textContent = "Please enter valid numbers";
              } else {
                result.textContent = "Введите корректные числа";
              }
              return;
            }
            const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            result.textContent = randomNum;
          });

      //кнопка помощи

      helpbutton.addEventListener("click", () => {
        if (sBtn_text.innerHTML == "EN" || sBtn_text.innerHTML == "<h2> EN</h2>") {
          switch (mode) {
            case 0:
              alert(
                "This is the standard mode. Write heroes' names in the left and right columns, then ban heroes by double-clicking on the button."
              );
              break;
            case 1:
              alert(
                "It's a bossfight mode, ban heroes until there are two left, then type them into the fight window and click the button. "
              );
              break;
            case 2:
              alert(
                "It's a randomized mode. Write heroes in the left and right columns, then dubclick the button. Green is victory. Red - ban."
              );
              break;
            case 3:
              alert("It's roulette mode, fill in the characters and twist");
              break;
            case 4:
              alert("It's wheel mode, fill in the characters and spin it");
              break;
            case 5:
              alert("It's challenge mode. Press the button and see what you get.");
              break;
            case 6:
              alert("Various scripts and other.");
              break;
            default:
              alert(
                "This is the standard mode. Write heroes' names in the left and right columns, then ban heroes by double-clicking on the button."
              );

              break;
          }
        } else {
          switch (mode) {
            case 0:
              alert(
                "Это стандартный режим. Напишите имена героев в левой и правой колонках, а затем запретите героев, дважды щелкнув по ним."
              );
              break;
            case 1:
              alert(
                "Это режим боя с боссом, запрещайте героев, пока не останется двое, затем введите их в окно боя и нажмите кнопку."
              );
              break;
            case 2:
              alert(
                "Это рандомный режим. Напишите героев в левой и правой колонках, а затем нажмите кнопку. Зеленый - победа. Красный - запрет."
              );
              break;
            case 3:
              alert("Это режим рулетки, заполняйте героев и крутите");
              break;
            case 4:
              alert("Это режим колеса, заполняйте героев и вращайте его.");
              break;
            case 5:
              alert("Это режим челленджей. Нажимайте на кнопку и смотрите, что вам выпадет.");
              break;
            case 6:
              alert("Различные скрипты и прочее.");
              break;
            default:
              alert(
                "Это стандартный режим. Напишите имена героев в левой и правой колонках, а затем запретите героев, дважды щелкнув по ним."
              );

              break;
          }
        }
      });

      //ВЫБОР ЯЗЫКА

      selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));

      options.forEach((option) => {
        option.addEventListener("click", () => {
          let selectedOption = option.querySelector(".option-text").innerText;
          sBtn_text.innerText = selectedOption;
          optionMenu.classList.remove("active");
          if (option_text.innerHTML == "RU") {
            option_text.innerHTML = "EN";
          } else {
            option_text.innerHTML = "RU";
          }
          if (sBtn_text.innerHTML == "RU") {
            classic.innerHTML = "Классический(По умолчанию)";
            rand.innerHTML = "Сражение";
            frand.innerHTML = "Рандом с выбором";
            roul.innerHTML = "Рулетка";
            whl.innerHTML = "Колесо удачи";
            chl.innerHTML = "Челленджы";
            whatelse.innerHTML = "Другое";
            fight.innerHTML = "БОЙ";
            answer.innerHTML = "Получить челлендж";
            download1.innerHTML = "Скачать";
            download2.innerHTML = "Скачать";
            scriptchl.innerHTML = "Скрипт рандомного нажатия клавиш";
            scriptmsg.innerHTML = "Скрипт рандомных предупреждений";
            roulchl.innerHTML = "Старт";
            whlchl.innerHTML = "Старт";
            document.getElementById("chex").innerHTML = "Твой Челлендж";
            document.getElementById("chex2").innerHTML = "Будет прямо ЗДЕСЬ";
            document.getElementById("inp1").placeholder = "Введите имя героя";
            document.getElementById("inp2").placeholder = "Введите имя героя";
            document.getElementById("inp3").placeholder = "Введите имя героя";
            document.getElementById("inp4").placeholder = "Введите имя героя";
            document.getElementById("inp5").placeholder = "Введите имя героя";
            document.getElementById("inp6").placeholder = "Введите имя героя";
            document.getElementById("inp7").placeholder = "Введите имя героя";
            document.getElementById("inp8").placeholder = "Введите имя героя";
            document.getElementById("inp9").placeholder = "Введите имя героя";
            document.getElementById("inp10").placeholder = "Введите имя героя";
            document.getElementById("inpfight").placeholder = "Введите имя героя";
            document.getElementById("inpfight1").placeholder = "Введите имя героя";
            document.getElementById("inpfight2").placeholder = "Введите имя героя";
            document.getElementById("inpfight3").placeholder = "Введите имя героя";
            document.getElementById("minrandnumber").placeholder = "Мин.";
            document.getElementById("maxrandnumber").placeholder = "Макс."; 
            randnumberbutton.innerHTML = "Готово";
          }
          if (sBtn_text.innerHTML == "EN" || sBtn_text.innerHTML == "<h2> EN</h2>") {
            classic.innerHTML = "Classic(defolt)";
            rand.innerHTML = "Boss fight";
            frand.innerHTML = "Random";
            roul.innerHTML = "Roulette";
            whl.innerHTML = "Wheel of luck";
            chl.innerHTML = "Challenges";
            whatelse.innerHTML = "Other";
            fight.innerHTML = "FIGHT";
            answer.innerHTML = "GET CHALLENGE";
            download1.innerHTML = "Download";
            download2.innerHTML = "Download";
            scriptchl.innerHTML = "Random keystroke script";
            scriptmsg.innerHTML = "Random alert script";
            roulchl.innerHTML = "Start";
            whlchl.innerHTML = "Start";
            document.getElementById("chex").innerHTML = "Your Challenge";
            document.getElementById("chex2").innerHTML = "Will be right HERE";
            document.getElementById("inp1").placeholder = "Hero";
            document.getElementById("inp2").placeholder = "Hero";
            document.getElementById("inp3").placeholder = "Hero";
            document.getElementById("inp4").placeholder = "Hero";
            document.getElementById("inp5").placeholder = "Hero";
            document.getElementById("inp6").placeholder = "Hero";
            document.getElementById("inp7").placeholder = "Hero";
            document.getElementById("inp8").placeholder = "Hero";
            document.getElementById("inp9").placeholder = "Hero";
            document.getElementById("inp10").placeholder = "Hero";
            document.getElementById("inpfight").placeholder = "Hero";
            document.getElementById("inpfight1").placeholder = "Hero";
            document.getElementById("inpfight2").placeholder = "Hero";
            document.getElementById("inpfight3").placeholder = "Hero";
            document.getElementById("minrandnumber").placeholder = "Min";
            document.getElementById("maxrandnumber").placeholder = "Max";
            randnumberbutton.innerHTML = "Check";
          }
        });
      });

//Пасхалка

// Пасхалка: 5 кликов по логотипу DOTAFUN
let easterClickCount = 0;
let easterTimeout;

const logo = document.querySelector(".logo-title");

logo.addEventListener("click", () => {
  easterClickCount++;

  // сбросить счётчик, если пауза между кликами > 2 сек
  clearTimeout(easterTimeout);
  easterTimeout = setTimeout(() => {
    easterClickCount = 0;
  }, 200);

  if (easterClickCount >= 5) {
    easterClickCount = 0;
    activateEasterEgg(); // твоя функция пасхалки
  }
});

let chaosActive = false;
function activateEasterEgg() {
  chaosActive = !chaosActive;
  if (chaosActive) {
    document.body.classList.add("chaos-mode");
    

  console.log("🥚 Пасхалка активирована!");
              prizes[0].color = "hsl(0,100%,27.3%)";
              prizes[1].color = "hsl(0,0%,0%)";
              prizes[2].color = "hsl(0,100%,27.3%)";
              prizes[3].color = "hsl(0,0%,0%)";
              prizes[4].color = "hsl(0,100%,27.3%)";
              prizes[5].color = "hsl(0,0%,0%)";
              prizes[6].color = "hsl(0,100%,27.3%)";
              prizes[7].color = "hsl(0,0%,0%)";
              prizes[8].color = "hsl(120,100%,25.1%)";
              prizes[9].color = "hsl(0,0%,0%)";
      
            document.getElementById("wheelluck").style.color = "white";

              setupWheel();
  
            classic.innerHTML = "WHY";
            rand.innerHTML = "ARE";
            frand.innerHTML = "YOU";
            roul.innerHTML = "CLICKING";
            whl.innerHTML = "@#!#$#@!@$@!";
            chl.innerHTML = "@#!#$#@!@$@!";
            whatelse.innerHTML = "@#!#$#@!@$@!";
            fight.innerHTML = "@#!#$#@!@$@!";
            answer.innerHTML = "@#!#$#@!@$@!";
            download1.innerHTML = "@#!#$#@!@$@!";
            download2.innerHTML = "@#!#$#@!@$@!";
            scriptchl.innerHTML = "@#!#$#@!@$@!";
            scriptmsg.innerHTML = "@#!#$#@!@$@!";
            roulchl.innerHTML = "@#!#$#@!@$@!";
            whlchl.innerHTML = "@#!#$#@!@$@!";
            document.getElementById("chex").innerHTML = "@#!#$#@!@$@!";
            document.getElementById("chex2").innerHTML = "@#!#$#@!@$@!";
            document.getElementById("inp1").placeholder = "@#!#$#@!@$@!";
            document.getElementById("inp2").placeholder = "@#!#$#@!@$@!";
            document.getElementById("inp3").placeholder = "@#!#$#@!@$@!";
            document.getElementById("inp4").placeholder = "@#!#$#@!@$@!";
            document.getElementById("inp5").placeholder = "@#!#$#@!@$@!";
            document.getElementById("inp6").placeholder = "@#!#$#@!@$@!";
            document.getElementById("inp7").placeholder = "@#!#$#@!@$@!";
            document.getElementById("inp8").placeholder = "@#!#$#@!@$@!";
            document.getElementById("inp9").placeholder = "@#!#$#@!@$@!";
            document.getElementById("inp10").placeholder = "@#!#$#@!@$@!";
            document.getElementById("inpfight").placeholder = "@#!#$#@!@$@!";
            document.getElementById("inpfight1").placeholder = "@#!#$#@!@$@!";
            document.getElementById("inpfight2").placeholder = "@#!#$#@!@$@!";
            document.getElementById("inpfight3").placeholder = "@#!#$#@!@$@!";
            document.getElementById("minrandnumber").placeholder = "@#!#$#@!@$@!";
            document.getElementById("maxrandnumber").placeholder = "@#!#$#@!@$@!";
            randnumberbutton.innerHTML = "@#!#$#@!@$@!";
  
  
            // Добавить класс
document.body.classList.add("chaos-mode");

// Убрать класс
document.body.classList.remove("chaos-mode");

// Переключать (toggle) — если класса нет, добавит; если есть, уберёт
document.body.classList.toggle("chaos-mode");


chaosSound.play();

}else {
    document.body.classList.remove("chaos-mode");
              prizes[0].color = "hsl(210, 60%, 60%)";
              prizes[1].color = "hsl(160, 55%, 55%)";
              prizes[2].color = "hsl(45, 85%, 65%)";
              prizes[3].color = "hsl(25, 70%, 60%)";
              prizes[4].color = "hsl(0, 70%, 60%)";
              prizes[5].color = "hsl(340, 60%, 65%)";
              prizes[6].color = "hsl(95, 45%, 55%)";
              prizes[7].color = "hsl(200, 40%, 70%)";
              prizes[8].color = "hsl(280, 45%, 65%)";
              prizes[9].color = "hsl(180, 30%, 60%)";
    setupWheel(); // вернуть нормальные цвета
    chaosSound.pause();
    chaosSound.currentTime = 0;
   if (sBtn_text.innerHTML == "RU") {
            classic.innerHTML = "Классический(По умолчанию)";
            rand.innerHTML = "Сражение";
            frand.innerHTML = "Рандом с выбором";
            roul.innerHTML = "Рулетка";
            whl.innerHTML = "Колесо удачи";
            chl.innerHTML = "Челленджы";
            whatelse.innerHTML = "Другое";
            fight.innerHTML = "БОЙ";
            answer.innerHTML = "Получить челлендж";
            download1.innerHTML = "Скачать";
            download2.innerHTML = "Скачать";
            scriptchl.innerHTML = "Скрипт рандомного нажатия клавиш";
            scriptmsg.innerHTML = "Скрипт рандомных предупреждений";
            roulchl.innerHTML = "Старт";
            whlchl.innerHTML = "Старт";
            document.getElementById("chex").innerHTML = "Твой Челлендж";
            document.getElementById("chex2").innerHTML = "Будет прямо ЗДЕСЬ";
            document.getElementById("inp1").placeholder = "Введите имя героя";
            document.getElementById("inp2").placeholder = "Введите имя героя";
            document.getElementById("inp3").placeholder = "Введите имя героя";
            document.getElementById("inp4").placeholder = "Введите имя героя";
            document.getElementById("inp5").placeholder = "Введите имя героя";
            document.getElementById("inp6").placeholder = "Введите имя героя";
            document.getElementById("inp7").placeholder = "Введите имя героя";
            document.getElementById("inp8").placeholder = "Введите имя героя";
            document.getElementById("inp9").placeholder = "Введите имя героя";
            document.getElementById("inp10").placeholder = "Введите имя героя";
            document.getElementById("inpfight").placeholder = "Введите имя героя";
            document.getElementById("inpfight1").placeholder = "Введите имя героя";
            document.getElementById("inpfight2").placeholder = "Введите имя героя";
            document.getElementById("inpfight3").placeholder = "Введите имя героя";
            document.getElementById("minrandnumber").placeholder = "Мин.";
            document.getElementById("maxrandnumber").placeholder = "Макс."; 
            randnumberbutton.innerHTML = "Готово";
          }
          if (sBtn_text.innerHTML == "EN" || sBtn_text.innerHTML == "<h2> EN</h2>") {
            classic.innerHTML = "Classic(defolt)";
            rand.innerHTML = "Boss fight";
            frand.innerHTML = "Random";
            roul.innerHTML = "Roulette";
            whl.innerHTML = "Wheel of luck";
            chl.innerHTML = "Challenges";
            whatelse.innerHTML = "Other";
            fight.innerHTML = "FIGHT";
            answer.innerHTML = "GET CHALLENGE";
            download1.innerHTML = "Download";
            download2.innerHTML = "Download";
            scriptchl.innerHTML = "Random keystroke script";
            scriptmsg.innerHTML = "Random alert script";
            roulchl.innerHTML = "Start";
            whlchl.innerHTML = "Start";
            document.getElementById("chex").innerHTML = "Your Challenge";
            document.getElementById("chex2").innerHTML = "Will be right HERE";
            document.getElementById("inp1").placeholder = "Hero";
            document.getElementById("inp2").placeholder = "Hero";
            document.getElementById("inp3").placeholder = "Hero";
            document.getElementById("inp4").placeholder = "Hero";
            document.getElementById("inp5").placeholder = "Hero";
            document.getElementById("inp6").placeholder = "Hero";
            document.getElementById("inp7").placeholder = "Hero";
            document.getElementById("inp8").placeholder = "Hero";
            document.getElementById("inp9").placeholder = "Hero";
            document.getElementById("inp10").placeholder = "Hero";
            document.getElementById("inpfight").placeholder = "Hero";
            document.getElementById("inpfight1").placeholder = "Hero";
            document.getElementById("inpfight2").placeholder = "Hero";
            document.getElementById("inpfight3").placeholder = "Hero";
            document.getElementById("minrandnumber").placeholder = "Min";
            document.getElementById("maxrandnumber").placeholder = "Max";
            randnumberbutton.innerHTML = "Check";
          }
  }
}