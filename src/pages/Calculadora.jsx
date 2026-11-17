import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Calculadora.css';

export default function Calculadora() {
  const navigate = useNavigate();

  // Usamos string para permitir borrar el campo por completo mientras se escribe
  const [personasInput, setPersonasInput] = useState('20');
  const [clima, setClima] = useState('templado'); // fresco, templado, caluroso
  const [duracion, setDuracion] = useState('medio'); // corto, medio, largo
  const [enfriarBebidas, setEnfriarBebidas] = useState(true);

  // Convertimos a número de forma segura para los cálculos (si está vacío cuenta como 0)
  const personas = personasInput === '' ? 0 : parseInt(personasInput, 10) || 0;

  // Lógica de cálculo de kilos de hielo (ajustada a valores reales)
  const calcularKilos = () => {
    if (personas <= 0) return 3;

    // 1. Base estándar de consumo en vasos por persona (0.5 kg)
    let kilosPorPersona = 0.5;

    // 2. Ajuste por clima (sumamos suplemento en lugar de multiplicar)
    if (clima === 'templado') kilosPorPersona += 0.1;
    if (clima === 'caluroso') kilosPorPersona += 0.25;

    // 3. Ajuste por duración del evento
    if (duracion === 'medio') kilosPorPersona += 0.1;
    if (duracion === 'largo') kilosPorPersona += 0.25;

    // 4. Extra para enfriar botellas en conservadoras o tachos
    if (enfriarBebidas) {
      kilosPorPersona += 0.35;
    }

    const totalBruto = personas * kilosPorPersona;

    // Redondeo práctico a bolsas comerciales (múltiplos de 3 kg si es chico, o de 5 kg si es grande)
    if (totalBruto <= 15) {
      return Math.max(3, Math.ceil(totalBruto / 3) * 3);
    }
    return Math.ceil(totalBruto / 5) * 5;
  };

  const kilosCalculados = calcularKilos();

  // Cálculo automático de sugerencia de bolsas de 10 kg y 3 kg
  const bolsas10 = Math.floor(kilosCalculados / 10);
  const resto = kilosCalculados % 10;
  const bolsas3 = resto > 0 ? Math.ceil(resto / 3) : 0;

  const handlePedirCalculo = () => {
    const detalleBolsas = [
      bolsas10 > 0 ? `${bolsas10} bolsa${bolsas10 > 1 ? 's' : ''} de 10 kg` : '',
      bolsas3 > 0 ? `${bolsas3} bolsa${bolsas3 > 1 ? 's' : ''} de 3 kg` : '',
    ]
      .filter(Boolean)
      .join(' + ');

    const mensaje = encodeURIComponent(
      `¡Hola Hielos Carvan! Usé la calculadora de la web para un evento de ${personas} personas (${duracion}, clima ${clima}). Necesitaría un presupuesto aproximado por ${kilosCalculados} kg de hielo (${detalleBolsas}).`
    );
    window.open(`https://wa.me/5491167391181?text=${mensaje}`, '_blank');
  };

  return (
    <main className="calculadora-page">
      <div className="container">

        {/* Hero de la Calculadora */}
        <section className="calc-hero">
          <span className="calc-hero__badge">⚡ HERRAMIENTA GRATUITA</span>
          <h1>
            ¿CUÁNTO HIELO NECESITÁS<br />
            <span className="title-cyan">PARA TU EVENTO?</span>
          </h1>
          <p>
            Ingresá la cantidad de invitados y el tipo de juntada, y te decimos cuántos kilos de hielo pedir — sin quedarte corto ni pasarte.
          </p>
        </section>

        {/* Contenedor Interactivo */}
        <div className="calc-card-container">
          
          {/* 1. Cantidad de personas */}
          <div className="calc-step">
            <label>👥 ¿Cuántas personas son?</label>
            <div className="calc-input-group">
              <input
                type="number"
                min="0"
                value={personasInput}
                onChange={(e) => setPersonasInput(e.target.value)}
                placeholder="Ej. 20"
              />
              <span className="input-unit">invitados</span>
            </div>
          </div>

          {/* 2. Clima esperado */}
          <div className="calc-step">
            <label>🌡️ ¿Qué temperatura esperás?</label>
            <div className="calc-options-grid">
              <button
                type="button"
                className={`calc-opt-btn ${clima === 'fresco' ? 'active' : ''}`}
                onClick={() => setClima('fresco')}
              >
                <strong>Fresco</strong>
                <span>Hasta 22°</span>
              </button>
              <button
                type="button"
                className={`calc-opt-btn ${clima === 'templado' ? 'active' : ''}`}
                onClick={() => setClima('templado')}
              >
                <strong>Templado</strong>
                <span>22° a 30°</span>
              </button>
              <button
                type="button"
                className={`calc-opt-btn ${clima === 'caluroso' ? 'active' : ''}`}
                onClick={() => setClima('caluroso')}
              >
                <strong>Caluroso</strong>
                <span>Más de 30°</span>
              </button>
            </div>
          </div>

          {/* 3. Duración */}
          <div className="calc-step">
            <label>⏱️ ¿Cuánto dura la juntada?</label>
            <div className="calc-options-grid">
              <button
                type="button"
                className={`calc-opt-btn ${duracion === 'corto' ? 'active' : ''}`}
                onClick={() => setDuracion('corto')}
              >
                <strong>Hasta 3 hs</strong>
                <span>Junta corta</span>
              </button>
              <button
                type="button"
                className={`calc-opt-btn ${duracion === 'medio' ? 'active' : ''}`}
                onClick={() => setDuracion('medio')}
              >
                <strong>4 a 6 hs</strong>
                <span>Tarde / Noche</span>
              </button>
              <button
                type="button"
                className={`calc-opt-btn ${duracion === 'largo' ? 'active' : ''}`}
                onClick={() => setDuracion('largo')}
              >
                <strong>Más de 6 hs</strong>
                <span>Todo el día / Fiesta</span>
              </button>
            </div>
          </div>

          {/* 4. Check extra */}
          <div className="calc-step-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={enfriarBebidas}
                onChange={(e) => setEnfriarBebidas(e.target.checked)}
              />
              <span>Necesito hielo extra para enfriar bebidas (botellas / latas en tachos o conservadoras)</span>
            </label>
          </div>

          {/* Resultado Destacado */}
          <div className="calc-result-box">
            <span className="result-subtitle">NECESITÁS APROXIMADAMENTE</span>
            <div className="result-number">{kilosCalculados} kg</div>
            <p className="result-legend">
              Sugerencia práctica: {bolsas10 > 0 && `${bolsas10} bolsa${bolsas10 > 1 ? 's' : ''} de 10 kg`}
              {bolsas10 > 0 && bolsas3 > 0 && ' + '}
              {bolsas3 > 0 && `${bolsas3} bolsa${bolsas3 > 1 ? 's' : ''} de 3 kg`}.
            </p>
            <div className="result-actions">
              <button onClick={() => navigate('/productos')} className="btn-cyan">
                Ver bolsas y armar pedido →
              </button>
              <button onClick={handlePedirCalculo} className="btn-whatsapp-calc">
                Pedir este cálculo por WhatsApp 💬
              </button>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}