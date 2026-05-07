/* js/components.js — UI 组件渲染（增强版） */

const UI = (() => {

  /* ===== Toast 通知 ===== */

  function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    var toast = document.createElement('div');
    toast.className = 'toast' + (type ? ' toast-' + type : '');
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(function() { toast.remove(); }, 300);
    }, 2500);
  }

  /* ===== 模态框 ===== */

  function openModal(contentHTML, wide) {
    var overlay = document.getElementById('modalOverlay');
    overlay.innerHTML = '<div class="modal' + (wide ? ' modal-wide' : '') + '">' + contentHTML + '</div>';
    overlay.style.display = 'flex';

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });

    var escHandler = function(e) {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', escHandler);
    overlay._escHandler = escHandler;

    var firstInput = overlay.querySelector('input, select, button');
    if (firstInput) setTimeout(function() { firstInput.focus(); }, 100);
  }

  function closeModal() {
    var overlay = document.getElementById('modalOverlay');
    overlay.style.display = 'none';
    overlay.innerHTML = '';
    if (overlay._escHandler) {
      document.removeEventListener('keydown', overlay._escHandler);
      delete overlay._escHandler;
    }
  }

  /* ===== 确认对话框 ===== */

  function confirmDialog(message, hint, onConfirm, confirmText) {
    openModal(
      '<div class="confirm-dialog">' +
        '<div class="confirm-dialog-icon">⚠</div>' +
        '<div class="confirm-dialog-text">' + message + '</div>' +
        '<div class="confirm-dialog-hint">' + hint + '</div>' +
        '<div class="modal-actions">' +
          '<button class="btn-ghost btn-sm" id="confirmCancelBtn">取消</button>' +
          '<button class="btn-primary btn-sm" id="confirmOkBtn">' + (confirmText || '确认删除') + '</button>' +
        '</div>' +
      '</div>'
    );
    document.getElementById('confirmCancelBtn').addEventListener('click', function() { closeModal(); });
    document.getElementById('confirmOkBtn').addEventListener('click', function() {
      onConfirm();
      closeModal();
    });
  }

  /* ===== 学生表单 (添加/编辑) ===== */

  function studentFormHTML(student) {
    var isEdit = !!student;
    var title = isEdit ? '编辑学生信息' : '添加学生';
    var btnText = isEdit ? '保存修改' : '添加';

    function val(name) {
      if (isEdit && student[name]) return student[name];
      return '';
    }

    function sel(name, v) {
      if (isEdit && student[name] === v) return ' selected';
      return '';
    }

    return (
      '<div class="modal-title">' + title + '</div>' +
      '<form id="studentForm" onsubmit="return false;">' +
        '<div class="form-row">' +
          '<div class="form-group">' +
            '<label class="form-label">姓名 <span class="required-mark">*</span></label>' +
            '<input class="input-contained" name="name" value="' + val('name') + '" required placeholder="请输入姓名">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">性别</label>' +
            '<select class="input-contained" name="gender">' +
              '<option value="男"' + sel('gender', '男') + '>男</option>' +
              '<option value="女"' + sel('gender', '女') + '>女</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group">' +
            '<label class="form-label">年级</label>' +
            '<select class="input-contained" name="grade">' +
              '<option value="一年级"' + sel('grade', '一年级') + '>一年级</option>' +
              '<option value="二年级"' + sel('grade', '二年级') + '>二年级</option>' +
              '<option value="三年级"' + sel('grade', '三年级') + '>三年级</option>' +
              '<option value="四年级"' + sel('grade', '四年级') + '>四年级</option>' +
            '</select>' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">班级</label>' +
            '<select class="input-contained" name="className">' +
              '<option value="1班"' + sel('className', '1班') + '>1班</option>' +
              '<option value="2班"' + sel('className', '2班') + '>2班</option>' +
              '<option value="3班"' + sel('className', '3班') + '>3班</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group">' +
            '<label class="form-label">专业</label>' +
            '<input class="input-contained" name="major" value="' + val('major') + '" placeholder="请输入专业">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">状态</label>' +
            '<select class="input-contained" name="status">' +
              '<option value="active"' + sel('status', 'active') + '>在读</option>' +
              '<option value="inactive"' + sel('status', 'inactive') + '>休学</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group">' +
            '<label class="form-label">邮箱</label>' +
            '<input class="input-contained" name="email" type="email" value="' + val('email') + '" placeholder="email@school.edu">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">电话</label>' +
            '<input class="input-contained" name="phone" value="' + val('phone') + '" placeholder="138-xxxx-xxxx">' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group">' +
            '<label class="form-label">出生日期</label>' +
            '<input class="input-contained" name="birthDate" type="date" value="' + val('birthDate') + '">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">入学日期</label>' +
            '<input class="input-contained" name="enrollmentDate" type="date" value="' + val('enrollmentDate') + '">' +
          '</div>' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">家庭住址</label>' +
          '<input class="input-contained" name="address" value="' + val('address') + '" placeholder="请输入家庭住址">' +
        '</div>' +
        '<div id="formErrors" class="form-errors"></div>' +
      '</form>' +
      '<div class="modal-actions">' +
        '<button class="btn-ghost btn-sm" id="formCancelBtn">取消</button>' +
        '<button class="btn-primary btn-sm" id="formSubmitBtn">' + btnText + '</button>' +
      '</div>'
    );
  }

  /* ===== 学生详情 ===== */

  function studentDetailHTML(student) {
    var statusMap = { active: '在读', inactive: '休学' };
    var statusClass = student.status === 'active' ? 'badge-active' : 'badge-warning';
    var initial = student.name.charAt(0);

    /* 获取该学生的成绩 */
    var studentGrades = Store.getGradesByStudent(student.id);
    var gradesHTML = '';
    if (studentGrades.length > 0) {
      var totalScore = 0;
      var gradesTableRows = '';
      studentGrades.forEach(function(g) {
        totalScore += g.score;
        var scoreClass = g.score >= 90 ? 'score-excellent' : g.score >= 60 ? 'score-pass' : 'score-fail';
        gradesTableRows +=
          '<tr>' +
            '<td>' + g.subject + '</td>' +
            '<td><span class="' + scoreClass + '">' + g.score + '</span></td>' +
            '<td>' + g.semester + '</td>' +
          '</tr>';
      });
      var avgScore = Math.round(totalScore / studentGrades.length * 10) / 10;
      gradesHTML =
        '<div class="detail-section">' +
          '<div class="detail-section-title">成绩信息</div>' +
          '<table class="data-table mini-table">' +
            '<thead><tr><th>科目</th><th>成绩</th><th>学期</th></tr></thead>' +
            '<tbody>' + gradesTableRows + '</tbody>' +
          '</table>' +
          '<div class="grade-summary">' +
            '<span>共 ' + studentGrades.length + ' 科</span>' +
            '<span>总分 ' + totalScore + '</span>' +
            '<span>均分 ' + avgScore + '</span>' +
          '</div>' +
        '</div>';
    }

    return (
      '<div class="detail-panel">' +
        '<div class="detail-panel-header">' +
          '<div class="detail-panel-avatar">' + initial + '</div>' +
          '<div class="detail-panel-info">' +
            '<h2>' + student.name + '</h2>' +
            '<div class="detail-panel-meta">' +
              '<span class="badge ' + statusClass + '">' + statusMap[student.status] + '</span>' +
              '<span style="margin-left:8px">' + student.id + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="detail-panel-body">' +
          '<div><div class="detail-field-label">性别</div><div class="detail-field-value">' + student.gender + '</div></div>' +
          '<div><div class="detail-field-label">年级</div><div class="detail-field-value">' + student.grade + '</div></div>' +
          '<div><div class="detail-field-label">班级</div><div class="detail-field-value">' + student.className + '</div></div>' +
          '<div><div class="detail-field-label">专业</div><div class="detail-field-value">' + student.major + '</div></div>' +
          '<div><div class="detail-field-label">邮箱</div><div class="detail-field-value">' + student.email + '</div></div>' +
          '<div><div class="detail-field-label">电话</div><div class="detail-field-value">' + student.phone + '</div></div>' +
          '<div><div class="detail-field-label">入学日期</div><div class="detail-field-value">' + student.enrollmentDate + '</div></div>' +
          '<div><div class="detail-field-label">出生日期</div><div class="detail-field-value">' + (student.birthDate || '—') + '</div></div>' +
          '<div style="grid-column:1/-1"><div class="detail-field-label">家庭住址</div><div class="detail-field-value">' + (student.address || '—') + '</div></div>' +
        '</div>' +
        gradesHTML +
        '<div class="modal-actions" style="margin-top:24px;border-top:1px solid var(--color-chalk);padding-top:16px">' +
          '<button class="btn-ghost btn-sm" id="detailCloseBtn">关闭</button>' +
          '<button class="btn-primary btn-sm" id="detailEditBtn">编辑</button>' +
          '<button class="btn-ghost btn-sm" id="detailDeleteBtn" style="color:#000">删除</button>' +
        '</div>' +
      '</div>'
    );
  }

  /* ===== 渲染学生卡片 ===== */

  function renderStudentCard(student, showCheckbox) {
    var statusMap = { active: '在读', inactive: '休学' };
    var statusClass = student.status === 'active' ? 'badge-active' : 'badge-warning';
    var initial = student.name.charAt(0);

    var checkboxHTML = showCheckbox ?
      '<label class="checkbox-wrap" onclick="event.stopPropagation()">' +
        '<input type="checkbox" class="batch-checkbox" data-id="' + student.id + '">' +
        '<span class="checkbox-custom"></span>' +
      '</label>' : '';

    return (
      '<div class="student-card" data-id="' + student.id + '">' +
        checkboxHTML +
        '<div class="student-avatar">' + initial + '</div>' +
        '<div class="student-info">' +
          '<div class="student-name">' + student.name + '</div>' +
          '<div class="student-meta">' + student.id + ' · ' + student.grade + ' ' + student.className + ' · ' + student.major + '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          '<span class="badge ' + statusClass + '">' + statusMap[student.status] + '</span>' +
        '</div>' +
        '<div class="student-actions">' +
          '<button class="btn-ghost btn-sm student-view-btn" data-id="' + student.id + '">查看</button>' +
          '<button class="btn-ghost btn-sm student-edit-btn" data-id="' + student.id + '">编辑</button>' +
          '<button class="btn-ghost btn-sm student-delete-btn" data-id="' + student.id + '" style="color:#000">×</button>' +
        '</div>' +
      '</div>'
    );
  }

  /* ===== 渲染表格行 ===== */

  function renderTableRow(student, showCheckbox) {
    var statusMap = { active: '在读', inactive: '休学' };
    var statusClass = student.status === 'active' ? 'badge-active' : 'badge-warning';

    var checkboxHTML = showCheckbox ?
      '<td><label class="checkbox-wrap"><input type="checkbox" class="batch-checkbox" data-id="' + student.id + '"><span class="checkbox-custom"></span></label></td>' : '';

    return (
      '<tr data-id="' + student.id + '">' +
        checkboxHTML +
        '<td style="font-weight:500">' + student.name + '</td>' +
        '<td>' + student.id + '</td>' +
        '<td>' + student.gender + '</td>' +
        '<td>' + student.grade + ' ' + student.className + '</td>' +
        '<td>' + student.major + '</td>' +
        '<td><span class="badge ' + statusClass + '">' + statusMap[student.status] + '</span></td>' +
        '<td><div style="display:flex;gap:4px">' +
          '<button class="btn-ghost btn-sm student-view-btn" data-id="' + student.id + '">查看</button>' +
          '<button class="btn-ghost btn-sm student-edit-btn" data-id="' + student.id + '">编辑</button>' +
          '<button class="btn-ghost btn-sm student-delete-btn" data-id="' + student.id + '">×</button>' +
        '</div></td>' +
      '</tr>'
    );
  }

  /* ===== 成绩表单 ===== */

  function gradeFormHTML(gradeRecord, studentList) {
    var isEdit = !!gradeRecord;
    var title = isEdit ? '编辑成绩' : '录入成绩';
    var btnText = isEdit ? '保存修改' : '添加';

    var studentOptions = '';
    studentList.forEach(function(s) {
      var selected = (isEdit && gradeRecord.studentId === s.id) ? ' selected' : '';
      studentOptions += '<option value="' + s.id + '"' + selected + '>' + s.name + '（' + s.id + '）</option>';
    });

    var subjects = ['高等数学', '大学英语', '大学物理', '数据结构', '计算机网络', '线性代数', '艺术概论', '体育学概论', '乐理基础', '其他'];
    var subjectOptions = '';
    subjects.forEach(function(sub) {
      var selected = (isEdit && gradeRecord.subject === sub) ? ' selected' : '';
      subjectOptions += '<option value="' + sub + '"' + selected + '>' + sub + '</option>';
    });

    return (
      '<div class="modal-title">' + title + '</div>' +
      '<form id="gradeForm" onsubmit="return false;">' +
        '<div class="form-group">' +
          '<label class="form-label">学生 <span class="required-mark">*</span></label>' +
          '<select class="input-contained" name="studentId"' + (isEdit ? ' disabled' : '') + '>' +
            studentOptions +
          '</select>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group">' +
            '<label class="form-label">科目 <span class="required-mark">*</span></label>' +
            '<select class="input-contained" name="subject">' +
              subjectOptions +
            '</select>' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">成绩 <span class="required-mark">*</span></label>' +
            '<input class="input-contained" name="score" type="number" min="0" max="100" value="' + (isEdit ? gradeRecord.score : '') + '" placeholder="0-100" required>' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group">' +
            '<label class="form-label">学期</label>' +
            '<select class="input-contained" name="semester">' +
              '<option value="2024-2025-1"' + (isEdit && gradeRecord.semester === '2024-2025-1' ? ' selected' : '') + '>2024-2025 第一学期</option>' +
              '<option value="2024-2025-2"' + (isEdit && gradeRecord.semester === '2024-2025-2' ? ' selected' : '') + '>2024-2025 第二学期</option>' +
              '<option value="2025-2026-1"' + (isEdit && gradeRecord.semester === '2025-2026-1' ? ' selected' : '') + '>2025-2026 第一学期</option>' +
            '</select>' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">考试类型</label>' +
            '<select class="input-contained" name="examType">' +
              '<option value="期末考试"' + (isEdit && gradeRecord.examType === '期末考试' ? ' selected' : '') + '>期末考试</option>' +
              '<option value="期中考试"' + (isEdit && gradeRecord.examType === '期中考试' ? ' selected' : '') + '>期中考试</option>' +
              '<option value="随堂测验"' + (isEdit && gradeRecord.examType === '随堂测验' ? ' selected' : '') + '>随堂测验</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
      '</form>' +
      '<div class="modal-actions">' +
        '<button class="btn-ghost btn-sm" id="formCancelBtn">取消</button>' +
        '<button class="btn-primary btn-sm" id="formSubmitBtn">' + btnText + '</button>' +
      '</div>'
    );
  }

  /* ===== 仪表盘组件 ===== */

  function renderBarChart(data, maxVal) {
    var html = '<div class="bar-chart">';
    var keys = Object.keys(data);
    keys.forEach(function(k) {
      var pct = maxVal > 0 ? Math.round(data[k] / maxVal * 100) : 0;
      html +=
        '<div class="bar-chart-row">' +
          '<div class="bar-chart-label">' + k + '</div>' +
          '<div class="bar-chart-track">' +
            '<div class="bar-chart-fill" style="width:' + pct + '%"></div>' +
          '</div>' +
          '<div class="bar-chart-value">' + data[k] + '</div>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderDonutStat(label, value, total) {
    var pct = total > 0 ? Math.round(value / total * 100) : 0;
    return (
      '<div class="donut-stat">' +
        '<div class="donut-ring" style="--pct:' + pct + '">' +
          '<div class="donut-inner">' + pct + '%</div>' +
        '</div>' +
        '<div class="donut-label">' + label + '</div>' +
        '<div class="donut-value">' + value + ' / ' + total + '</div>' +
      '</div>'
    );
  }

  /* ===== 操作日志列表 ===== */

  function renderLogList(logs) {
    if (logs.length === 0) {
      return '<div class="empty-state-text" style="padding:24px 0;color:var(--color-gravel)">暂无操作记录</div>';
    }
    var html = '<div class="log-list">';
    logs.forEach(function(log) {
      var d = new Date(log.time);
      var timeStr = d.toLocaleDateString('zh-CN') + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      html +=
        '<div class="log-item">' +
          '<div class="log-action">' + log.action + '</div>' +
          '<div class="log-detail">' + log.detail + '</div>' +
          '<div class="log-time">' + timeStr + '</div>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  return {
    showToast: showToast,
    openModal: openModal,
    closeModal: closeModal,
    confirmDialog: confirmDialog,
    studentFormHTML: studentFormHTML,
    studentDetailHTML: studentDetailHTML,
    renderStudentCard: renderStudentCard,
    renderTableRow: renderTableRow,
    gradeFormHTML: gradeFormHTML,
    renderBarChart: renderBarChart,
    renderDonutStat: renderDonutStat,
    renderLogList: renderLogList,
  };
})();