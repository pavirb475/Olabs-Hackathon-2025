#define BLYNK_TEMPLATE_ID "TMPL3K2liCQMV"
#define BLYNK_TEMPLATE_NAME "Temp Sensor"
#define BLYNK_AUTH_TOKEN "C0RxjNhFrQ5M7EtLlxwouCO0zqcZRSQN"

#define BLYNK_PRINT Serial
#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define DS18B20 2  // Connect DS18B20 to GPIO2
const int pinD4 = 4;  // GPIO4 (D4) on ESP32  ✅ ADDED THIS

OneWire ourWire(DS18B20);
DallasTemperature sensor(&ourWire);

char auth[] = BLYNK_AUTH_TOKEN;
char ssid[] = "DEVANANDA's S24";  // Type your Wi-Fi SSID
char pass[] = "littlehearts.com"; 

BlynkTimer timer;

void sendSensor() {
  sensor.requestTemperatures();
  
  float tempC = sensor.getTempCByIndex(0);
  float tempF = sensor.getTempFByIndex(0);


  
  // Check if the sensor is disconnected
  if (tempC == DEVICE_DISCONNECTED_C) {
      Serial.println(" ");
      tempC = 7.0;  // Default temperature in Celsius
      tempF = 44.6;  // Default temperature in Fahrenheit
  }


  Serial.print("Celsius temperature: ");
  Serial.print(tempC);
  Serial.print(" - Fahrenheit temperature: ");
  Serial.println(tempF);
  if (tempC == DEVICE_DISCONNECTED_C) {
      Serial.println(" ");
      return;
  }

  Blynk.virtualWrite(V0, tempC);
  Blynk.virtualWrite(V1, tempF);
}

void setup() {   
  Serial.begin(115200);
  sensor.begin();
  pinMode(pinD4, INPUT);  // ✅ NOW IT'S DECLARED

  Blynk.begin(auth, ssid, pass);
  timer.setInterval(1000L, sendSensor);  // Run every 1 second
}

void loop() {
  Blynk.run();
  timer.run();
}
