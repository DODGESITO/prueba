/**
 * Módulo de Autenticación con Supabase
 * Maneja la funcionalidad de los formularios de inicio de sesión y registro
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Importar la biblioteca de Supabase (asumiendo que se utiliza un CDN o un sistema de módulos)
    const { createClient } = supabase;

    // Configuración de Supabase - REEMPLAZA CON TUS CREDENCIALES
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
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
        console.log('Mostrando formulario de registro');
    });

    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
        console.log('Mostrando formulario de inicio de sesión');
    });

    // Evento para recuperar contraseña
    forgotPasswordLink.addEventListener('click', handleForgotPassword);
    
    // Eventos de envío de formularios
    loginForm.addEventListener('submit', handleLoginSubmit);
    registerForm.addEventListener('submit', handleRegisterSubmit);

    /**
     * Convierte un nombre de usuario en un correo electrónico válido
     * @param {string} username - Nombre de usuario
     * @returns {string} - Correo electrónico válido
     */
    function usernameToEmail(username) {
        // Usar un dominio real en lugar de example.com
        return `${username}@gmail.com`;
    }

    /**
     * Verifica si hay una sesión activa
     */
    async function checkSession() {
        try {
            const { data, error } = await supabaseClient.auth.getSession();
            
            if (data.session) {
                showStatusMessage('Ya has iniciado sesión', 'success');
                console.log('Usuario autenticado:', data.session.user);
                // Aquí podrías redirigir al usuario a su área personal
            }
        } catch (error) {
            console.error('Error al verificar sesión:', error);
        }
    }

    /**
     * Limpia todos los mensajes de error
     */
    function clearErrors() {
        loginUsernameError.textContent = '';
        loginPasswordError.textContent = '';
        registerUsernameError.textContent = '';
        registerPasswordError.textContent = '';
    }

    /**
     * Muestra un mensaje de estado
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de mensaje (success/error)
     */
    function showStatusMessage(message, type = 'success') {
        statusMessage.textContent = message;
        statusMessage.className = `status-message show ${type}`;
        
        setTimeout(() => {
            statusMessage.classList.remove('show');
        }, 5000);
    }

    /**
     * Valida la longitud del nombre de usuario
     * @param {string} username - Nombre de usuario a validar
     * @returns {boolean} - True si es válido
     */
    function validateUsername(username) {
        return username.trim().length >= 3;
    }
    
    /**
     * Valida la longitud de la contraseña
     * @param {string} password - Contraseña a validar
     * @returns {boolean} - True si es válida
     */
    function validatePassword(password) {
        return password.length >= 6;
    }

    /**
     * Maneja el envío del formulario de inicio de sesión
     * @param {Event} e - Evento de envío
     */
    async function handleLoginSubmit(e) {
        e.preventDefault();
        clearErrors();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        let isValid = true;
        
        // Validación del nombre de usuario
        if (!validateUsername(username)) {
            loginUsernameError.textContent = 'El nombre de usuario debe tener al menos 3 caracteres';
            isValid = false;
        }
        
        // Validación de la contraseña
        if (!validatePassword(password)) {
            loginPasswordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
            isValid = false;
        }
        
        if (isValid) {
            try {
                // Iniciar sesión con Supabase
                const email = usernameToEmail(username);
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                
                if (error) throw error;
                
                showStatusMessage('¡Inicio de sesión exitoso!', 'success');
                console.log('Usuario autenticado:', data.user);
                e.target.reset();
                
                window.location.href = "/so/vista2.html";
            } catch (error) {
                console.error('Error de inicio de sesión:', error.message);
                showStatusMessage(error.message || 'Error al iniciar sesión', 'error');
            }
        }
    }

    /**
     * Maneja el envío del formulario de registro
     * @param {Event} e - Evento de envío
     */
    async function handleRegisterSubmit(e) {
        e.preventDefault();
        clearErrors();
        
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        let isValid = true;
        
        // Validación del nombre de usuario
        if (!validateUsername(username)) {
            registerUsernameError.textContent = 'El nombre de usuario debe tener al menos 3 caracteres';
            isValid = false;
        }
        
        // Validación de la contraseña
        if (!validatePassword(password)) {
            registerPasswordError.textContent = 'La contraseña debe tener al menos 6 caracteres';
            isValid = false;
        }
        
        if (isValid) {
            try {
                // Registrar usuario con Supabase
                const email = usernameToEmail(username);
                const { data, error } = await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            username: username
                        }
                    }
                });
                
                if (error) throw error;
                
                if (data.user) {
                    // También podemos guardar el nombre de usuario en una tabla personalizada
                    const { error: profileError } = await supabaseClient
                        .from('profiles')
                        .insert([
                            { 
                                id: data.user.id, 
                                username: username,
                                email: email
                            }
                        ]);
                    
                    if (profileError) console.error('Error al guardar perfil:', profileError);
                    
                    showStatusMessage('¡Registro exitoso! Ahora puedes iniciar sesión', 'success');
                    e.target.reset();
                    
                    // Cambiar a inicio de sesión después de un registro exitoso
                    registerSection.classList.add('hidden');
                    loginSection.classList.remove('hidden');
                }
            } catch (error) {
                console.error('Error de registro:', error.message);
                showStatusMessage(error.message || 'Error al registrar usuario', 'error');
            }
        }
    }

    /**
     * Maneja la solicitud de recuperación de contraseña
     * @param {Event} e - Evento de clic
     */
    async function handleForgotPassword(e) {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        
        if (!validateUsername(username)) {
            loginUsernameError.textContent = 'Ingresa tu nombre de usuario para recuperar la contraseña';
            return;
        }
        
        try {
            // Enviar correo de recuperación de contraseña
            const email = usernameToEmail(username);
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
            
            if (error) throw error;
            
            showStatusMessage('Se ha enviado un correo para restablecer tu contraseña', 'success');
        } catch (error) {
            console.error('Error al recuperar contraseña:', error.message);
            showStatusMessage(error.message || 'Error al solicitar recuperación de contraseña', 'error');
        }
    }
});
