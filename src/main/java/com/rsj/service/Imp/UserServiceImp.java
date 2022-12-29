package com.rsj.service.Imp;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rsj.mapper.UserMapper;
import com.rsj.pojo.User;
import com.rsj.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public User login(User user) {
        String username = user.getUsername();
        String password = user.getPassword();

        LambdaQueryWrapper<User> checkQQ = new LambdaQueryWrapper<>();
        checkQQ.eq(User::getQq, username);
        User selectByQQ = this.getOne(checkQQ);

        if (selectByQQ != null) {
            if (selectByQQ.getPassword().equals(password)) {
                User result = new User();
                result.setUsername(selectByQQ.getUsername());
                result.setQq(username);
                return result;
            } else
                return null;
        } else {
            LambdaQueryWrapper<User> checkUsername = new LambdaQueryWrapper<>();
            checkQQ.eq(User::getUsername, username);
            User selectByUsername = this.getOne(checkUsername);

            if (selectByUsername != null) {
                if (selectByUsername.getPassword().equals(password)) {
                    User result = new User();
                    result.setUsername(username);
                    result.setQq(selectByUsername.getQq());
                    return result;
                } else
                    return null;
            } else
                return null;
        }
    }
}
