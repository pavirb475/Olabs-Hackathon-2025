const int pinD4 = 4;  // GPIO4 (D4) on ESP32

void setup() {
    Serial.begin(115200);  // Start serial communication at 115200 baud
    pinMode(pinD4, INPUT); // Set D4 as an input pin
}

void loop() {
    int sensorValue = analogRead(pinD4); // Read analog signal from D4
    Serial.print("D4 Analog Value: ");
    Serial.println(sensorValue); // Print the value to Serial Monitor
    delay(500); // Delay to avoid flooding the Serial Monitor
}
