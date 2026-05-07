/* js/app-grades.js — 成绩管理页 */
var GradesPage = (function() {
  var gradeState = { search: '', sortBy: 'studentId', sortDir: 'asc', viewMode: 'list' };

  function render() {
    var container = document.getElementById('pagGradesContent');
    if (!container) return;
    var allGrades = Store.getAllGrades();
    var students = Store.getAll();

    if (gradeState.viewMode === 'ranking') { renderRanking(container); return; }

    /* 筛选 */
    var filtered = allGrades;
    if (gradeState.search) {
      var q = gradeState.search.toLowerCase();
      filtered = filtered.filter(function(g) {
        var s = Store.getById(g.studentId);
        return (s && s.name.toLowerCase().includes(q)) || g.subject.toLowerCase().includes(q) || g.studentId.toLowerCase().includes(q);
      });
    }

    /* 排序 */
    var dir = gradeState.sortDir === 'desc' ? -1 : 1;
    filtered.sort(function(a, b) {
      var va = a[gradeState.sortBy] || '', vb = b[gradeState.sortBy] || '';
      if (gradeState.sortBy === 'score') return (a.score - b.score) * dir;
      return String(va).localeCompare(String(vb), 'zh-CN') * dir;
    });

    var sortIcon = function(col) {
      if (gradeState.sortBy !== col) return ' <span class="sort-icon">⇅</span>';
      return gradeState.sortDir === 'asc' ? ' <span class="sort-icon active">↑</span>' : ' <span class="sort-icon active">↓</span>';
    };

    var rows = '';
    filtered.forEach(function(g) {
      var s = Store.getById(g.studentId);
      var scoreClass = g.score >= 90 ? 'score-excellent' : g.score >= 60 ? 'score-pass' : 'score-fail';
      rows +=
        '<tr>' +
          '<td>' + (s ? s.name : g.studentId) + '</td>' +
          '<td>' + g.studentId + '</td>' +
          '<td>' + g.subject + '</td>' +
          '<td><span class="' + scoreClass + '">' + g.score + '</span></td>' +
          '<td>' + g.semester + '</td>' +
          '<td>' + g.examType + '</td>' +
          '<td><div style="display:flex;gap:4px">' +
            '<button class="btn-ghost btn-sm grade-edit-btn" data-id="' + g.id + '">编辑</button>' +
            '<button class="btn-ghost btn-sm grade-delete-btn" data-id="' + g.id + '">×</button>' +
          '</div></td>' +
        '</tr>';
    });

    /* 学科统计 */
    var gradeStats = Store.getGradeStats();
    var statsHTML = '<div class="grade-stats-row">';
    Object.keys(gradeStats).forEach(function(sub) {
      var st = gradeStats[sub];
      statsHTML +=
        '<div class="grade-stat-chip">' +
          '<span class="grade-stat-subject">' + sub + '</span>' +
          '<span class="grade-stat-avg">均分 ' + st.avg + '</span>' +
        '</div>';
    });
    statsHTML += '</div>';

    container.innerHTML =
      '<div class="page-section-header">' +
        '<div style="display:flex;align-items:center;gap:12px;flex:1">' +
          '<div class="search-bar" style="max-width:300px">' +
            '<span class="search-bar-icon">⌕</span>' +
            '<input class="input-contained" id="gradeSearchInput" placeholder="搜索姓名 / 科目…" value="' + gradeState.search + '" style="padding-left:36px">' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:8px">' +
          '<button class="btn-ghost btn-sm' + (gradeState.viewMode === 'list' ? ' active-toggle' : '') + '" id="gradeViewList">成绩列表</button>' +
          '<button class="btn-ghost btn-sm' + (gradeState.viewMode === 'ranking' ? ' active-toggle' : '') + '" id="gradeViewRank">成绩排名</button>' +
          '<button class="btn-primary btn-sm" id="addGradeBtn">+ 录入成绩</button>' +
        '</div>' +
      '</div>' +
      statsHTML +
      '<div class="student-table-wrapper">' +
        '<table class="data-table">' +
          '<thead><tr>' +
            '<th class="g-sortable" data-gsort="studentId">学生' + sortIcon('studentId') + '</th>' +
            '<th>学号</th>' +
            '<th class="g-sortable" data-gsort="subject">科目' + sortIcon('subject') + '</th>' +
            '<th class="g-sortable" data-gsort="score">成绩' + sortIcon('score') + '</th>' +
            '<th>学期</th><th>考试类型</th>' +
            '<th style="width:120px">操作</th>' +
          '</tr></thead>' +
          '<tbody>' + (rows || '<tr><td colspan="7" style="text-align:center;color:var(--color-gravel);padding:40px">暂无成绩记录</td></tr>') + '</tbody>' +
        '</table>' +
      '</div>';

    bindGradeEvents();
  }

  function renderRanking(container) {
    var ranking = Store.getStudentRanking();
    var rows = '';
    ranking.forEach(function(r, i) {
      var rankBadge = i < 3 ? '<span class="rank-badge rank-' + (i + 1) + '">' + (i + 1) + '</span>' : '<span class="rank-num">' + (i + 1) + '</span>';
      rows +=
        '<tr>' +
          '<td>' + rankBadge + '</td>' +
          '<td style="font-weight:500">' + r.student.name + '</td>' +
          '<td>' + r.student.id + '</td>' +
          '<td>' + r.student.grade + ' ' + r.student.className + '</td>' +
          '<td>' + r.subjectCount + ' 科</td>' +
          '<td style="font-weight:500">' + r.totalScore + '</td>' +
          '<td>' + r.avgScore + '</td>' +
        '</tr>';
    });

    container.innerHTML =
      '<div class="page-section-header">' +
        '<div style="flex:1"></div>' +
        '<div style="display:flex;gap:8px">' +
          '<button class="btn-ghost btn-sm" id="gradeViewList">成绩列表</button>' +
          '<button class="btn-ghost btn-sm active-toggle" id="gradeViewRank">成绩排名</button>' +
          '<button class="btn-primary btn-sm" id="addGradeBtn">+ 录入成绩</button>' +
        '</div>' +
      '</div>' +
      '<div class="student-table-wrapper">' +
        '<table class="data-table">' +
          '<thead><tr><th style="width:60px">排名</th><th>姓名</th><th>学号</th><th>班级</th><th>科目数</th><th>总分</th><th>均分</th></tr></thead>' +
          '<tbody>' + (rows || '<tr><td colspan="7" style="text-align:center;color:var(--color-gravel);padding:40px">暂无排名数据</td></tr>') + '</tbody>' +
        '</table>' +
      '</div>';

    bindGradeEvents();
  }

  function bindGradeEvents() {
    var addBtn = document.getElementById('addGradeBtn');
    if (addBtn) addBtn.addEventListener('click', showAddGradeForm);

    var listBtn = document.getElementById('gradeViewList');
    if (listBtn) listBtn.addEventListener('click', function() { gradeState.viewMode = 'list'; render(); });
    var rankBtn = document.getElementById('gradeViewRank');
    if (rankBtn) rankBtn.addEventListener('click', function() { gradeState.viewMode = 'ranking'; render(); });

    var si = document.getElementById('gradeSearchInput');
    if (si) {
      var isC = false;
      si.addEventListener('compositionstart', function() { isC = true; });
      si.addEventListener('compositionend', function(e) { isC = false; gradeState.search = e.target.value; render(); });
      si.addEventListener('input', function(e) { if (!isC) { gradeState.search = e.target.value; render(); } });
    }

    document.querySelectorAll('.g-sortable').forEach(function(th) {
      th.addEventListener('click', function() {
        var col = this.dataset.gsort;
        if (gradeState.sortBy === col) gradeState.sortDir = gradeState.sortDir === 'asc' ? 'desc' : 'asc';
        else { gradeState.sortBy = col; gradeState.sortDir = 'asc'; }
        render();
      });
    });

    document.querySelectorAll('.grade-edit-btn').forEach(function(b) {
      b.addEventListener('click', function() {
        var allG = Store.getAllGrades();
        var g = allG.find(function(x) { return x.id === b.dataset.id; });
        if (g) showEditGradeForm(g);
      });
    });
    document.querySelectorAll('.grade-delete-btn').forEach(function(b) {
      b.addEventListener('click', function() {
        UI.confirmDialog('确认删除该成绩记录？', '此操作不可撤销', function() {
          Store.removeGrade(b.dataset.id); UI.showToast('成绩已删除'); render();
        });
      });
    });
  }

  function showAddGradeForm() {
    UI.openModal(UI.gradeFormHTML(null, Store.getAll()));
    document.getElementById('formCancelBtn').addEventListener('click', function() { UI.closeModal(); });
    document.getElementById('formSubmitBtn').addEventListener('click', function() { handleGradeSubmit(null); });
  }

  function showEditGradeForm(record) {
    UI.openModal(UI.gradeFormHTML(record, Store.getAll()));
    document.getElementById('formCancelBtn').addEventListener('click', function() { UI.closeModal(); });
    document.getElementById('formSubmitBtn').addEventListener('click', function() { handleGradeSubmit(record.id); });
  }

  function handleGradeSubmit(editId) {
    var form = document.getElementById('gradeForm');
    var data = {
      studentId: form.querySelector('[name="studentId"]').value,
      subject: form.querySelector('[name="subject"]').value,
      score: form.querySelector('[name="score"]').value,
      semester: form.querySelector('[name="semester"]').value,
      examType: form.querySelector('[name="examType"]').value,
    };
    if (!data.score || isNaN(data.score) || data.score < 0 || data.score > 100) {
      UI.showToast('请输入有效成绩（0-100）'); return;
    }
    if (editId) { Store.updateGrade(editId, data); UI.showToast('成绩已更新'); }
    else { Store.addGrade(data); UI.showToast('成绩已录入'); }
    UI.closeModal(); render();
  }

  return { render: render };
})();
