package com.rsj.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.rsj.pojo.User;

public interface UserService extends IService<User> {
    User login(User user);
}
