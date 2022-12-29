package com.rsj.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rsj.pojo.Result;
import com.rsj.pojo.Writer;
import com.rsj.service.WriterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/msg")
public class WriterController {
    @Value("${message-board.upload-path}")
    private String uploadPath;
    @Autowired
    private WriterService service;

    @Transactional
    @GetMapping("/page")
    public Result page(int page, int pageSize) {
        Page<Writer> pageInfo = new Page<>(page, pageSize);
        LambdaQueryWrapper<Writer> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(Writer::getFloor);
        service.page(pageInfo, wrapper);
        return new Result(pageInfo, Code.SELECT_OK, "列表读取成功！");
    }

    @Transactional
    @PostMapping
    public boolean save(@RequestBody Writer writer) {
        if (!"../img/huaji.png".equals(writer.getAvatar()))
            writer.setAvatar(writer.getAvatar() + "&spec=3");
        return service.save(writer);
    }

    @Transactional
    @PostMapping("/upload")
    public String upload(@RequestPart(name = "file", required = false) MultipartFile files) {
        File dir = new File(uploadPath);
        if (!dir.exists())
            dir.mkdirs();

        String fileName = null;
        try {
            String originalFileName = files.getOriginalFilename();
            if (originalFileName != null) {
                originalFileName = originalFileName.substring(originalFileName.lastIndexOf("."));

                fileName = UUID.randomUUID().toString() + originalFileName;
                files.transferTo(new File(uploadPath + fileName));
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return fileName;
    }
}
