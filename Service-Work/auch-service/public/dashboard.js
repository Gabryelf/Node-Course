// Глобальные переменные
let currentProfile = null;

/**
 * Загрузка профиля пользователя
 */
async function loadProfile() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.log('Нет токена');
        return;
    }

    console.log('Загружаем профиль...');
    const profileInfo = document.getElementById('profileInfo');
    profileInfo.innerHTML = '<div class="loading">⏳ Загрузка профиля...</div>';

    try {
        const res = await fetch('http://localhost:3001/api/profile', {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Статус ответа:', res.status);
        
        if (res.status === 404) {
            console.log('Профиль не найден');
            displayNoProfile();
        } else if (res.ok) {
            const data = await res.json();
            console.log('Профиль загружен:', data.profile);
            currentProfile = data.profile;
            displayProfile(data.profile);
        } else {
            const error = await res.json();
            console.error('Ошибка:', error);
            profileInfo.innerHTML = `<div class="error-message">❌ Ошибка: ${error.error || 'Не удалось загрузить профиль'}</div>`;
        }
    } catch (err) {
        console.error('Ошибка запроса:', err);
        profileInfo.innerHTML = '<div class="error-message">❌ Сервис профилей недоступен</div>';
    }
}

/**
 * Отображение профиля
 */
function displayProfile(profile) {
    const container = document.getElementById('profileInfo');
    if (!profile) {
        displayNoProfile();
        return;
    }

    container.innerHTML = `
        <div class="profile-display">
            <div class="profile-field">
                <strong>👤 Полное имя:</strong> 
                <span>${profile.full_name || '—'}</span>
            </div>
            <div class="profile-field">
                <strong>📝 О себе:</strong> 
                <span>${profile.bio || '—'}</span>
            </div>
            <div class="profile-field">
                <strong>🎂 Дата рождения:</strong> 
                <span>${profile.birth_date || '—'}</span>
            </div>
            <div class="profile-field">
                <strong>🖼️ Avatar:</strong> 
                <span>${profile.avatar_url ? '✓ Загружен' : '—'}</span>
            </div>
            <div class="profile-field">
                <strong>📅 Создан:</strong> 
                <span>${new Date(profile.created_at).toLocaleString()}</span>
            </div>
            <div class="profile-field">
                <strong>🔄 Обновлен:</strong> 
                <span>${new Date(profile.updated_at).toLocaleString()}</span>
            </div>
        </div>
        <div class="button-group" style="margin-top: 20px;">
            <button class="btn-primary" onclick="showEditForm()">✏️ Редактировать</button>
            <button class="btn-danger" onclick="deleteProfile()">🗑️ Удалить профиль</button>
        </div>
    `;
}

/**
 * Отображение, когда профиля нет
 */
function displayNoProfile() {
    const container = document.getElementById('profileInfo');
    container.innerHTML = `
        <div class="error-message" style="background: #fff3cd; color: #856404;">
            ⚠️ Профиль не найден. Создайте свой профиль!
        </div>
        <button class="btn-primary" onclick="showEditForm()" style="margin-top: 15px; width: 100%;">
            ➕ Создать профиль
        </button>
    `;
    currentProfile = null;
}

/**
 * Показать форму редактирования
 */
function showEditForm() {
    const editForm = document.getElementById('editForm');
    const profileInfo = document.getElementById('profileInfo');
    
    // Скрываем отображение профиля
    profileInfo.style.display = 'none';
    
    // Заполняем форму текущими данными
    if (currentProfile) {
        document.getElementById('fullName').value = currentProfile.full_name || '';
        document.getElementById('bio').value = currentProfile.bio || '';
        document.getElementById('birthDate').value = currentProfile.birth_date || '';
        document.getElementById('avatarUrl').value = currentProfile.avatar_url || '';
    } else {
        // Очищаем форму для нового профиля
        document.getElementById('fullName').value = '';
        document.getElementById('bio').value = '';
        document.getElementById('birthDate').value = '';
        document.getElementById('avatarUrl').value = '';
    }
    
    editForm.style.display = 'block';
}

/**
 * Отмена редактирования
 */
function cancelEdit() {
    const editForm = document.getElementById('editForm');
    const profileInfo = document.getElementById('profileInfo');
    
    editForm.style.display = 'none';
    profileInfo.style.display = 'block';
    
    // Перезагружаем профиль
    loadProfile();
}

/**
 * Сохранение профиля
 */
async function saveProfile() {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const profileData = {
        full_name: document.getElementById('fullName').value,
        bio: document.getElementById('bio').value,
        birth_date: document.getElementById('birthDate').value,
        avatar_url: document.getElementById('avatarUrl').value
    };

    console.log('Сохраняем профиль:', profileData);

    try {
        const res = await fetch('http://localhost:3001/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Профиль сохранен:', data.profile);
            currentProfile = data.profile;
            
            // Показываем сообщение об успехе
            showMessage('✅ Профиль успешно сохранен!', 'success');
            
            // Скрываем форму и показываем обновленный профиль
            cancelEdit();
        } else {
            const error = await res.json();
            console.error('Ошибка сохранения:', error);
            showMessage('❌ Ошибка сохранения: ' + (error.error || 'Неизвестная ошибка'), 'error');
        }
    } catch (err) {
        console.error('Ошибка запроса:', err);
        showMessage('❌ Не удалось соединиться с сервером', 'error');
    }
}

/**
 * Удаление профиля
 */
async function deleteProfile() {
    if (!confirm('Вы уверены, что хотите удалить свой профиль? Это действие нельзя отменить.')) {
        return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch('http://localhost:3001/api/profile', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.ok) {
            showMessage('✅ Профиль успешно удален', 'success');
            currentProfile = null;
            displayNoProfile();
        } else {
            const error = await res.json();
            showMessage('❌ Ошибка удаления: ' + (error.error || 'Неизвестная ошибка'), 'error');
        }
    } catch (err) {
        console.error('Ошибка удаления:', err);
        showMessage('❌ Не удалось соединиться с сервером', 'error');
    }
}

/**
 * Показать временное сообщение
 */
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '1000';
    messageDiv.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

/**
 * Отправка тестового сообщения
 */
async function sendMessage() {
    const message = document.getElementById('message').value;
    if (!message.trim()) {
        alert('Введите сообщение');
        return;
    }

    const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    document.getElementById('length').textContent = data.length;
    document.getElementById('wordCount').textContent = data.wordCount;
}

/**
 * Выход из системы
 */
function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/';
}

/**
 * Инициализация страницы
 */
window.onload = async () => {
    const token = sessionStorage.getItem('token');
    const userJson = sessionStorage.getItem('user');

    if (!token || !userJson) {
        window.location.href = '/';
        return;
    }

    const user = JSON.parse(userJson);
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        userInfo.innerHTML = `
            <p><strong>👤 Логин:</strong> ${user.login}</p>
            <p><strong>🆔 ID пользователя:</strong> ${user.id}</p>
            <p><strong>📅 Зарегистрирован:</strong> ${new Date(user.created_at).toLocaleString()}</p>
        `;
    }

    // Загружаем профиль
    await loadProfile();
};

// Добавляем CSS анимацию
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);