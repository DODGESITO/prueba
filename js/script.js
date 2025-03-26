/**
 * Módulo de Autenticación con Supabase
 * Maneja la funcionalidad de los formularios de inicio de sesión y registro
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Importar la biblioteca de Supabase
    const { createClient } = supabase;

    // Configuración de Supabase
    const SUPABASE_URL = 'https://rznmgbeplhyynnqvejfy.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bm1nYmVwbGh5eW5ucXZlamZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MDI0ODUsImV4cCI6MjA1MDk3ODQ4NX0.YLFvwlLfniHGqM0DEGewbuCdc0L8Q32ImQE73MIMUSw';
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

    checkSession();

    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    forgotPasswordLink.addEventListener('click', handleForgotPassword);
    loginForm.addEventListener('submit', handleLoginSubmit);
    registerForm.addEventListener('submit', handleRegisterSubmit);

    function usernameToEmail(username) {
        return `${username}@gmail.com`;
    }

    async function checkSession() {
        const { data, error } = await supabaseClient.auth.getSession();
        if (data.session) {
            window.location.href = "/so/vista2.html";
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
        let isValid = true;
        
        if (!validateUsername(username)) {
            loginUsernameError.textContent = 'El nombre de usuario debe tener al menos 3 caracteres';
            isValid = false;
        }
        if (!validatePassword(password)) {
            loginPasswordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
            isValid = false;
        }
        
        if (isValid) {
            try {
                const email = usernameToEmail(username);
                const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
                if (error) throw error;
                window.location.href = "/so/vista2.html";
            } catch (error) {
                showStatusMessage(error.message, 'error');
            }
        }
    }

async function handleRegisterSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!username || !password) {
        showStatusMessage("Todos los campos son obligatorios", "error");
        return;
    }

    const email = `${username}@gmail.com`;

    if (!/\S+@\S+\.\S+/.test(email)) {
        showStatusMessage("Correo electrónico no válido", "error");
        return;
    }

    if (password.length < 6) {
        showStatusMessage("La contraseña debe tener al menos 6 caracteres", "error");
        return;
    }

    try {
        // Intentar registrar al usuario en Supabase
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        });

        if (error) {
            if (error.message.includes("User already registered")) {
                showStatusMessage("El usuario ya está registrado.", "error");
            } else {
                throw error;
            }
            return;
        }

        showStatusMessage("¡Registro exitoso! Ahora puedes iniciar sesión", "success");
        e.target.reset();

        setTimeout(() => {
            document.getElementById('register-section').classList.add('hidden');
            document.getElementById('login-section').classList.remove('hidden');
        }, 1000);

    } catch (error) {
        showStatusMessage(error.message || "Error al registrar usuario", "error");
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
            const email = usernameToEmail(username);
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
            if (error) throw error;
            showStatusMessage('Se ha enviado un correo para restablecer tu contraseña', 'success');
        } catch (error) {
            showStatusMessage(error.message, 'error');
        }
    }
});
