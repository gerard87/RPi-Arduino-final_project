#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <linux/i2c-dev.h>
#include <sys/ioctl.h>
#include <fcntl.h>
#include <unistd.h>


int main(int argc, char** argv) {

  int ADDRESS=0x04;
  int val;
  int file;

  printf("I2C: Connecting\n");
  if ((file = open("/dev/i2c-1", O_RDWR)) < 0) {
    // The I2C bus: This is for V2 pi's. For V1 Model B you need i2c-0
    fprintf(stderr, "I2C: Failed to access /dev/i2c-1\n");
    exit(1);
  }

  printf("I2C: acquiring buss to 0x%x\n", ADDRESS);
  if (ioctl(file, I2C_SLAVE, ADDRESS) < 0) {
    fprintf(stderr, "I2C: Failed to acquire bus access/talk to slave 0x%x\n", ADDRESS);
    exit(1);
  }

  char buf[12];
  if (read(file, buf, 12) == 12) {
    int temp = (((buf[3]*256+buf[2])*256+buf[1]*256)+buf[0]);
    int hum = (((buf[7]*256+buf[6])*256+buf[5]*256)+buf[4]);
    int bpm = (((buf[11]*256+buf[10])*256+buf[9]*256)+buf[8]);


    printf("Temperature %d\n", temp);
    printf("Humidity %d\n", hum);
    printf("Heart rate bpm %d\n", bpm);

  }



}
