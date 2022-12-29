package com.rsj.pojo;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("tb_writers")
public class Writer {
    private Integer id;
    private int floor;
    private Long qq;
    private String username;
    private String avatar;
    private String writeTime;
    private String message;
}