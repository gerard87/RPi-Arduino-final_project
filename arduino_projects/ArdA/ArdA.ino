/*
 * This is the LCD consumer Arduino
 * It receives data from the Raspberry and shows them in the LCD
 */

#include <Wire.h>
#include <LiquidCrystal.h>
#define RIGHT 0
#define UP 1
#define DOWN 2
#define LEFT 3
#define SELECT 4
#define NONE 5

 
#define SLAVE_ADDRESS 0x05
int data = 0;
 
int adc_key_val[5]={50,200,400,600,800};

LiquidCrystal lcd(8, 9, 4, 5, 6, 7);
 
void setup() {
  Serial.begin(9600);
  
 // initialize i2c as slave
 Wire.begin(SLAVE_ADDRESS);
 
 // define callbacks for i2c communication
 Wire.onReceive(receiveData);
 Wire.onRequest(sendData);

 lcd.begin(16, 2);
 lcd.print("Press any button");
 lcd.setCursor(0,1);
 lcd.print("or read from web");
}
 
void loop() {
 delay(100);
}
 
// callback for received data
void receiveData(int byteCount){
  
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Temp:");
  
  while(Wire.available()) {
    data = Wire.read();
    Serial.println((char)data);

    if((char)data == ',') { 
      lcd.print(" Hum:"); 
    } else if ((char)data == '.') {
      lcd.setCursor(0,1);
      lcd.print("BPM:");
    } else {
      lcd.print((char)data);
    }
  }
  lcd.print(" ");
  
  Serial.println("=====");

}
 
// callback for sending data
void sendData(){

 byte mask = 0xFF;
 int value = analogRead(A0);
 
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
