/* Authored examples. No live AI output or external requests. */
(() => {
  const content = {
  "en": {
    "scenarios": {
      "startup": {
        "question": "Who will pay for our app?",
        "proposal": [
          "Start with solo creators. A single person can try the entire workflow.",
          "Explore small video agencies: test one recurring client job.",
          "Show the same prototype to three customer groups before choosing.",
          "Ask what the current editing process costs, including human review.",
          "Look for a weekly task that gives customers a reason to return."
        ],
        "revision": [
          "Keep creators as the alternative. First test the agency workflow with real footage.",
          "Make one clip from a client video. Measure editing and approval time.",
          "Compare observed use with what people said in interviews.",
          "Offer a paid pilot with a clear deliverable. Record every manual correction.",
          "Run a second job with the same team to test repeat demand."
        ],
        "title": "Start with small video agencies.",
        "brief": "Test one recurring client workflow: turn a long video into one approved clip. Validate time saved and willingness to pay before building the full app.",
        "open": "Will a team pay again after the first pilot, once review time is included?",
        "cinema": {
          "context": "Example: an app that turns long videos into short clips.",
          "research": [
            {
              "title": "Three possible customers.",
              "text": "Illustrative brief: compare solo creators, small video agencies, and in-house teams. These are hypotheses to test, not market findings."
            },
            {
              "title": "Find the missing evidence.",
              "text": "Ask each group about their last editing job, their current workaround, and who can approve a paid trial."
            }
          ],
          "candidates": [
            {
              "name": "Solo creators",
              "signal": "One person, one workflow",
              "risk": "Repeat payment is unproven",
              "status": "Keep as an alternative"
            },
            {
              "name": "Video agencies",
              "signal": "A client job to test",
              "risk": "Review time may erase the gain",
              "status": "Test this first"
            },
            {
              "name": "In-house teams",
              "signal": "A workflow with stakeholders",
              "risk": "Need access to the decision maker",
              "status": "Revisit with evidence"
            }
          ],
          "criteria": [
            "First test",
            "What to measure",
            "Open question"
          ],
          "rows": [
            [
              "One creator’s video",
              "Time to publish",
              "Will they return?"
            ],
            [
              "One real client job",
              "Editing + review time",
              "Will the team pay again?"
            ],
            [
              "One team’s campaign",
              "Approval time",
              "Who can approve a pilot?"
            ]
          ],
          "selected": 1,
          "reason": "A concrete job gives us a way to test the full workflow, including review.",
          "next": "Invite five small agencies to a paid test using their own footage.",
          "alternate": "Keep solo creators as the next segment to test."
        }
      },
      "product": {
        "question": "Should our app be free?",
        "proposal": [
          "Offer a useful free first experience with a clearly explained limit.",
          "Separate the cost of reading a saved result from the cost of a new AI run.",
          "A free example can make the product understandable before a purchase.",
          "An unlimited promise creates an unpredictable bill for a small team.",
          "A paid option needs a clear benefit beyond access to the same sample."
        ],
        "revision": [
          "Show the available budget before a new discussion begins.",
          "Give paid users a defined monthly budget, with separate extra usage.",
          "Use free examples for discovery, and measure conversion on live discussions later.",
          "Test a monthly plan before committing to an annual price.",
          "Explain limits plainly and adjust proposed plans before accepting payments."
        ],
        "title": "Start free. Keep usage bounded.",
        "brief": "Make the sample experience free. Test a paid monthly budget when live models are connected, using actual usage and cost data to set the limits.",
        "open": "How much usage people need, what it costs, and what they will pay for it.",
        "cinema": {
          "context": "Example: pricing a product with a cost for every live AI run.",
          "research": [
            {
              "title": "Three ways to charge.",
              "text": "Illustrative options: free access, a defined monthly budget, or usage-based payment."
            },
            {
              "title": "Start with the unknowns.",
              "text": "Measure the cost of complete discussions and observe how often people return before setting a paid limit."
            }
          ],
          "candidates": [
            {
              "name": "All free",
              "signal": "Simple to try",
              "risk": "No revenue to cover live runs",
              "status": "Use for scripted examples"
            },
            {
              "name": "Monthly budget",
              "signal": "A defined allowance",
              "risk": "The allowance needs real cost data",
              "status": "Test this first"
            },
            {
              "name": "Pay per run",
              "signal": "Usage is visible",
              "risk": "The price may interrupt exploration",
              "status": "Keep as an alternative"
            }
          ],
          "criteria": [
            "First test",
            "What to measure",
            "Open question"
          ],
          "rows": [
            [
              "A scripted example",
              "Understanding",
              "Will they want live runs?"
            ],
            [
              "A bounded paid pilot",
              "Usage + cost",
              "What budget is useful?"
            ],
            [
              "One paid discussion",
              "Repeat purchases",
              "Does the price cause friction?"
            ]
          ],
          "selected": 1,
          "reason": "A monthly budget gives a clear limit while leaving room for repeated use.",
          "next": "Measure real usage and cost in a bounded pilot before selling a plan.",
          "alternate": "Keep pay-per-run as an option for occasional users."
        }
      },
      "engineering": {
        "question": "Should we rewrite our app?",
        "proposal": [
          "First name the problem the rewrite is supposed to solve.",
          "Clear internal boundaries may solve the immediate issue without splitting deployment.",
          "Look at the actual bottleneck: release speed, reliability, or uneven load.",
          "Several services introduce more operational work for a small team.",
          "An isolated component could be a useful first experiment if it has a clear owner."
        ],
        "revision": [
          "Write down the constraint and what improvement would justify the change.",
          "Improve one internal boundary, then consider extraction only where it helps.",
          "Compare a small change with the current release and reliability measures.",
          "Budget for operating the component, not only for building it.",
          "Choose one reversible experiment with a named owner and a clear stopping point."
        ],
        "title": "Fix the constraint. Test one boundary.",
        "brief": "Define the concrete bottleneck and try a small, reversible change. Use the result to decide whether extracting one service would help the team.",
        "open": "Which measured constraint, if any, requires an independently deployed service.",
        "cinema": {
          "context": "Example: a small team wants to improve an existing app.",
          "research": [
            {
              "title": "Three routes forward.",
              "text": "Illustrative options: a complete rewrite, a clearer internal module, or one separate service."
            },
            {
              "title": "Name the actual constraint.",
              "text": "Use release time, reliability, and operating effort to compare a small change against the current system."
            }
          ],
          "candidates": [
            {
              "name": "Full rewrite",
              "signal": "A fresh architecture",
              "risk": "A large change before evidence",
              "status": "Not the first experiment"
            },
            {
              "name": "One module",
              "signal": "A reversible boundary",
              "risk": "May not solve a deployment issue",
              "status": "Test this first"
            },
            {
              "name": "One service",
              "signal": "Independent deployment",
              "risk": "Monitoring and operation work",
              "status": "Revisit with evidence"
            }
          ],
          "criteria": [
            "First test",
            "What to measure",
            "Open question"
          ],
          "rows": [
            [
              "A scoped prototype",
              "Migration effort",
              "What requires a rewrite?"
            ],
            [
              "One clearer boundary",
              "Release time + reliability",
              "Does the constraint improve?"
            ],
            [
              "One isolated component",
              "Operating effort",
              "Does isolation justify its cost?"
            ]
          ],
          "selected": 1,
          "reason": "A reversible change provides evidence before committing to a larger migration.",
          "next": "Choose one boundary, name its owner, and compare before and after.",
          "alternate": "Extract a service only if the measured constraint calls for it."
        }
      }
    },
    "scripts": {
      "startup": {
        "ideas": [
          "One creator. One workflow.",
          "A recurring client job.",
          "Compare three audiences.",
          "Include the review cost.",
          "Give them a reason to return."
        ],
        "challengeHeads": [
          "Who will pay again?",
          "Recurring, but is it urgent?",
          "Interest is not a purchase.",
          "What about manual corrections?",
          "Why change their workflow?"
        ],
        "challenges": [
          "A solo creator can try it quickly. But what brings them back for a second paid job?",
          "Agencies may repeat the task. Is it painful enough to change the way they work?",
          "Three groups liking a demo does not tell us which one will pay. What will we observe?",
          "A fast first draft is useful. How much time will people spend fixing and approving it?",
          "A weekly task already has a workflow. What would make a customer switch to ours?"
        ],
        "revisions": [
          "Keep a second market open.",
          "Measure the complete job.",
          "Watch use, then ask for payment.",
          "Count every manual correction.",
          "Win the second job."
        ],
        "direction": "Choose a testable first customer, then earn the second paid job."
      },
      "product": {
        "ideas": [
          "A useful free first try",
          "Charge for new runs",
          "Make the value visible",
          "Set a predictable limit",
          "Make paid value clear"
        ],
        "challengeHeads": [
          "Will the limit surprise people?",
          "Does every run cost the same?",
          "Interest, or willingness to pay?",
          "What happens at the limit?",
          "What makes paid worthwhile?"
        ],
        "revisions": [
          "Show the budget first",
          "A monthly allowance",
          "Free examples for discovery",
          "Monthly before annual",
          "Test limits before selling"
        ],
        "challenges": [
          "A free limit can work, but will people know the allowance before starting a discussion?",
          "Counting runs alone may be misleading. How do we account for a much longer conversation?",
          "A compelling free sample shows interest. Does it tell us whether someone will pay?",
          "A defined limit controls cost. What happens when a customer needs one more discussion?",
          "The paid benefit is still a promise. What real usage would justify that promise?"
        ],
        "direction": "Make the first experience free. Bound the cost."
      },
      "engineering": {
        "ideas": [
          "Name the constraint",
          "Start with clear boundaries",
          "Find the bottleneck",
          "Include operating costs",
          "Try one small extraction"
        ],
        "challengeHeads": [
          "What would justify a rewrite?",
          "Do we need a separate service?",
          "Architecture, or process?",
          "Who will operate it?",
          "Can we roll it back?"
        ],
        "revisions": [
          "Define success first",
          "Improve one boundary",
          "Measure a small change",
          "Budget for operations",
          "Keep the experiment reversible"
        ],
        "challenges": [
          "Naming the problem is a start. What improvement would justify changing the architecture?",
          "How will we know a clearer internal boundary solves the problem without a separate service?",
          "Is that bottleneck caused by the architecture or by the way the team works?",
          "Can we measure the monitoring and debugging work before committing to several services?",
          "How will the team roll back the extraction if the experiment makes delivery slower?"
        ],
        "direction": "Solve a measured problem. Keep the change small."
      }
    }
  },
  "ru": {
    "scenarios": {
      "startup": {
        "question": "Кто будет платить за наше приложение?",
        "proposal": [
          "Начать с авторов контента. Один человек может попробовать весь процесс.",
          "Проверить небольшие видеоагентства: взять одну регулярную задачу клиента.",
          "Показать один прототип трём группам клиентов, прежде чем выбирать.",
          "Узнать стоимость текущего монтажа, включая ручную проверку.",
          "Найти еженедельную задачу, ради которой клиент вернётся."
        ],
        "revision": [
          "Оставить авторов как альтернативу. Сначала проверить задачу агентства на реальном видео.",
          "Сделать один клип из видео клиента. Измерить время монтажа и согласования.",
          "Сравнить реальное использование с обещаниями на интервью.",
          "Предложить платный пилот с ясным результатом. Учесть каждую ручную правку.",
          "Выполнить вторую задачу с той же командой, чтобы проверить повторный спрос."
        ],
        "title": "Начать с небольших видеоагентств.",
        "brief": "Проверить одну регулярную задачу: превратить длинное видео в согласованный клип. Измерить экономию времени и готовность платить до разработки всего приложения.",
        "open": "Заплатит ли команда снова, если учесть время на проверку и правки?",
        "cinema": {
          "context": "Пример: приложение превращает длинные видео в короткие клипы.",
          "research": [
            {
              "title": "Три возможных клиента.",
              "text": "Условный бриф: сравнить авторов, небольшие видеоагентства и команды внутри компаний. Это гипотезы для проверки, а не результаты исследования рынка."
            },
            {
              "title": "Каких данных не хватает?",
              "text": "Узнать у каждой группы о последней задаче монтажа, текущем решении и о том, кто может согласовать платную пробу."
            }
          ],
          "candidates": [
            {
              "name": "Авторы контента",
              "signal": "Один человек, одна задача",
              "risk": "Повторная оплата не проверена",
              "status": "Оставить как альтернативу"
            },
            {
              "name": "Видеоагентства",
              "signal": "Задача клиента для проверки",
              "risk": "Правки могут съесть экономию",
              "status": "Проверить первыми"
            },
            {
              "name": "Команды компаний",
              "signal": "Процесс с несколькими участниками",
              "risk": "Нужен доступ к тому, кто решает",
              "status": "Вернуться с данными"
            }
          ],
          "criteria": [
            "Первый тест",
            "Что измерить",
            "Открытый вопрос"
          ],
          "rows": [
            [
              "Одно видео автора",
              "Время до публикации",
              "Вернётся ли автор?"
            ],
            [
              "Одна задача клиента",
              "Монтаж + проверка",
              "Заплатит ли команда снова?"
            ],
            [
              "Одна кампания",
              "Время согласования",
              "Кто одобрит пилот?"
            ]
          ],
          "selected": 1,
          "reason": "На конкретной задаче можно проверить весь процесс, включая правки.",
          "next": "Пригласить пять небольших агентств на платный тест с их видео.",
          "alternate": "Оставить авторов следующим сегментом для проверки."
        }
      },
      "product": {
        "question": "Сделать приложение бесплатным?",
        "proposal": [
          "Дать полезный первый опыт бесплатно и заранее объяснить ограничение.",
          "Разделить чтение сохранённого результата и запуск нового AI-обсуждения: затраты у них разные.",
          "Бесплатный пример поможет понять продукт до покупки.",
          "Обещание безлимита делает расходы небольшой команды непредсказуемыми.",
          "Платный тариф должен давать понятную ценность сверх доступа к тому же примеру."
        ],
        "revision": [
          "Показывать доступный бюджет до начала обсуждения.",
          "Дать платному тарифу месячный лимит и отдельную оплату дополнительного использования.",
          "Использовать бесплатные примеры для знакомства, а готовность платить проверять на живых обсуждениях.",
          "Проверить месячный тариф до фиксации годовой цены.",
          "Объяснить ограничения простыми словами и проверить тарифы до приёма платежей."
        ],
        "title": "Начать бесплатно. Ограничить расходы.",
        "brief": "Оставить демонстрацию бесплатной. После подключения моделей проверить месячный тариф с лимитом, рассчитанным по реальному использованию и затратам.",
        "open": "Какой объём обсуждений нужен людям, сколько он стоит и за что они готовы платить.",
        "cinema": {
          "context": "Пример: тариф для продукта, в котором каждый AI-запуск стоит денег.",
          "research": [
            {
              "title": "Три модели оплаты.",
              "text": "Условные варианты: бесплатный доступ, месячный бюджет или оплата за использование."
            },
            {
              "title": "Начать с неизвестного.",
              "text": "Измерить стоимость полных обсуждений и частоту возвращения пользователей, прежде чем устанавливать платный лимит."
            }
          ],
          "candidates": [
            {
              "name": "Всё бесплатно",
              "signal": "Легко попробовать",
              "risk": "Нет выручки для оплаты запусков",
              "status": "Для готовых примеров"
            },
            {
              "name": "Месячный бюджет",
              "signal": "Понятный объём использования",
              "risk": "Лимит требует данных о затратах",
              "status": "Проверить первыми"
            },
            {
              "name": "За каждый запуск",
              "signal": "Расходы видны сразу",
              "risk": "Цена может мешать знакомству",
              "status": "Оставить как альтернативу"
            }
          ],
          "criteria": [
            "Первый тест",
            "Что измерить",
            "Открытый вопрос"
          ],
          "rows": [
            [
              "Готовый пример",
              "Понимание продукта",
              "Нужны ли живые запуски?"
            ],
            [
              "Ограниченный пилот",
              "Использование + затраты",
              "Какой бюджет удобен?"
            ],
            [
              "Одно платное обсуждение",
              "Повторные покупки",
              "Мешает ли цена?"
            ]
          ],
          "selected": 1,
          "reason": "Месячный бюджет задаёт понятный предел и оставляет место для повторного использования.",
          "next": "Измерить использование и затраты в пилоте до продажи подписки.",
          "alternate": "Сохранить оплату за запуск для редкого использования."
        }
      },
      "engineering": {
        "question": "Нужно ли переписывать приложение?",
        "proposal": [
          "Сначала назвать конкретную проблему, которую должна решить смена архитектуры.",
          "Чёткие границы модулей могут решить ближайшую проблему без отдельных сервисов.",
          "Найти реальное ограничение: скорость релизов, надёжность или неравномерную нагрузку.",
          "Несколько сервисов добавят небольшой команде работы по эксплуатации.",
          "Один изолированный компонент с ответственным за него может стать первым экспериментом."
        ],
        "revision": [
          "Зафиксировать ограничение и улучшение, ради которого стоит менять архитектуру.",
          "Улучшить границу одного модуля. Выделять сервис, только если это помогает.",
          "Сопоставить небольшое изменение с текущими показателями релизов и надёжности.",
          "Учесть затраты на эксплуатацию компонента, а не только на его разработку.",
          "Выбрать обратимый эксперимент с ответственным и понятным условием остановки."
        ],
        "title": "Найти ограничение. Проверить один модуль.",
        "brief": "Описать узкое место и проверить небольшое обратимое изменение. По результату решить, поможет ли выделение одного сервиса.",
        "open": "Какое измеримое ограничение действительно требует отдельно развёртываемого сервиса.",
        "cinema": {
          "context": "Пример: небольшая команда хочет улучшить своё приложение.",
          "research": [
            {
              "title": "Три пути развития.",
              "text": "Условные варианты: переписать всё, улучшить один модуль или выделить отдельный сервис."
            },
            {
              "title": "Найти реальное ограничение.",
              "text": "Сравнить небольшое изменение с текущим состоянием по скорости выпуска, надёжности и затратам на поддержку."
            }
          ],
          "candidates": [
            {
              "name": "Переписать всё",
              "signal": "Новая архитектура",
              "risk": "Большие изменения без проверки",
              "status": "Не первый эксперимент"
            },
            {
              "name": "Один модуль",
              "signal": "Обратимое изменение",
              "risk": "Может не решить проблему выпуска",
              "status": "Проверить первыми"
            },
            {
              "name": "Один сервис",
              "signal": "Независимый выпуск",
              "risk": "Нужны мониторинг и поддержка",
              "status": "Вернуться с данными"
            }
          ],
          "criteria": [
            "Первый тест",
            "Что измерить",
            "Открытый вопрос"
          ],
          "rows": [
            [
              "Небольшой прототип",
              "Объём миграции",
              "Что требует переписывания?"
            ],
            [
              "Одна чёткая граница",
              "Скорость + надёжность",
              "Снято ли ограничение?"
            ],
            [
              "Отдельный компонент",
              "Затраты на поддержку",
              "Окупается ли изоляция?"
            ]
          ],
          "selected": 1,
          "reason": "Обратимое изменение даст данные до перехода к большой миграции.",
          "next": "Выбрать один модуль, назначить ответственного и сравнить до и после.",
          "alternate": "Выделять сервис, если измеренное ограничение этого потребует."
        }
      }
    },
    "scripts": {
      "startup": {
        "ideas": [
          "Один автор. Одна задача.",
          "Регулярная задача клиента.",
          "Сравнить три аудитории.",
          "Учесть стоимость проверки.",
          "Дать повод вернуться."
        ],
        "challengeHeads": [
          "Кто заплатит повторно?",
          "Регулярно — значит срочно?",
          "Интерес ещё не покупка.",
          "А сколько ручных правок?",
          "Зачем менять привычный процесс?"
        ],
        "challenges": [
          "Автор может быстро попробовать продукт. Но почему он вернётся за второй платной задачей?",
          "Агентства могут делать это регулярно. Достаточно ли задача болезненна, чтобы менять привычный процесс?",
          "Трём группам понравилось демо. Это ещё не говорит, кто заплатит. Что будем наблюдать?",
          "Быстрый черновик полезен. Сколько времени уйдёт на исправления и согласование?",
          "Для еженедельной задачи уже есть свой процесс. Что убедит клиента перейти к нам?"
        ],
        "revisions": [
          "Сохранить альтернативный рынок.",
          "Измерить задачу целиком.",
          "Проверить использование и оплату.",
          "Посчитать все ручные правки.",
          "Получить вторую задачу."
        ],
        "direction": "Выбрать первого клиента для проверки, затем заслужить второй платный заказ."
      },
      "product": {
        "ideas": [
          "Полезный первый опыт",
          "Платить за новые запуски",
          "Показать ценность",
          "Задать понятный лимит",
          "Объяснить платный тариф"
        ],
        "challengeHeads": [
          "Лимит не станет сюрпризом?",
          "Все запуски стоят одинаково?",
          "Интерес или готовность платить?",
          "Что будет после лимита?",
          "Почему стоит платить?"
        ],
        "revisions": [
          "Показать бюджет заранее",
          "Месячный лимит",
          "Примеры для знакомства",
          "Сначала месячный тариф",
          "Проверить до продажи"
        ],
        "challenges": [
          "Бесплатный лимит может сработать. Но узнает ли человек об объёме до начала обсуждения?",
          "Считать только запуски недостаточно. Как учесть разговор, который окажется намного длиннее обычного?",
          "Удачный бесплатный пример показывает интерес. Но говорит ли он о готовности платить?",
          "Лимит сдерживает расходы. Что произойдёт, если клиенту понадобится ещё одно обсуждение?",
          "Ценность платного тарифа пока лишь обещание. Какая реальная задача подтвердит её?"
        ],
        "direction": "Первый опыт — бесплатно. Расходы — предсказуемы."
      },
      "engineering": {
        "ideas": [
          "Назвать ограничение",
          "Разделить модули",
          "Найти узкое место",
          "Учесть эксплуатацию",
          "Проверить один компонент"
        ],
        "challengeHeads": [
          "Что оправдает переписывание?",
          "Нужен ли отдельный сервис?",
          "Архитектура или процесс?",
          "Кто будет поддерживать?",
          "Как откатить изменение?"
        ],
        "revisions": [
          "Определить успех",
          "Улучшить один модуль",
          "Измерить изменение",
          "Учесть поддержку",
          "Сохранить обратимость"
        ],
        "challenges": [
          "Назвать проблему — начало. Какое улучшение оправдает смену архитектуры?",
          "Как проверить, решат ли чёткие границы модулей проблему без отдельного сервиса?",
          "Узкое место вызвано архитектурой или тем, как организована работа команды?",
          "Можно ли оценить нагрузку мониторинга и отладки до перехода на несколько сервисов?",
          "Как команда вернёт всё назад, если выделение компонента замедлит релизы?"
        ],
        "direction": "Решить измеримую проблему небольшим изменением."
      }
    }
  },
  "messages": {
    "Skip to content": "К содержанию",
    "Meridian home": "Meridian — главная",
    "Main navigation": "Основная навигация",
    "Overview": "Обзор",
    "The experience": "Как это работает",
    "Your council": "Ваш совет",
    "Pricing": "Тарифы",
    "Try the demo": "Смотреть демо",
    "A meeting": "Встреча",
    "of minds.": "умов.",
    "Different AI models. One shared question.": "Разные AI-модели. Один общий вопрос.",
    "A fresh perspective on what comes next.": "Свежий взгляд на следующий шаг.",
    "Explore Council": "Посмотреть Council",
    "Meet your council": "Собрать свой совет",
    "An interactive preview. Live AI connections are coming later.": "Интерактивная демонстрация. Подключение AI-моделей — следующий этап.",
    "See Council in action": "Council в действии",
    "See how an idea evolves": "Как меняется идея",
    "Interactive demo": "Демонстрация",
    "Choose an example": "Выбрать пример",
    "Market opportunity": "Анализ рынка",
    "Product decision": "Продукт",
    "Engineering": "Разработка",
    "The question on the table": "Вопрос для обсуждения",
    "Choose two to five participants": "Выберите от двух до пяти участников",
    "Conversation stage": "Этап обсуждения",
    "Independent views": "Первые мнения",
    "Challenge": "Возражения",
    "Refine": "Правки",
    "Come together": "Общий вывод",
    "Interactive map of the council": "Интерактивная карта обсуждения",
    "An idea takes shape.": "Идея обретает форму.",
    "A few starting points. Room for a better one.": "Несколько исходных идей. Возможность найти лучшую.",
    "4 perspectives at the table": "4 участника за столом",
    "See the shared decision": "Перейти к выводу",
    "What each perspective brought": "Вклад каждого участника",
    "Still open:": "Открытый вопрос:",
    "Copy this sample decision": "Скопировать пример вывода",
    "Previous argument": "Предыдущий аргумент",
    "Next argument": "Следующий аргумент",
    "Move through the conversation": "Перейти к моменту обсуждения",
    "Ready to explore": "Готово к просмотру",
    "Scripted demonstration. Written examples, not actual model responses. No live AI calls.": "Демонстрационный сценарий. Реплики написаны для примера, а не получены от указанных моделей. Подключения к AI пока нет.",
    "Different opinions can reveal different trade-offs. Agreement is not a guarantee of accuracy.": "Разные мнения помогают увидеть компромиссы. Согласие не гарантирует правильность.",
    "Different minds.": "Разные взгляды.",
    "Room to disagree.": "Место для спора.",
    "Choose two to five participants.": "Выберите от двух до пяти участников.",
    "See how their perspectives fit together in the preview.": "Посмотрите, как их идеи складываются в общий вывод.",
    "Choose council participants": "Выбрать участников совета",
    "4 perspectives selected": "Выбрано участников: 4",
    "Start independently.": "Сначала — своё мнение.",
    "Give each participant space to propose an idea before seeing the others.": "Каждый предлагает идею до того, как увидит ответы остальных.",
    "Make room for friction.": "Дайте идеям столкнуться.",
    "Surface assumptions and explain what could change the recommendation.": "Находите допущения и условия, которые могут изменить рекомендацию.",
    "Keep the final call.": "Решение остаётся за вами.",
    "Take the useful ideas and the unresolved questions. You make the decision.": "Заберите полезные идеи и открытые вопросы. Окончательный выбор — ваш.",
    "See this council in the demo": "Посмотреть этот состав в действии",
    "The final call is yours.": "Последнее слово — за вами.",
    "More perspectives.": "Больше точек зрения.",
    "Still your decision.": "Решение по-прежнему ваше.",
    "Take a seat at the table": "Присоединиться к обсуждению",
    "Room to think": "Пространство для мысли",
    "Start curious.": "Начните с интереса.",
    "Go from there.": "Остальное — впереди.",
    "The preview is free.": "Демонстрация бесплатна.",
    "Live discussions are the next chapter.": "Живые обсуждения — следующий этап.",
    "Explore": "Обзор",
    "Free": "Бесплатно",
    "Get a feel for the council.": "Узнайте, как работает совет.",
    "Three sample conversations": "Три примера обсуждения",
    "Your choice of 2–5 participants": "От 2 до 5 участников на ваш выбор",
    "Every stage, at your pace": "Все этапы с возможностью остановиться",
    "Try the preview": "Посмотреть демо",
    "Available now. No AI keys needed for this preview.": "Доступно сейчас. Для демонстрации не нужны ключи AI.",
    "Planned": "В планах",
    "/ month": "/ месяц",
    "A place for your own questions.": "Место для ваших вопросов.",
    "Live conversations across models": "Живые обсуждения между моделями",
    "A monthly usage budget": "Месячный бюджет использования",
    "Extra usage when you need it": "Дополнительный объём по необходимости",
    "Live plans are not open yet.": "Платные тарифы пока недоступны.",
    "Proposed price. Usage limits are still being tested. No payments are collected here.": "Предварительная цена. Лимиты ещё проверяются. На этом сайте платежи не принимаются.",
    "Multiple perspectives. Human judgment.": "Разные взгляды. Решает человек.",
    "Back to the top": "Наверх",
    "Enable JavaScript to play the sample conversation and change its participants.": "Включите JavaScript для воспроизведения примера и выбора участников.",
    "Language": "Язык",
    "Pause animation": "Приостановить",
    "Continue animation": "Продолжить",
    "Autoplay": "Автопоказ",
    "Automatic preview": "Автоматическая демонстрация",
    "Motion paused": "Анимация на паузе",
    "Restarts shortly": "Скоро начнётся заново",
    "Read {name}’s argument": "Прочитать аргумент {name}",
    "First view": "Первое мнение",
    "Raises a concern": "Возражает",
    "Refines the idea": "Уточняет идею",
    "Added to decision": "Вклад в общий вывод",
    "Combined": "Учтено в выводе",
    "Ready to contribute": "Готов к обсуждению",
    "Considers the objection": "Изучает возражение",
    "Reviews the reply": "Проверяет ответ",
    "Constructive friction": "Конструктивный спор",
    "A little friction.": "Идеи спорят.",
    "Which assumptions stand up to another perspective?": "Какие допущения выдержат критику?",
    "A clearer direction": "Уточняем направление",
    "A sharper idea.": "Идея точнее.",
    "Every revision answers a specific objection.": "Каждая доработка отвечает на конкретное возражение.",
    "Coming together": "Собираем вместе",
    "One direction.": "Общий вывод.",
    "The shared decision · demo": "Общий вывод · демо",
    "Working hypothesis · demo": "Рабочая гипотеза · демо",
    "{n} contributions brought together": "Объединено мнений: {n}",
    "{n} of {total} contributions combined": "Учтено мнений: {n} из {total}",
    "{n} of {total} first views": "Первых мнений: {n} из {total}",
    "{n} of {total} objections": "Возражений: {n} из {total}",
    "{n} of {total} revisions": "Доработок: {n} из {total}",
    "proposes": "предлагает",
    "challenges": "оспаривает",
    "responds to": "отвечает",
    "contributes to": "дополняет",
    "the shared decision": "общий вывод",
    "The council’s shared decision": "Общий вывод совета",
    "Read the earlier argument": "Исходный аргумент",
    "Counterpoint": "Возражение",
    "Revision": "Доработка",
    "Contributing": "Объединение",
    "Reconsidered": "Пересмотрено",
    "Remove {name}": "Убрать {name}",
    "Add {name}": "Добавить {name}",
    "{n} perspectives selected": "Выбрано участников: {n}",
    "Step {n} of {total}: {phase}": "Шаг {n} из {total}: {phase}",
    "Sample complete": "Пример завершён",
    "Playing": "Идёт обсуждение",
    "Paused": "На паузе",
    "Keep at least two participants at the table.": "Оставьте в совете хотя бы двух участников.",
    "Sample decision copied.": "Пример вывода скопирован.",
    "Copy is unavailable here. Select the decision text to copy it manually.": "Автокопирование недоступно. Выделите и скопируйте текст вручную.",
    "MERIDIAN COUNCIL — SCRIPTED DEMONSTRATION": "MERIDIAN COUNCIL — ДЕМОНСТРАЦИОННЫЙ СЦЕНАРИЙ",
    "Written example, not actual output from the named AI models.": "Написанный пример, а не реальные ответы указанных AI-моделей.",
    "Contributions:": "Вклад участников:",
    "Sources": "Источники",
    "Fact · IEA": "Факт · IEA",
    "Hypothesis": "Гипотеза",
    "Company claims": "Заявления компаний",
    "Source notes · September 2026": "Основа примера · сентябрь 2026",
    "Global utility-scale storage; not small-business payback.": "Крупные сетевые накопители в мире; не окупаемость для малого бизнеса.",
    "Commercial storage and energy management, announced 15 June 2026.": "Накопитель и управление энергией для бизнеса, анонс 15 июня 2026.",
    "200,000 connected energy assets reported in December 2025; not customer count.": "200 000 подключённых энергоустройств по заявлению в декабре 2025; не число клиентов.",
    "The audit opportunity and proposed pilot are hypotheses to test.": "Возможность независимого аудита и предложенный пилот — гипотезы для проверки.",
    "Model names and logos identify the examples; no affiliation is implied.": "Названия и логотипы обозначают участников примера; партнёрство с ними не заявляется.",
    "Meet Meridian Council. Bring different AI models together to propose, challenge, and refine an idea. Explore the interactive product preview.": "Meridian Council объединяет разные AI-модели для обсуждения и доработки идей. Посмотрите интерактивную демонстрацию.",
    "Meridian Council — A meeting of minds.": "Meridian Council — Встреча умов.",
    "Log in": "Войти",
    "Sign up": "Регистрация",
    "Get started": "Начать",
    "Watch the council": "Посмотреть демо",
    "An idea": "Идея",
    "A product": "Монетизация",
    "The code": "Разработка",
    "A place for your next idea.": "Место для вашей следующей идеи.",
    "Explore the preview. Then imagine what comes next.": "Посмотрите демо. Представьте, что будет дальше.",
    "Create an account": "Создать аккаунт",
    "Account preview": "Превью аккаунта",
    "Questions, answered.": "Вопросы и ответы.",
    "FAQ": "Вопросы",
    "Privacy": "Конфиденциальность",
    "Demo terms": "Условия демо",
    "Account forms are previews. Live plans are coming later.": "Формы аккаунта пока демонстрационные. Подключение тарифов — позже.",
    "Five models. Different perspectives.": "Пять моделей. Разные взгляды.",
    "A first look at collective intelligence.": "Первый взгляд на совместную работу AI.",
    "Challenge the assumptions. Find your next move.": "Проверьте допущения. Найдите следующий шаг.",
    "Free interactive demo. No sign-up required.": "Бесплатное интерактивное демо. Без регистрации.",
    "Scripted preview. Live discussions are coming next.": "Заранее подготовленный пример. Живые обсуждения — следующий этап.",
    "See the outcome": "Сразу к выводу",
    "What you take away": "Что вы получаете",
    "A direction.": "Направление.",
    "And a reason why.": "И обоснование.",
    "The discussion ends with a shared recommendation, a practical next step, and what still needs your judgment.": "Итог обсуждения — общая рекомендация, конкретный следующий шаг и вопросы, в которых решение остаётся за вами.",
    "Follow the discussion": "Посмотреть обсуждение",
    "Council brief": "Вывод совета",
    "Sample output": "Пример результата",
    "Your next step": "Следующий шаг",
    "Still worth testing": "Что ещё проверить",
    "An example from the selected discussion.": "Пример из выбранного обсуждения.",
    "See another angle.": "Посмотрите с другой стороны.",
    "Compare different starting points before settling on a direction.": "Сравните разные подходы, прежде чем выбрать направление.",
    "Find the weak assumption.": "Найдите слабое допущение.",
    "Follow the objections and see what changes in the recommendation.": "Посмотрите, какие возражения меняют исходную рекомендацию.",
    "Know what to do next.": "Определите следующий шаг.",
    "Leave with a focused next step and the questions that remain open.": "Получите конкретный следующий шаг и список открытых вопросов.",
    "Try it now": "Доступно сейчас",
    "See the whole process, from question to decision.": "Весь путь от вопроса до совместного решения.",
    "A shared brief you can copy": "Общий вывод, который можно скопировать",
    "No account. No card. No AI keys needed.": "Без регистрации, карты и ключей к AI.",
    "Preview sign up": "Посмотреть регистрацию",
    "Before you begin": "Перед началом",
    "Questions,": "Вопросы",
    "answered.": "и ответы.",
    "Your next decision": "Следующее решение",
    "deserves a discussion.": "стоит обсудить.",
    "Start with an idea, a product question, or a technical choice.": "Начните с идеи, вопроса о продукте или технического решения.",
    "The outcome": "Результат",
    "A little room for a better idea.": "Место для более сильной идеи.",
    "Scripted preview": "Подготовленный пример",
    "At the table": "Участники совета",
    "Propose": "Идеи",
    "Decide": "Итог",
    "Debate": "Спор",
    "Compare": "Сравнение",
    "A market": "Рынок",
    "Explore the possibilities": "Изучаем варианты",
    "Three ways in.": "Три точки входа.",
    "Authored market hypotheses": "Условные гипотезы о рынке",
    "Illustrative brief": "Условный бриф",
    "Open question": "Открытый вопрос",
    "Independent perspectives": "Независимые мнения",
    "One idea enters the room.": "Идея входит в обсуждение.",
    "The original proposal": "Исходная идея",
    "The counterpoint": "Возражение",
    "The response": "Ответ",
    "Put the idea under pressure.": "Проверяем идею на прочность.",
    "What changed": "Что изменилось",
    "Compare the trade-offs.": "Сравниваем компромиссы.",
    "Option": "Вариант",
    "A direction is taking shape.": "Направление обретает форму.",
    "Bringing the arguments together": "Собираем аргументы",
    "Suggested first test": "Предлагаемый первый тест",
    "Why this direction": "Почему этот вариант",
    "The next move": "Следующий шаг",
    "Keep in view": "Не теряем из виду",
    "Still unproven": "Ещё не проверено",
    "Shared recommendation": "Общая рекомендация",
    "Hypotheses, not market findings.": "Гипотезы, а не результаты исследования рынка.",
    "Illustrative comparison, not measured scores.": "Условное сравнение без вымышленных оценок.",
    "Reading the brief": "Разбираем бриф",
    "Options on the table": "Варианты на рассмотрении",
    "Source brief": "Исходный бриф",
    "A market. A debate. A direction.": "Рынок. Обсуждение. Направление.",
    "Sample decision · not a verified conclusion": "Пример решения · вывод ещё не проверен",
    "Candidate {n}": "Вариант {n}",
    "{n} of {total} perspectives": "{n} из {total} мнений",
    "Three possibilities. One first test.": "Три возможности. Один первый тест.",
    "Demo": "Демо",
    "Read the exchange": "Читать обсуждение",
    "See each contribution": "Вклад каждого участника",
    "Scripted preview. Live AI is not connected.": "Демонстрационный сценарий. Подключения к AI пока нет."
  },
  "sources": []
};
  if(typeof module!=="undefined"&&module.exports)module.exports=content;
  else globalThis.CouncilContent=content;
})();
