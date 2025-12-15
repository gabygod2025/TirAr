document.addEventListener("DOMContentLoaded", () => {
  const counterElement = document.getElementById("visit-count");
  if (!counterElement) return;

  // Configuración
  // Fecha de inicio para el cálculo (5 de Diciembre 2025)
  const startDate = new Date("2025-12-05"); 
  const baseVisits = 156; // Visitas iniciales base
  const dailyVisits = 57; // Visitas a sumar por día

  // Cálculo de días pasados desde la fecha de inicio
  const today = new Date();
  const timeDiff = today - startDate;
  // Convertir milisegundos a días (redondeando hacia abajo para días completos)
  const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // Visitas automáticas: 57 por cada día pasado
  // Si daysPassed es negativo (fecha futura), usamos 0
  const automaticVisits = daysPassed > 0 ? daysPassed * dailyVisits : 0;

  // Visitas reales del usuario (guardadas en localStorage para persistencia local)
  // Usamos una clave diferente 'userSessionVisits' para no mezclar con la lógica anterior si es necesario,
  // o simplemente sumamos a lo que se ve.
  let userVisits = parseInt(localStorage.getItem("userVisits")) || 0;
  
  // Incrementamos la visita del usuario actual
  userVisits++;
  localStorage.setItem("userVisits", userVisits);

  // Total = Base + Automáticas (días * 57) + Visitas del usuario
  const totalCount = baseVisits + automaticVisits + userVisits;

  // Mostrar el resultado formateado
  counterElement.textContent = totalCount.toLocaleString();
});
