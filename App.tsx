import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  StatusBar,
} from 'react-native';

const API_KEY = '49624f40b0fc419b96862405240810';
const CITY = 'colombo';
const {width, height} = Dimensions.get('window');

interface WeatherData {
  current: {
    temp_c: number;
    humidity: number;
    feelslike_c: number;
  };
  location: {
    name: string;
  };
}

function App(): React.JSX.Element {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${CITY}&aqi=no`,
      );
      const data = await response.json();
      if (response.ok) {
        setWeatherData(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('./assets/1.jpg')} // Update this to your image path
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.overlay}>
          {loading ? (
            <ActivityIndicator size="large" color="white" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            weatherData && (
              <View style={styles.weatherContainer}>
                <Text style={styles.cityName}>{weatherData.location.name}</Text>
                <Text style={styles.temperature}>
                  {Math.round(weatherData.current.temp_c)}°C
                </Text>
                <Text style={styles.weatherInfo}>
                  Feels likess: {Math.round(weatherData.current.feelslike_c)}°C
                </Text>
                <Text style={styles.weatherInfo}>
                  Humidity: {weatherData.current.humidity}%
                </Text>
              </View>
            )
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherContainer: {
    alignItems: 'center',
  },
  cityName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 80,
    fontWeight: '200',
    color: 'white',
  },
  weatherInfo: {
    fontSize: 24,
    color: 'white',
    marginTop: 10,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default App;