import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Grid, Typography } from '@mui/joy';

const Home: React.FC = () => {
  const mapaRef = useRef<HTMLDivElement | null>(null);
  const [mapa, setMapa] = useState<L.Map | null>(null);
  const [cidade, setCidade] = useState<string>('');
  const [infoClima, setInfoClima] = useState<string>('');

  // Inicializando o mapa após o componente ser montado
  useEffect(() => {
    if (mapaRef.current && !mapa) {
      const newMapa = L.map(mapaRef.current).setView([20, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(newMapa);
      setMapa(newMapa);
    }
  }, [mapa]);

  const buscarClima = () => {
    fetch('/clima', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cidade }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.erro) {
          alert('Cidade não encontrada');
          return;
        }

        const { clima, qualidade_ar } = data;
        const lat = clima.coord.lat;
        const lon = clima.coord.lon;

        if (mapa) {
          mapa.setView([lat, lon], 10);
          L.marker([lat, lon])
            .addTo(mapa)
            .bindPopup(
              `<b>${clima.name}</b><br>Temp: ${clima.main.temp} °C<br>Índice de Qualidade do Ar: ${qualidade_ar.list[0].main.aqi}`
            )
            .openPopup();
        }

        setInfoClima(`
          <h3>${clima.name}</h3>
          <p>Temperatura: ${clima.main.temp} °C</p>
          <p>Índice de Qualidade do Ar: ${qualidade_ar.list[0].main.aqi}</p>
        `);
      })
      .catch((error) => console.error('Erro:', error));
  };

  return (
    <Grid>
      <Typography>Mapa de Clima e Qualidade do Ar</Typography>
      <input
        type="text"
        id="input-cidade"
        placeholder="Digite a cidade"
        value={cidade}
        onChange={(e) => setCidade(e.target.value)}
      />
      <Button onClick={buscarClima}>Buscar Clima</Button>
      <div
        id="mapa"
        style={{ height: '500px' }}
        ref={mapaRef}
      ></div>
      <div id="info-clima" dangerouslySetInnerHTML={{ __html: infoClima }} />
    </Grid>
  );
};

export default Home;
