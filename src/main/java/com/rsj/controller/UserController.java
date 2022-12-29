package com.rsj.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.rsj.pojo.Result;
import com.rsj.pojo.User;
import com.rsj.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService service;

    @GetMapping("/username={username}")
    public Result checkUsername(@PathVariable String username) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, username);
        User user = service.getOne(queryWrapper);
        Integer code = user != null ? Code.SELECT_OK : Code.SELECT_ERR;
        String msg = user != null ? null : "查询失败！";
        boolean data = user != null;
        return new Result(data, code, msg);
    }

    @GetMapping("/qq={qq}")
    public Result checkQQ(@PathVariable String qq) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getQq, qq);
        User user = service.getOne(queryWrapper);
        Integer code = user != null ? Code.SELECT_OK : Code.SELECT_ERR;
        String msg = user != null ? null : "查询失败！";
        boolean data = user != null;
        return new Result(data, code, msg);
    }

    @PostMapping("/register")
    public Result register(@RequestBody User user) {
        boolean save = service.save(user);
        Integer code = save ? Code.ADD_OK : Code.ADD_ERR;
        String msg = save ? "注册成功！" : "注册失败！";
        return new Result(save, code, msg);
    }

    @PostMapping("/login")
    public Result login(@RequestBody User user) {
        User login = service.login(user);
        Integer code = login != null ? Code.LOGIN_OK : Code.LOGIN_ERR;
        String msg = login != null ? "登陆成功！" : "登录失败！";
        return new Result(login, code, msg);
    }
}
