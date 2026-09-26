export async function fetchWeatherContext() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve('');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m`);
          if (!res.ok) {
            resolve('');
            return;
          }
          
          const data = await res.json();
          const temp = data.current_weather?.temperature;
          const wind = data.current_weather?.windspeed;
          const humList = data.hourly?.relative_humidity_2m;
          
          let humidityStr = '';
          if (humList && humList.length > 0) {
             // current hour approx
             const currentHour = new Date().getHours();
             humidityStr = `, relative humidity approx ${humList[currentHour]}%`;
          }
          
          resolve(`[Agronomic Context: Latitude ${lat.toFixed(2)}, Longitude ${lon.toFixed(2)}, Temperature ${temp}°C${humidityStr}, Wind ${wind}km/h]`);
        } catch (e) {
          resolve('');
        }
      },
      () => {
        // Geolocation denied or failed
        resolve('');
      },
      { timeout: 5000 }
    );
  });
}
