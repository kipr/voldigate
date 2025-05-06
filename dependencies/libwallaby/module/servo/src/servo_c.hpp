// motor_c.hpp
#ifndef _KIPR_MOTOR_SERVO_C_HPP_
#define _KIPR_MOTOR_SERVO_C_HPP_

#ifdef __cplusplus
extern "C" {
#endif

void enable_servo(int port);
void disable_servo(int port);
void disable_servos();  
void set_servo_position(int port, int position);
int get_servo_position(int port);
int get_servo_enabled(int port);

#ifdef __cplusplus
}
#endif

#endif



