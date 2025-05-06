// motor_c.hpp
#ifndef _KIPR_MOTOR_MOTOR_C_HPP_
#define _KIPR_MOTOR_MOTOR_C_HPP_

#ifdef __cplusplus
extern "C" {
#endif

int mav(int motor, int velocity);
void motor_power(int motor, int percent);
void motor(int motor, int percent);
void off(int motor);
void alloff();
int get_motor_goal_velocity(unsigned int motor);
int get_motor_position_counter(int motor);

#ifdef __cplusplus
}
#endif

#endif



