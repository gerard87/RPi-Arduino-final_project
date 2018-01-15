#include <DHT.h>
#include <Wire.h>

#define DHTPIN 2
#define DHTTYPE DHT11
#define SLAVE_ADDRESS 0x04

DHT dht(DHTPIN, DHTTYPE);

// Pulse sensor

int pulsePin = 3;                 // Pulse Sensor purple wire connected to analog pin 0
int blinkPin = 13;                // pin to blink led at each beat
int fadePin = 5;                  // pin to do fancy classy fading blink at each beat
int fadeRate = 0;                 // used to fade LED on with PWM on fadePin
// these variables are volatile because they are used during the interrupt service routine!
volatile int BPM = 0;                   // used to hold the pulse rate
volatile int Signal;                // holds the incoming raw data
volatile int IBI = 600;             // holds the time between beats, the Inter-Beat Interval
volatile boolean Pulse = false;     // true when pulse wave is high, false when it's low
volatile boolean QS = false;        // becomes true when Arduoino finds a beat.

int data = 0;
int temp = 0;
int hum = 0;

void setup() {
  Serial.begin(115200);

  dht.begin();

  pinMode(blinkPin,OUTPUT);
  pinMode(fadePin,OUTPUT);
  interruptSetup();

  // initialize i2c as slave
  Wire.begin(SLAVE_ADDRESS);
  // define callbacks for i2c communication
  Wire.onReceive(receiveData);
  Wire.onRequest(sendData);

}

void loop() {

  temp = dht.readTemperature();
  hum = dht.readHumidity();
  
  if (QS == true){ fadeRate = 255; QS = false; }
  ledFadeToBeat();

  /*Serial.print(temp);
  Serial.print(',');
  Serial.print(hum);
  Serial.print(',');
  Serial.print(BPM);
  Serial.println(",*");*/

  delay(100);

}

void ledFadeToBeat(){
    fadeRate -= 15;                         //  set LED fade value
    fadeRate = constrain(fadeRate,0,255);   //  keep LED fade value from going into negative numbers!
    analogWrite(fadePin,fadeRate);          //  fade LED
}

void receiveData(int byteCount){
 while(Wire.available()) {
  data = Wire.read();
  Serial.println(data);
  Serial.println("=====");
 }
}

void sendData(){

  Serial.print(temp);
  Serial.println("=====");
  send(temp);

  Serial.print(hum);
  Serial.println("=====");
  send(hum);

  Serial.print(BPM);
  Serial.println("=====");
  send(BPM);
   
}

void send(int value) {
  byte mask = 0xFF;
  
  byte toSend = value & mask;
  value = value >> 8;
  // 1st byte
  Wire.write(toSend);
  
  toSend = value & mask;
  value = value >> 8;
  //2nd byte
  Wire.write(toSend);
  
  toSend = value & mask;
  value = value >> 8;
  //3rd byte
  Wire.write(toSend);
  
  toSend = value & mask;
  //4th byte
  Wire.write(toSend);
}

