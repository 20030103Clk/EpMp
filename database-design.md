# EPMP项目数据库表设计

## 1. 项目概述
EPMP（Enterprise Production Management Platform）企业生产管理平台，用于管理企业的生产计划、执行、质量管理等核心业务流程。

## 2. 数据库设计原则
- 遵循数据库设计范式（1NF、2NF、3NF）
- 使用适当的数据类型，确保数据完整性和性能
- 建立合理的索引，优化查询性能
- 设计清晰的表关系，便于数据关联和分析
- 考虑系统的扩展性，便于未来功能扩展

## 3. 表结构设计

### 3.1 用户表（users）
用于存储系统用户信息

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 用户ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名 |
| password | VARCHAR(100) | NOT NULL | 密码（加密存储） |
| real_name | VARCHAR(50) | NOT NULL | 真实姓名 |
| role | VARCHAR(20) | NOT NULL | 角色（admin/production/quality） |
| department | VARCHAR(50) | NOT NULL | 所属部门 |
| email | VARCHAR(100) | UNIQUE | 邮箱 |
| phone | VARCHAR(20) | UNIQUE | 电话 |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| status | TINYINT | NOT NULL DEFAULT 1 | 状态（1:启用 0:禁用） |

### 3.2 产品表（products）
用于存储产品信息

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 产品ID |
| product_code | VARCHAR(50) | UNIQUE, NOT NULL | 产品编码 |
| product_name | VARCHAR(100) | NOT NULL | 产品名称 |
| specification | VARCHAR(200) | NOT NULL | 产品规格 |
| unit | VARCHAR(20) | NOT NULL | 计量单位 |
| category | VARCHAR(50) | NOT NULL | 产品分类 |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| status | TINYINT | NOT NULL DEFAULT 1 | 状态（1:启用 0:禁用） |

### 3.3 生产计划表（production_plans）
用于存储生产计划信息

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 计划ID |
| plan_code | VARCHAR(50) | UNIQUE, NOT NULL | 计划编号 |
| product_id | INT | NOT NULL, FOREIGN KEY REFERENCES products(id) | 产品ID |
| plan_quantity | INT | NOT NULL | 计划数量 |
| actual_quantity | INT | NOT NULL DEFAULT 0 | 实际完成数量 |
| start_date | DATE | NOT NULL | 开始日期 |
| end_date | DATE | NOT NULL | 结束日期 |
| status | VARCHAR(20) | NOT NULL DEFAULT 'pending' | 状态（pending:待生产 processing:生产中 completed:已完成） |
| progress | INT | NOT NULL DEFAULT 0 | 生产进度（0-100） |
| created_by | INT | NOT NULL, FOREIGN KEY REFERENCES users(id) | 创建人 |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| remark | TEXT | | 备注 |

### 3.4 生产任务表（production_tasks）
用于存储生产任务信息，每个生产计划可分解为多个生产任务

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 任务ID |
| task_code | VARCHAR(50) | UNIQUE, NOT NULL | 任务编号 |
| plan_id | INT | NOT NULL, FOREIGN KEY REFERENCES production_plans(id) | 所属计划ID |
| product_id | INT | NOT NULL, FOREIGN KEY REFERENCES products(id) | 产品ID |
| task_quantity | INT | NOT NULL | 任务数量 |
| completed_quantity | INT | NOT NULL DEFAULT 0 | 已完成数量 |
| start_time | DATETIME | | 开始时间 |
| end_time | DATETIME | | 结束时间 |
| status | VARCHAR(20) | NOT NULL DEFAULT 'pending' | 状态（pending:待执行 processing:执行中 completed:已完成） |
| assigned_to | INT | FOREIGN KEY REFERENCES users(id) | 分配人 |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| remark | TEXT | | 备注 |

### 3.5 生产执行记录表（production_execution）
用于记录生产执行过程中的详细数据

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 执行记录ID |
| task_id | INT | NOT NULL, FOREIGN KEY REFERENCES production_tasks(id) | 所属任务ID |
| product_id | INT | NOT NULL, FOREIGN KEY REFERENCES products(id) | 产品ID |
| operator_id | INT | NOT NULL, FOREIGN KEY REFERENCES users(id) | 操作人 |
| production_date | DATE | NOT NULL | 生产日期 |
| shift | VARCHAR(20) | NOT NULL | 班次（早班/中班/晚班） |
| output_quantity | INT | NOT NULL | 产出数量 |
| reject_quantity | INT | NOT NULL DEFAULT 0 | 不合格数量 |
| start_time | DATETIME | NOT NULL | 开始时间 |
| end_time | DATETIME | NOT NULL | 结束时间 |
| equipment_id | INT | NOT NULL, FOREIGN KEY REFERENCES equipment(id) | 使用设备ID |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| remark | TEXT | | 备注 |

### 3.6 设备表（equipment）
用于存储生产设备信息

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 设备ID |
| equipment_code | VARCHAR(50) | UNIQUE, NOT NULL | 设备编号 |
| equipment_name | VARCHAR(100) | NOT NULL | 设备名称 |
| equipment_type | VARCHAR(50) | NOT NULL | 设备类型 |
| model | VARCHAR(50) | NOT NULL | 设备型号 |
| status | VARCHAR(20) | NOT NULL DEFAULT 'idle' | 状态（idle:空闲 running:运行 fault:故障 maintenance:维护） |
| location | VARCHAR(100) | NOT NULL | 设备位置 |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| remark | TEXT | | 备注 |

### 3.7 设备状态记录表（equipment_status）
用于记录设备状态变化历史

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 记录ID |
| equipment_id | INT | NOT NULL, FOREIGN KEY REFERENCES equipment(id) | 设备ID |
| status | VARCHAR(20) | NOT NULL | 状态（idle:空闲 running:运行 fault:故障 maintenance:维护） |
| change_time | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | 状态变化时间 |
| operator_id | INT | NOT NULL, FOREIGN KEY REFERENCES users(id) | 操作人 |
| reason | TEXT | | 状态变化原因 |
| remark | TEXT | | 备注 |

### 3.8 质检记录表（quality_inspection）
用于记录产品质量检测信息

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 质检ID |
| inspection_code | VARCHAR(50) | UNIQUE, NOT NULL | 质检编号 |
| product_id | INT | NOT NULL, FOREIGN KEY REFERENCES products(id) | 产品ID |
| task_id | INT | FOREIGN KEY REFERENCES production_tasks(id) | 所属任务ID |
| inspection_quantity | INT | NOT NULL | 检测数量 |
| pass_quantity | INT | NOT NULL | 合格数量 |
| reject_quantity | INT | NOT NULL | 不合格数量 |
| inspection_date | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | 检测时间 |
| inspector_id | INT | NOT NULL, FOREIGN KEY REFERENCES users(id) | 检测人 |
| result | VARCHAR(20) | NOT NULL | 检测结果（pass:合格 fail:不合格） |
| inspection_items | JSON | NOT NULL | 检测项目（JSON格式） |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| remark | TEXT | | 备注 |

### 3.9 质量问题表（quality_issues）
用于记录产品质量问题

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 问题ID |
| issue_code | VARCHAR(50) | UNIQUE, NOT NULL | 问题编号 |
| inspection_id | INT | NOT NULL, FOREIGN KEY REFERENCES quality_inspection(id) | 关联质检ID |
| product_id | INT | NOT NULL, FOREIGN KEY REFERENCES products(id) | 产品ID |
| issue_type | VARCHAR(50) | NOT NULL | 问题类型 |
| issue_description | TEXT | NOT NULL | 问题描述 |
| severity | VARCHAR(20) | NOT NULL | 严重程度（minor:轻微 moderate:中等 major:严重） |
| solution | TEXT | | 解决方案 |
| status | VARCHAR(20) | NOT NULL DEFAULT 'pending' | 处理状态（pending:待处理 resolved:已解决） |
| reported_by | INT | NOT NULL, FOREIGN KEY REFERENCES users(id) | 报告人 |
| resolved_by | INT | FOREIGN KEY REFERENCES users(id) | 解决人 |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| resolved_at | DATETIME | | 解决时间 |
| remark | TEXT | | 备注 |

### 3.10 生产记录表（production_records）
用于存储每日生产汇总记录

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 记录ID |
| record_date | DATE | NOT NULL | 记录日期 |
| shift | VARCHAR(20) | NOT NULL | 班次 |
| product_id | INT | NOT NULL, FOREIGN KEY REFERENCES products(id) | 产品ID |
| plan_quantity | INT | NOT NULL | 计划数量 |
| actual_quantity | INT | NOT NULL | 实际数量 |
| pass_quantity | INT | NOT NULL | 合格数量 |
| reject_quantity | INT | NOT NULL | 不合格数量 |
| pass_rate | DECIMAL(5,2) | NOT NULL | 合格率 |
| created_at | DATETIME | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| created_by | INT | NOT NULL, FOREIGN KEY REFERENCES users(id) | 创建人 |
| remark | TEXT | | 备注 |

## 4. 表关系图

```
users          production_plans   products
  |                   |               |
  |                   |               |
  |                   |               |
  |----> production_tasks -----------|  
  |         |           |             |
  |         |           |             |
  |         |           |             |
  |         |           |             |
  |         |           v             v
  |         |       quality_inspection
  |         |           |         |
  |         |           |         |
  |         v           v         v
  |----> production_execution  quality_issues
  |         |
  |         |
  v         v
users   equipment <-------- equipment_status
```

## 5. 索引设计

### 5.1 生产计划表索引
- `idx_plan_status` (status)
- `idx_product_id` (product_id)
- `idx_start_end_date` (start_date, end_date)

### 5.2 生产任务表索引
- `idx_task_status` (status)
- `idx_plan_id` (plan_id)
- `idx_product_id` (product_id)

### 5.3 生产执行记录表索引
- `idx_production_date` (production_date)
- `idx_task_id` (task_id)
- `idx_equipment_id` (equipment_id)
- `idx_operator_id` (operator_id)

### 5.4 质检记录表索引
- `idx_inspection_date` (inspection_date)
- `idx_product_id` (product_id)
- `idx_inspector_id` (inspector_id)
- `idx_result` (result)

### 5.5 设备表索引
- `idx_equipment_status` (status)
- `idx_equipment_type` (equipment_type)

### 5.6 设备状态记录表索引
- `idx_equipment_id` (equipment_id)
- `idx_change_time` (change_time)

## 6. 示例SQL查询

### 6.1 查询生产计划列表
```sql
SELECT 
    pp.id, pp.plan_code, p.product_name, pp.plan_quantity, 
    pp.actual_quantity, pp.status, pp.progress, 
    pp.start_date, pp.end_date, u.real_name as created_by
FROM production_plans pp
JOIN products p ON pp.product_id = p.id
JOIN users u ON pp.created_by = u.id
WHERE pp.status = 'processing'
ORDER BY pp.created_at DESC;
```

### 6.2 查询质检记录
```sql
SELECT 
    qi.id, qi.inspection_code, p.product_name, 
    qi.inspection_quantity, qi.pass_quantity, 
    qi.reject_quantity, qi.result, 
    qi.inspection_date, u.real_name as inspector
FROM quality_inspection qi
JOIN products p ON qi.product_id = p.id
JOIN users u ON qi.inspector_id = u.id
WHERE qi.inspection_date BETWEEN '2026-01-01' AND '2026-01-31'
ORDER BY qi.inspection_date DESC;
```

### 6.3 查询设备状态
```sql
SELECT 
    e.id, e.equipment_code, e.equipment_name, 
    e.equipment_type, e.status, e.location
FROM equipment e
ORDER BY e.status;
```

### 6.4 查询生产日报
```sql
SELECT 
    pr.record_date, pr.shift, p.product_name, 
    pr.plan_quantity, pr.actual_quantity, 
    pr.pass_quantity, pr.reject_quantity, 
    pr.pass_rate
FROM production_records pr
JOIN products p ON pr.product_id = p.id
WHERE pr.record_date = CURDATE()
ORDER BY pr.shift;
```

## 7. 数据库配置建议

### 7.1 存储引擎
- 建议使用 InnoDB 存储引擎，支持事务和外键约束

### 7.2 字符集
- 数据库字符集：utf8mb4
- 排序规则：utf8mb4_unicode_ci

### 7.3 事务隔离级别
- 建议使用 REPEATABLE READ 隔离级别，保证数据一致性

## 8. 数据迁移和备份策略

### 8.1 数据迁移
- 使用工具如 Navicat、MySQL Workbench 或自定义脚本进行数据迁移
- 迁移前需进行数据完整性检查

### 8.2 备份策略
- 每日全量备份
- 每小时增量备份
- 重要业务数据实时备份
- 定期进行备份恢复测试

## 9. 性能优化建议

1. **合理设计索引**：根据查询需求创建适当的索引，避免过度索引
2. **分区表**：对于大数据量的表（如生产执行记录表、设备状态记录表），可考虑按时间分区
3. **查询优化**：避免 SELECT *，只查询需要的字段；使用 JOIN 替代子查询；合理使用 LIMIT
4. **缓存机制**：对频繁查询的数据使用缓存（如 Redis）
5. **定期清理**：定期清理过期数据，优化表空间
6. **硬件优化**：使用高性能磁盘（SSD），合理配置内存和CPU

## 10. 安全建议

1. **用户权限管理**：根据角色分配最小权限
2. **密码加密**：使用强大的加密算法存储密码（如 bcrypt、Argon2）
3. **防止SQL注入**：使用参数化查询或ORM框架
4. **数据加密**：对敏感数据进行加密存储
5. **定期安全审计**：定期检查数据库日志，发现异常访问
6. **网络安全**：配置防火墙，限制数据库访问IP
7. **备份安全**：备份数据进行加密存储，定期测试恢复

## 11. 总结

本数据库设计涵盖了EPMP系统的核心业务流程，包括用户管理、产品管理、生产计划、生产执行、设备管理和质量管理等功能。设计遵循了数据库设计原则，建立了合理的表关系和索引，便于系统的开发和维护。

随着系统的运行和业务需求的变化，数据库设计可能需要进一步优化和扩展。建议定期进行数据库性能评估和优化，确保系统的高效运行。