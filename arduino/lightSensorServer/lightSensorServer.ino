#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <AsyncElegantOTA.h>


//data for connection to the net for time
//char* ssid = "SKYSAA2U";
//char* password = "Wwy7QKf37hCN";
const char* ssid = "Lights";
const char* password = "jjscd123";

IPAddress local_IP(192, 168, 1, 87);
IPAddress gateway(192, 168, 4, 9);
IPAddress subnet(255, 255, 255, 0);

//data for the operation of the webpage
String header;
unsigned long currentTime = millis();
unsigned long previousTime = 0;
const long timeoutTime = 2000;

WiFiServer server(81);
AsyncWebServer aServer(80);

//data for operation of the switch
const int ldrPin = A0;
const int OutputPin = D5;
const int LedPin = D0;
int currentLightLevel = 0;



void setup() {

  Serial.begin(9600);

  WiFi.mode(WIFI_STA);

  pinMode(LedPin, OUTPUT);
  digitalWrite(LedPin, HIGH);

  pinMode(OutputPin, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);

  pinMode(ldrPin, INPUT);


  SetupNet();
  server.begin();


  aServer.on("/", HTTP_GET, [](AsyncWebServerRequest * request) {
    String message = "Hi! I am the LightsServer.\nWifi: " + WiFi.SSID() + "\nIP: " + WiFi.localIP().toString() + "\nSignal Interference(less is better): " + WiFi.RSSI() + "\n\nhttp://" + WiFi.localIP().toString() + "/update";
    request->send(200, "text/plain", message);
  });
  AsyncElegantOTA.begin(&aServer);    // Start ElegantOTA
  aServer.begin();
  Serial.println("HTTP server started");
}



void loop() {
  AsyncElegantOTA.loop();
  WiFiClient client = server.available();
  if (client) {
    Serial.println("New Client.");
    while (client) {
      String message = client.readStringUntil('\n');    // receives the message from the client
      if (message == "ON") {
        Serial.println("TURNING ON");
        digitalWrite(OutputPin, HIGH);
      }

      if (message == "OFF") {
        Serial.println("TURNING OFF");
        digitalWrite(OutputPin, LOW);
      }

      if (message == "LEVEL") {
        Serial.println("GETTING LEVEL");
        client.print(getStrLevel());
        client.flush();
      }
    }
    Serial.println("Client Disconnected");
  }
}

void SetupNet() {
  //seting up private net for use
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Attempting to connect to: " + String(ssid));
    delay(2000);
  }
  Serial.println("\nConnected");
  Serial.print("IP: ");     Serial.println(WiFi.localIP());
  Serial.print("Subnet: "); Serial.println(WiFi.subnetMask());
  Serial.print("Gateway: "); Serial.println(WiFi.gatewayIP());
  Serial.print("SSID: "); Serial.println(WiFi.SSID());
  Serial.print("Signal: "); Serial.println(WiFi.RSSI());

}


int getLevel() {
  return analogRead(ldrPin);
}
String getStrLevel() {
  return (String)getLevel();
}
