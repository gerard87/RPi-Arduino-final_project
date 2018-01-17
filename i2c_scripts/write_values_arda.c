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

  if (argc == 1) {
    printf("Supply one or more commands to send to the Arduino\n");
    exit(1);
  }
 
  printf("I2C: Connecting\n");
  int file;
 
  if ((file = open("/dev/i2c-1", O_RDWR)) < 0) {
    fprintf(stderr, "I2C: Failed to access /dev/i2c-1\n");
    exit(1);
  }
 
  printf("I2C: acquiring buss to 0x%x\n", ADDRESS);
 
  if (ioctl(file, I2C_SLAVE, ADDRESS) < 0) {
    fprintf(stderr, "I2C: Failed to acquire bus access/talk to slave 0x%x\n", ADDRESS);
    exit(1);
  }
 
  int arg;
  unsigned char cmd[16];
  strcpy(cmd, "");
 
  for (arg = 1; arg < argc; arg++) {
    strcat(cmd, argv[arg]);
    printf("Sending to SLAVE 0x%x %s\n", ADDRESS, argv[arg]);
  }

  printf("%s\n", cmd);

  if (write(file, cmd, strlen(cmd)) == strlen(cmd)) {
        usleep(10000);
  }

}
