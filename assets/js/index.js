// Объект для хранения времени пребывания по блокам
const timeSpent = new Map();

// Настройки для Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Элемент считается видимым, если видно 50%+
};

// Intersection Observer для отслеживания видимости блоков
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const blockId = entry.target.id;

        if (entry.isIntersecting) {
            // Начало видимости блока
            entry.target.dataset.startTime = Date.now();
        } else if (entry.target.dataset.startTime) {
            // Конец видимости блока
            const timeDiff = Date.now() - parseInt(entry.target.dataset.startTime);
            const currentTime = timeSpent.get(blockId) || 0;
            timeSpent.set(blockId, currentTime + timeDiff);
            delete entry.target.dataset.startTime;
        }
    });
}, observerOptions);

// Функция для получения блока с максимальным временем
function getMostViewedBlock() {
    let maxTime = 0;
    let mostViewedBlock = null;

    timeSpent.forEach((time, blockId) => {
        if (time > maxTime) {
            maxTime = time;
            mostViewedBlock = blockId;
        }
    });

    return mostViewedBlock ? {
        blockId: mostViewedBlock,
        time: (maxTime / 1000).toFixed(1) // В секундах с 1 знаком после запятой
    } : null;
}

// Функция для обновления блока статистики
function updateStatsBlock() {
    const statsBlock = document.getElementById('stats-block');
    const mostViewed = getMostViewedBlock();

    // Здесь имитация онлайна (можно заменить на реальные данные с сервера)
    const onlineCount = Math.floor(Math.random() * 100); // Пример: случайное число

    if (mostViewed) {
        statsBlock.innerHTML = `
            Онлайн: ${onlineCount}<br>
            Більше всього часу: ${mostViewed.blockId} (${mostViewed.time} сек)
        `;
    } else {
        statsBlock.innerHTML = `
            Онлайн: ${onlineCount}<br>
            Поки немає даних про час
        `;
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Отслеживаем все блоки с классом track-block
    const blocks = document.querySelectorAll('.track-block');
    blocks.forEach(block => {
        if (!block.id) {
            block.id = `block-${Math.random().toString(36).substr(2, 9)}`;
        }
        observer.observe(block);
    });

    // Обновляем блок статистики каждые 2 секунды
    setInterval(updateStatsBlock, 2000);
});