package com.rsj.service.Imp;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rsj.mapper.WriterMapper;
import com.rsj.pojo.Writer;
import com.rsj.service.WriterService;
import org.springframework.stereotype.Service;

@Service
public class WriterServiceImp extends ServiceImpl<WriterMapper, Writer> implements WriterService {
}
