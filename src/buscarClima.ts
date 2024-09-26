import L, { Map, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IClimaResponse } from './core/Types/dadosAPI';


// Inicialização do mapa com Leaflet
const mapa: Map = L.map('mapa').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(mapa);


function buscarClima(): void {
    const inputCidade = document.getElementById('input-cidade') as HTMLInputElement;
    const cidade = inputCidade?.value;

    fetch('api/clima', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cidade }),
    })
        .then((response) => response.json())
        .then((dados: IClimaResponse) => {
            if (dados.erro) {
                alert('Cidade não encontrada');
                return;
            }

            const { clima, qualidade_ar } = dados;
            const lat = clima.coord.lat;
            const lon = clima.coord.lon;

            mapa.setView([lat, lon], 10);

            const marker: Marker = L.marker([lat, lon]).addTo(mapa)
                .bindPopup(`<b>${clima.name}</b><br>Temp: ${clima.main.temp} °C<br>Índice de Qualidade do Ar: ${qualidade_ar.list[0].main.aqi}`)
                .openPopup();

            const infoClima = document.getElementById('info-clima') as HTMLElement;
            if (infoClima) {
                infoClima.innerHTML = `
                    <h3>${clima.name}</h3>
                    <p>Temperatura: ${clima.main.temp} °C</p>
                    <p>Índice de Qualidade do Ar: ${qualidade_ar.list[0].main.aqi}</p>
                `;
            }
        })
        .catch((error) => console.error('Erro:', error));
}

export default buscarClima;