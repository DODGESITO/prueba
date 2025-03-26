/**
 * Módulo de Autenticación con Supabase
 * Maneja la funcionalidad de los formularios de inicio de sesión y registro
 */

document.addEventListener('DOMContentLoaded', async function () {
    'use strict';

    // Importar la biblioteca de Supabase
    const { createClient } = supabase;

    // Configuración de Supabase (REEMPLAZA CON TUS CREDENCIALES)
    const SUPABASE_URL = 'https://rznmgbeplhyynnqvejfy.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bm1nYmVwbGh5eW5ucXZlamZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MDI0ODUsImV4cCI6MjA1MDk3ODQ4NX0.YLFvwlLfniHGqM0DEGewbuCdc0L8Q32ImQE73MIMUSw';

    // Inicializar cliente de Supabase
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Elementos del DOM
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const statusMessage = document.getElementById('status-message');

    // Errores
    const loginUsernameError = document.getElementById('login-username-error');
    const loginPasswordError = document.getElementById('login-password-error');
    const registerUsernameError = document.getElementById('register-username-error');
    const registerPasswordError = document.getElementById('register-password-error');

    // Verificar si hay una sesión activa
    checkSession();

    // Eventos para cambiar entre formularios
    showRegisterLink.addEventListener('click', function (e) {
        e.preventDefault();
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', function (e) {
        e.preventDefault();
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Evento para recuperar contraseña
    forgotPasswordLink.addEventListener('click', handleForgotPassword);

    // Eventos de envío de formularios
    loginForm.addEventListener('submit', handleLoginSubmit);
    registerForm.addEventListener('submit', handleRegisterSubmit);

    // Funciones

    async function checkSession() {
        try {
            const { data } = await supabaseClient.auth.getSession();
            if (data.session) {
                showStatusMessage('Ya has iniciado sesión', 'success');
                console.log('Usuario autenticado:', data.session.user);
                window.location.href = "/so/vista2.html"; // Redirección si hay sesión activa
            }
        } catch (error) {
            console.error('Error al verificar sesión:', error);
        }
    }

    function clearErrors() {
        loginUsernameError.textContent = '';
        loginPasswordError.textContent = '';
        registerUsernameError.textContent = '';
        registerPasswordError.textContent = '';
    }

    function showStatusMessage(message, type = 'success') {
        statusMessage.textContent = message;
        statusMessage.className = `status-message show ${type}`;
        setTimeout(() => statusMessage.classList.remove('show'), 5000);
    }

    function validateUsername(username) {
        return username.trim().length >= 3;
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    async function handleLoginSubmit(e) {
        e.preventDefault();
        clearErrors();

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        if (!validateUsername(username)) {
            loginUsernameError.textContent = 'El nombre de usuario debe tener al menos 3 caracteres';
            return;
        }

        if (!validatePassword(password)) {
            loginPasswordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
            return;
        }

        try {
            const email = `${username}@gmail.com`;
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            showStatusMessage('¡Inicio de sesión exitoso!', 'success');
            window.location.href = "/so/vista2.html"; // Redirección después de iniciar sesión

        } catch (error) {
            console.error('Error de inicio de sesión:', error.message);
            showStatusMessage(error.message || 'Error al iniciar sesión', 'error');
        }
    }

    async function handleRegisterSubmit(e) {
        e.preventDefault();
        clearErrors();

        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        if (!validateUsername(username)) {
            registerUsernameError.textContent = 'El nombre de usuario debe tener al menos 3 caracteres';
            return;
        }

        if (!validatePassword(password)) {
            registerPasswordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
            return;
        }

        try {
            const email = `${username}@gmail.com`;
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: { data: { username } }
            });

            if (error) throw error;

            if (data.user) {
                await supabaseClient.from('profiles').insert([{ id: data.user.id, username, email }]);
                showStatusMessage('¡Registro exitoso! Ahora puedes iniciar sesión', 'success');
                registerSection.classList.add('hidden');
                loginSection.classList.remove('hidden');
            }

        } catch (error) {
            console.error('Error de registro:', error.message);
            showStatusMessage(error.message || 'Error al registrar usuario', 'error');
        }
    }

    async function handleForgotPassword(e) {
        e.preventDefault();

        const username = document.getElementById('login-username').value;
        if (!validateUsername(username)) {
            loginUsernameError.textContent = 'Ingresa tu nombre de usuario para recuperar la contraseña';
            return;
        }

        try {
            const email = `${username}@gmail.com`;
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email);

            if (error) throw error;

            showStatusMessage('Se ha enviado un correo para restablecer tu contraseña', 'success');
        } catch (error) {
            console.error('Error al recuperar contraseña:', error.message);
            showStatusMessage(error.message || 'Error al solicitar recuperación de contraseña', 'error');
        }
    }
});
