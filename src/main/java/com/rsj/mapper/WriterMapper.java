package com.rsj.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.rsj.pojo.Writer;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface WriterMapper extends BaseMapper<Writer> {
}
