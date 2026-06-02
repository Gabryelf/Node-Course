/**
 * Регистрация нового пользователя.
 * Вызывается при нажатии на кнопку "Регистрация".
 */
 async function register() {
    // Считываем значения полей ввода
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    
    // Отправляем POST-запрос на эндпоинт /api/register
    const response = await fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
        alert(data.message);
        // Очищаем поля формы после успешной регистрации
        document.getElementById('login').value = '';
        document.getElementById('password').value = '';
    } else {
        alert("Ошибка: " + data.error);
    }
}

/**
 * Вход пользователя в систему.
 * Если успешно — сохраняет JWT и данные пользователя в sessionStorage,
 * затем перенаправляет на /dashboard.
 */
async function login() {
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // sessionStorage хранит данные только в рамках текущей вкладки,
        // при закрытии вкладки данные очищаются (безопаснее, чем localStorage).
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        // Перенаправляем на защищённую страницу
        window.location.href = '/dashboard';
    } else {
        alert("Ошибка: " + data.error);
    }
}

/**
 * При загрузке страницы аутентификации проверяем:
 * если пользователь уже авторизован (есть user в sessionStorage),
 * то сразу перенаправляем его на дашборд.
 * Это улучшает пользовательский опыт (не нужно заново входить).
 */
window.onload = () => {
    const user = sessionStorage.getItem('user');
    if (user && window.location.pathname === '/') {
        window.location.href = '/dashboard';
    }
};