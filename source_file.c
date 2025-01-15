#include <stdio.h>
#include <kipr/wombat.h>
#include <servo_position.h>

int main()
{
  enable_servos();
  set_servo_position(0,1750);
  msleep(1000);

}
