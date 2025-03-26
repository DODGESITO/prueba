/**
 * Módulo de Autenticación con Supabase
 * Maneja la funcionalidad de los formularios de inicio de sesión y registro
 */
document.addEventListener('DOMContentLoaded', async function() {
    'use strict';

    // Importar Supabase
    import { createClient } from '@supabase/supabase-js';

    // Configuración de Supabase (Reemplaza con tus credenciales reales)
    const SUPABASE_URL = 'https://rznmgbeplhyynnqvejfy.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bm1nYmVwbGh5eW5ucXZlamZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MDI0ODUsImV4cCI6MjA1MDk3ODQ4NX0.YLFvwlLfniHGqM0DEGewbuCdc0L8Q32ImQE73MIMUSw';
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Elementos del DOM
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const statusMessage = document.getElementById('status-message');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');

    // Manejo de cambio entre formularios
    showRegisterLink.addEventListener('click', (e) => toggleForms(e, true));
    showLoginLink.addEventListener('click', (e) => toggleForms(e, false));

    function toggleForms(event, showRegister) {
        event.preventDefault();
        loginSection.classList.toggle('hidden', showRegister);
        registerSection.classList.toggle('hidden', !showRegister);
    }

    // Manejo de eventos de los formularios
    loginForm.addEventListener('submit', handleLoginSubmit);
    registerForm.addEventListener('submit', handleRegisterSubmit);
    forgotPasswordLink.addEventListener('click', handleForgotPassword);

    // Verificar sesión activa
    checkSession();

    async function checkSession() {
        const { data, error } = await supabase.auth.getSession();
        if (data.session) {
            showStatusMessage('Sesión activa', 'success');
            console.log('Usuario autenticado:', data.session.user);
        }
    }

    function showStatusMessage(message, type = 'success') {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        setTimeout(() => statusMessage.classList.remove('show'), 5000);
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();
        const email = document.getElementById('login-username').value + '@gmail.com';
        const password = document.getElementById('login-password').value;

        if (!email || !password) return showStatusMessage('Campos incompletos', 'error');

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return showStatusMessage(error.message, 'error');

        showStatusMessage('Inicio de sesión exitoso', 'success');
        console.log('Usuario autenticado:', data.user);
        window.location.href = '/so/vista2.html';
    }

    async function handleRegisterSubmit(event) {
        event.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = username + '@gmail.com';
        const password = document.getElementById('register-password').value;

        if (!username || !password) return showStatusMessage('Campos incompletos', 'error');

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username } }
        });

        if (error) return showStatusMessage(error.message, 'error');

        await supabase.from('profiles').insert([{ id: data.user.id, username, email }]);
        showStatusMessage('Registro exitoso, revisa tu correo', 'success');
        toggleForms(event, false);
    }

    async function handleForgotPassword(event) {
        event.preventDefault();
        const email = document.getElementById('login-username').value + '@gmail.com';
        if (!email) return showStatusMessage('Ingrese su usuario', 'error');

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://tudominio.com/reset-password'
        });

        if (error) return showStatusMessage(error.message, 'error');
        showStatusMessage('Correo de recuperación enviado', 'success');
    }
});
