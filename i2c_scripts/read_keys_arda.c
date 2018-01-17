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
 
  int ADDRESS=0x05;
  int val;
 
  //printf("I2C: Connecting\n");
  int file;
 
  if ((file = open("/dev/i2c-1", O_RDWR)) < 0) {
    //fprintf(stderr, "I2C: Failed to access /dev/i2c-1\n");
    exit(1);
  }
 
  //printf("I2C: acquiring buss to 0x%x\n", ADDRESS);
 
  if (ioctl(file, I2C_SLAVE, ADDRESS) < 0) {
    //fprintf(stderr, "I2C: Failed to acquire bus access/talk to slave 0x%x\n", ADDRESS);
    exit(1);
  }

  char buf[4];
  if (read(file, buf, 4) == 4) {
     int temp = (((buf[3]*256+buf[2])*256+buf[1]*256)+buf[0]);
     printf("%d", temp);
  }

}
