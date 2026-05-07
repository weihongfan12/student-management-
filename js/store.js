/* js/store.js — 数据存储层（增强版） */

const Store = (() => {
  const STORAGE_KEY = 'elevenlabs_student_system';

  const DEFAULT_STUDENTS = [
    { id: 'S001', name: '张明', gender: '男', grade: '三年级', className: '3班', email: 'zhangming@school.edu', phone: '138-0000-0001', status: 'active', enrollmentDate: '2024-09-01', major: '计算机科学', address: '北京市海淀区中关村大街1号', birthDate: '2003-05-12', idNumber: '110108200305121234' },
    { id: 'S002', name: '李华', gender: '女', grade: '二年级', className: '2班', email: 'lihua@school.edu', phone: '138-0000-0002', status: 'active', enrollmentDate: '2024-09-01', major: '数学', address: '上海市浦东新区张江路88号', birthDate: '2004-08-23', idNumber: '310115200408231234' },
    { id: 'S003', name: '王伟', gender: '男', grade: '四年级', className: '1班', email: 'wangwei@school.edu', phone: '138-0000-0003', status: 'active', enrollmentDate: '2023-09-01', major: '物理学', address: '广州市天河区五山路381号', birthDate: '2002-11-03', idNumber: '440106200211031234' },
    { id: 'S004', name: '赵雪', gender: '女', grade: '一年级', className: '2班', email: 'zhaoxue@school.edu', phone: '138-0000-0004', status: 'active', enrollmentDate: '2025-09-01', major: '英语', address: '深圳市南山区科技园路10号', birthDate: '2005-02-14', idNumber: '440305200502141234' },
    { id: 'S005', name: '陈晨', gender: '男', grade: '三年级', className: '1班', email: 'chenchen@school.edu', phone: '138-0000-0005', status: 'inactive', enrollmentDate: '2024-09-01', major: '计算机科学', address: '成都市武侯区人民南路4段', birthDate: '2003-07-30', idNumber: '510107200307301234' },
    { id: 'S006', name: '刘芳', gender: '女', grade: '二年级', className: '1班', email: 'liufang@school.edu', phone: '138-0000-0006', status: 'active', enrollmentDate: '2024-09-01', major: '艺术设计', address: '杭州市西湖区文三路478号', birthDate: '2004-04-18', idNumber: '330106200404181234' },
    { id: 'S007', name: '孙浩', gender: '男', grade: '四年级', className: '2班', email: 'sunhao@school.edu', phone: '138-0000-0007', status: 'active', enrollmentDate: '2023-09-01', major: '体育教育', address: '武汉市洪山区珞瑜路1037号', birthDate: '2002-09-08', idNumber: '420111200209081234' },
    { id: 'S008', name: '周雨', gender: '女', grade: '一年级', className: '1班', email: 'zhouyu@school.edu', phone: '138-0000-0008', status: 'inactive', enrollmentDate: '2025-09-01', major: '音乐', address: '南京市鼓楼区汉口路22号', birthDate: '2005-12-25', idNumber: '320106200512251234' },
  ];

  /* 默认成绩数据 */
  const DEFAULT_GRADES = [
    { id: 'G001', studentId: 'S001', subject: '高等数学', score: 92, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G002', studentId: 'S001', subject: '大学英语', score: 85, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G003', studentId: 'S001', subject: '数据结构', score: 96, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G004', studentId: 'S001', subject: '计算机网络', score: 88, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G005', studentId: 'S002', subject: '高等数学', score: 98, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G006', studentId: 'S002', subject: '大学英语', score: 78, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G007', studentId: 'S002', subject: '线性代数', score: 95, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G008', studentId: 'S003', subject: '高等数学', score: 82, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G009', studentId: 'S003', subject: '大学物理', score: 94, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G010', studentId: 'S003', subject: '大学英语', score: 76, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G011', studentId: 'S004', subject: '大学英语', score: 95, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G012', studentId: 'S004', subject: '高等数学', score: 72, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G013', studentId: 'S005', subject: '高等数学', score: 65, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G014', studentId: 'S005', subject: '数据结构', score: 70, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G015', studentId: 'S006', subject: '艺术概论', score: 91, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G016', studentId: 'S006', subject: '大学英语', score: 83, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G017', studentId: 'S007', subject: '体育学概论', score: 88, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G018', studentId: 'S007', subject: '大学英语', score: 71, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G019', studentId: 'S008', subject: '乐理基础', score: 90, semester: '2024-2025-1', examType: '期末考试' },
    { id: 'G020', studentId: 'S008', subject: '大学英语', score: 68, semester: '2024-2025-1', examType: '期末考试' },
  ];

  let students = [];
  let grades = [];
  let logs = [];
  let nextId = 9;
  let nextGradeId = 21;

  /* ===== 持久化 ===== */

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        students = data.students || [];
        grades = data.grades || [];
        logs = data.logs || [];
        nextId = data.nextId || 1;
        nextGradeId = data.nextGradeId || 1;
      } else {
        students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
        grades = JSON.parse(JSON.stringify(DEFAULT_GRADES));
        logs = [];
        nextId = 9;
        nextGradeId = 21;
        save();
      }
    } catch (e) {
      students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
      grades = JSON.parse(JSON.stringify(DEFAULT_GRADES));
      logs = [];
      nextId = 9;
      nextGradeId = 21;
      save();
    }
    return students;
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ students, grades, logs, nextId, nextGradeId }));
  }

  /* ===== 操作日志 ===== */

  function addLog(action, detail) {
    var entry = {
      time: new Date().toISOString(),
      action: action,
      detail: detail,
    };
    logs.unshift(entry);
    if (logs.length > 100) logs.length = 100; // 最多保留100条
    save();
  }

  function getLogs(count) {
    return logs.slice(0, count || 20);
  }

  /* ===== 学生 CRUD ===== */

  function generateId() {
    const id = 'S' + String(nextId).padStart(3, '0');
    nextId++;
    return id;
  }

  function getAll() {
    return [...students];
  }

  function getById(id) {
    return students.find(s => s.id === id) || null;
  }

  function add(data) {
    const student = {
      id: generateId(),
      ...data,
      status: data.status || 'active',
      enrollmentDate: data.enrollmentDate || new Date().toISOString().split('T')[0],
    };
    students.push(student);
    addLog('添加学生', student.name + '（' + student.id + '）');
    save();
    return student;
  }

  function update(id, data) {
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) return null;
    students[idx] = { ...students[idx], ...data };
    addLog('编辑学生', students[idx].name + '（' + id + '）');
    save();
    return students[idx];
  }

  function remove(id) {
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) return false;
    var name = students[idx].name;
    students.splice(idx, 1);
    // 同时删除该学生的成绩
    grades = grades.filter(g => g.studentId !== id);
    addLog('删除学生', name + '（' + id + '）');
    save();
    return true;
  }

  /* 批量删除 */
  function removeBatch(ids) {
    var count = 0;
    ids.forEach(function(id) {
      var idx = students.findIndex(function(s) { return s.id === id; });
      if (idx !== -1) {
        students.splice(idx, 1);
        grades = grades.filter(function(g) { return g.studentId !== id; });
        count++;
      }
    });
    if (count > 0) {
      addLog('批量删除', '删除了 ' + count + ' 名学生');
      save();
    }
    return count;
  }

  /* 批量修改状态 */
  function updateStatusBatch(ids, status) {
    var count = 0;
    ids.forEach(function(id) {
      var idx = students.findIndex(function(s) { return s.id === id; });
      if (idx !== -1) {
        students[idx].status = status;
        count++;
      }
    });
    if (count > 0) {
      var statusText = status === 'active' ? '在读' : '休学';
      addLog('批量修改状态', '将 ' + count + ' 名学生状态设为「' + statusText + '」');
      save();
    }
    return count;
  }

  /* ===== 查询 & 排序 ===== */

  function query(opts) {
    opts = opts || {};
    var result = [...students];

    if (opts.search) {
      var q = opts.search.toLowerCase();
      result = result.filter(function(s) {
        return s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.phone && s.phone.includes(q));
      });
    }

    if (opts.grade && opts.grade !== 'all') {
      result = result.filter(function(s) { return s.grade === opts.grade; });
    }

    if (opts.status && opts.status !== 'all') {
      result = result.filter(function(s) { return s.status === opts.status; });
    }

    if (opts.major && opts.major !== 'all') {
      result = result.filter(function(s) { return s.major === opts.major; });
    }

    if (opts.gender && opts.gender !== 'all') {
      result = result.filter(function(s) { return s.gender === opts.gender; });
    }

    /* 排序 */
    if (opts.sortBy) {
      var dir = opts.sortDir === 'desc' ? -1 : 1;
      var gradeOrder = { '一年级': 1, '二年级': 2, '三年级': 3, '四年级': 4 };
      result.sort(function(a, b) {
        var va = a[opts.sortBy] || '';
        var vb = b[opts.sortBy] || '';
        if (opts.sortBy === 'grade') {
          va = gradeOrder[va] || 0;
          vb = gradeOrder[vb] || 0;
          return (va - vb) * dir;
        }
        if (typeof va === 'string') {
          return va.localeCompare(vb, 'zh-CN') * dir;
        }
        return (va > vb ? 1 : va < vb ? -1 : 0) * dir;
      });
    }

    return result;
  }

  function getStats() {
    var gradeCount = {};
    var majorCount = {};
    var genderCount = { '男': 0, '女': 0 };
    students.forEach(function(s) {
      gradeCount[s.grade] = (gradeCount[s.grade] || 0) + 1;
      majorCount[s.major] = (majorCount[s.major] || 0) + 1;
      if (genderCount[s.gender] !== undefined) genderCount[s.gender]++;
    });
    return {
      total: students.length,
      active: students.filter(function(s) { return s.status === 'active'; }).length,
      inactive: students.filter(function(s) { return s.status === 'inactive'; }).length,
      grades: [...new Set(students.map(function(s) { return s.grade; }))],
      majors: [...new Set(students.map(function(s) { return s.major; }))],
      gradeCount: gradeCount,
      majorCount: majorCount,
      genderCount: genderCount,
    };
  }

  /* ===== 成绩 CRUD ===== */

  function generateGradeId() {
    var id = 'G' + String(nextGradeId).padStart(3, '0');
    nextGradeId++;
    return id;
  }

  function getGradesByStudent(studentId) {
    return grades.filter(function(g) { return g.studentId === studentId; });
  }

  function getAllGrades() {
    return [...grades];
  }

  function addGrade(data) {
    var record = {
      id: generateGradeId(),
      studentId: data.studentId,
      subject: data.subject,
      score: parseFloat(data.score),
      semester: data.semester || '2024-2025-1',
      examType: data.examType || '期末考试',
    };
    grades.push(record);
    var student = getById(data.studentId);
    addLog('录入成绩', (student ? student.name : data.studentId) + ' — ' + data.subject + '：' + data.score + '分');
    save();
    return record;
  }

  function updateGrade(gradeId, data) {
    var idx = grades.findIndex(function(g) { return g.id === gradeId; });
    if (idx === -1) return null;
    grades[idx] = { ...grades[idx], ...data };
    if (data.score !== undefined) grades[idx].score = parseFloat(data.score);
    save();
    return grades[idx];
  }

  function removeGrade(gradeId) {
    var idx = grades.findIndex(function(g) { return g.id === gradeId; });
    if (idx === -1) return false;
    var g = grades[idx];
    var student = getById(g.studentId);
    grades.splice(idx, 1);
    addLog('删除成绩', (student ? student.name : g.studentId) + ' — ' + g.subject);
    save();
    return true;
  }

  function getGradeStats() {
    var subjectStats = {};
    grades.forEach(function(g) {
      if (!subjectStats[g.subject]) {
        subjectStats[g.subject] = { total: 0, count: 0, max: 0, min: 100 };
      }
      subjectStats[g.subject].total += g.score;
      subjectStats[g.subject].count++;
      if (g.score > subjectStats[g.subject].max) subjectStats[g.subject].max = g.score;
      if (g.score < subjectStats[g.subject].min) subjectStats[g.subject].min = g.score;
    });
    Object.keys(subjectStats).forEach(function(k) {
      subjectStats[k].avg = Math.round(subjectStats[k].total / subjectStats[k].count * 10) / 10;
    });
    return subjectStats;
  }

  /* 成绩排名：按总分 */
  function getStudentRanking() {
    var studentScores = {};
    grades.forEach(function(g) {
      if (!studentScores[g.studentId]) {
        studentScores[g.studentId] = { total: 0, count: 0 };
      }
      studentScores[g.studentId].total += g.score;
      studentScores[g.studentId].count++;
    });
    var ranking = [];
    Object.keys(studentScores).forEach(function(sid) {
      var student = getById(sid);
      if (student) {
        ranking.push({
          student: student,
          totalScore: studentScores[sid].total,
          avgScore: Math.round(studentScores[sid].total / studentScores[sid].count * 10) / 10,
          subjectCount: studentScores[sid].count,
        });
      }
    });
    ranking.sort(function(a, b) { return b.totalScore - a.totalScore; });
    return ranking;
  }

  /* ===== 数据导出 ===== */

  function exportCSV() {
    var headers = ['学号', '姓名', '性别', '年级', '班级', '专业', '邮箱', '电话', '状态', '入学日期', '地址', '出生日期'];
    var rows = students.map(function(s) {
      return [
        s.id, s.name, s.gender, s.grade, s.className, s.major,
        s.email, s.phone, s.status === 'active' ? '在读' : '休学',
        s.enrollmentDate, s.address || '', s.birthDate || '',
      ].map(function(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(',');
    });
    var csv = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
    addLog('导出数据', '导出 CSV 文件，共 ' + students.length + ' 条记录');
    save();
    return csv;
  }

  function exportJSON() {
    var data = { students: students, grades: grades, nextId: nextId, nextGradeId: nextGradeId };
    addLog('导出数据', '导出 JSON 备份');
    save();
    return JSON.stringify(data, null, 2);
  }

  function importJSON(jsonStr) {
    try {
      var data = JSON.parse(jsonStr);
      if (!data.students || !Array.isArray(data.students)) {
        return { success: false, message: '无效的数据格式' };
      }
      students = data.students;
      if (data.grades) grades = data.grades;
      if (data.nextId) nextId = data.nextId;
      if (data.nextGradeId) nextGradeId = data.nextGradeId;
      addLog('导入数据', '从 JSON 导入 ' + students.length + ' 条学生记录');
      save();
      return { success: true, message: '成功导入 ' + students.length + ' 条学生记录' };
    } catch (e) {
      return { success: false, message: '解析失败：' + e.message };
    }
  }

  /* ===== 数据验证 ===== */

  function validate(data, editId) {
    var errors = [];
    if (!data.name || !data.name.trim()) errors.push('姓名不能为空');
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('邮箱格式不正确');
    if (data.phone && !/^1[3-9]\d{1}-\d{4}-\d{4}$|^1[3-9]\d{9}$/.test(data.phone.replace(/-/g, ''))) {
      // 宽松的电话验证 — 允许 138-xxxx-xxxx 或 13800000000
      if (data.phone.replace(/-/g, '').length < 11) errors.push('手机号格式不正确');
    }
    return errors;
  }

  /* ===== 重置为默认数据 ===== */

  function resetToDefault() {
    students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
    grades = JSON.parse(JSON.stringify(DEFAULT_GRADES));
    logs = [];
    nextId = 9;
    nextGradeId = 21;
    addLog('重置数据', '已恢复为默认示例数据');
    save();
  }

  return {
    load: load,
    getAll: getAll,
    getById: getById,
    add: add,
    update: update,
    remove: remove,
    removeBatch: removeBatch,
    updateStatusBatch: updateStatusBatch,
    query: query,
    getStats: getStats,
    validate: validate,
    // 成绩
    getGradesByStudent: getGradesByStudent,
    getAllGrades: getAllGrades,
    addGrade: addGrade,
    updateGrade: updateGrade,
    removeGrade: removeGrade,
    getGradeStats: getGradeStats,
    getStudentRanking: getStudentRanking,
    // 导入导出
    exportCSV: exportCSV,
    exportJSON: exportJSON,
    importJSON: importJSON,
    // 日志
    getLogs: getLogs,
    // 重置
    resetToDefault: resetToDefault,
  };
})();