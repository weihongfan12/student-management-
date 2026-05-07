/* js/app-core.js — 路由 + 学生管理页 */
var App = (function() {
  var state = {
    currentPage: 'students',
    students: [], filtered: [], view: 'grid', search: '',
    gradeFilter: 'all', statusFilter: 'all', genderFilter: 'all',
    page: 1, pageSize: 12,
    sortBy: '', sortDir: 'asc',
    batchMode: false, selected: [],
  };

  function getState() { return state; }

  /* ===== 路由 ===== */
  function navigate(page) {
    state.currentPage = page;
    document.querySelectorAll('.navbar-link').forEach(function(l) {
      l.classList.toggle('active', l.dataset.page === page);
    });
    document.getElementById('pageStudents').style.display = page === 'students' ? '' : 'none';
    document.getElementById('pageGrades').style.display = page === 'grades' ? '' : 'none';
    document.getElementById('pageDashboard').style.display = page === 'dashboard' ? '' : 'none';
    if (page === 'students') { reRender(); }
    if (page === 'grades' && typeof GradesPage !== 'undefined') GradesPage.render();
    if (page === 'dashboard' && typeof DashboardPage !== 'undefined') DashboardPage.render();
  }

  /* ===== 初始化 ===== */
  function init() {
    state.students = Store.load();
    applyFilters();
    renderNavbar();
    renderPageHeader();
    renderStats();
    renderControls();
    renderFilterPills();
    renderStudentList();
    renderPagination();
    renderEmptyState();
    bindEvents();
  }

  /* ===== 筛选 ===== */
  function applyFilters() {
    state.filtered = Store.query({
      search: state.search, grade: state.gradeFilter,
      status: state.statusFilter, gender: state.genderFilter,
      sortBy: state.sortBy, sortDir: state.sortDir,
    });
    state.page = 1;
  }

  function getPageItems() {
    var start = (state.page - 1) * state.pageSize;
    return state.filtered.slice(start, start + state.pageSize);
  }
  function getTotalPages() {
    return Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
  }

  /* ===== 渲染 ===== */
  function renderNavbar() {
    var nav = document.getElementById('navbar');
    var today = new Date().toLocaleDateString('zh-CN');
    nav.innerHTML =
      '<div class="navbar-inner">' +
        '<div class="navbar-logo">学生管理</div>' +
        '<div class="navbar-links">' +
          '<a class="navbar-link active" data-page="students" href="#">学生管理</a>' +
          '<a class="navbar-link" data-page="grades" href="#">成绩管理</a>' +
          '<a class="navbar-link" data-page="dashboard" href="#">数据总览</a>' +
        '</div>' +
        '<div class="navbar-actions">' +
          '<span style="font-family:var(--font-inter);font-weight:400;font-size:13px;color:var(--color-gravel)">' + today + '</span>' +
        '</div>' +
      '</div>';
    nav.querySelectorAll('.navbar-link').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        navigate(this.dataset.page);
      });
    });
  }

  function renderPageHeader() {
    var h = document.getElementById('pageHeader');
    h.innerHTML =
      '<div class="page-header-eyebrow">STUDENT MANAGEMENT</div>' +
      '<h1 class="page-header-title">学生管理系统</h1>' +
      '<p class="page-header-desc">管理在校学生的基本信息 — 搜索、添加、编辑和查看学生档案</p>';
  }

  function renderStats() {
    var stats = Store.getStats();
    var existing = document.querySelector('.stats-row');
    if (existing) existing.remove();
    var div = document.createElement('div');
    div.className = 'stats-row';
    div.innerHTML =
      '<div class="stat-card"><span class="stat-number">' + stats.total + '</span><span class="stat-label">总计</span></div>' +
      '<div class="stat-card"><span class="stat-number">' + stats.active + '</span><span class="stat-label">在读</span></div>' +
      '<div class="stat-card"><span class="stat-number">' + stats.inactive + '</span><span class="stat-label">休学</span></div>' +
      '<div class="stat-card"><span class="stat-number">' + stats.grades.length + '</span><span class="stat-label">年级</span></div>';
    var bar = document.getElementById('controlsBar');
    bar.parentNode.insertBefore(div, bar);
  }

  function renderControls() {
    var bar = document.getElementById('controlsBar');
    var clearStyle = state.search ? '' : ' style="display:none"';
    var gridActive = state.view === 'grid' ? ' active' : '';
    var tableActive = state.view === 'table' ? ' active' : '';
    var batchCls = state.batchMode ? ' active' : '';
    bar.innerHTML =
      '<div class="controls-left">' +
        '<div class="search-bar">' +
          '<span class="search-bar-icon">⌕</span>' +
          '<input class="input-contained" id="searchInput" placeholder="搜索姓名 / 学号 / 邮箱 / 电话…" value="' + state.search + '" style="padding-left:36px">' +
        '</div>' +
        '<button class="btn-ghost btn-sm" id="clearSearchBtn"' + clearStyle + '>清除</button>' +
      '</div>' +
      '<div class="controls-right">' +
        '<button class="btn-ghost btn-sm' + batchCls + '" id="batchModeBtn">☑ 批量</button>' +
        (state.batchMode ? '<button class="btn-ghost btn-sm" id="batchDeleteBtn">删除所选</button><button class="btn-ghost btn-sm" id="batchStatusBtn">修改状态</button>' : '') +
        '<div class="dropdown-wrap">' +
          '<button class="btn-ghost btn-sm" id="exportBtn">↓ 导出</button>' +
          '<div class="dropdown-menu" id="exportMenu">' +
            '<button class="dropdown-item" id="exportCSVBtn">导出 CSV</button>' +
            '<button class="dropdown-item" id="exportJSONBtn">导出 JSON</button>' +
            '<button class="dropdown-item" id="importJSONBtn">导入 JSON</button>' +
            '<div class="dropdown-divider"></div>' +
            '<button class="dropdown-item" id="resetDataBtn">重置数据</button>' +
          '</div>' +
        '</div>' +
        '<div class="view-toggle">' +
          '<button class="view-toggle-btn' + gridActive + '" data-view="grid">▦</button>' +
          '<button class="view-toggle-btn' + tableActive + '" data-view="table">☰</button>' +
        '</div>' +
        '<button class="btn-primary" id="addStudentBtn">+ 添加学生</button>' +
      '</div>';
  }

  function renderFilterPills() {
    var container = document.getElementById('studentList');
    var pills = document.querySelector('.filter-pills');
    if (!pills) {
      pills = document.createElement('div');
      pills.className = 'filter-pills';
      container.parentNode.insertBefore(pills, container);
    }
    var gradeOrder = ['一年级','二年级','三年级','四年级'];
    var grades = ['all'].concat(gradeOrder.filter(function(g) {
      return state.students.some(function(s) { return s.grade === g; });
    }));
    var html = '';
    grades.forEach(function(g) {
      var active = state.gradeFilter === g ? ' active' : '';
      var label = g === 'all' ? '全部年级' : g;
      html += '<button class="filter-pill' + active + '" data-grade="' + g + '">' + label + '</button>';
    });
    html += '<span class="filter-divider"></span>';
    [{ key:'all', label:'全部' }, { key:'active', label:'在读' }, { key:'inactive', label:'休学' }].forEach(function(f) {
      var active = state.statusFilter === f.key ? ' active' : '';
      html += '<button class="filter-pill' + active + '" data-status="' + f.key + '">' + f.label + '</button>';
    });
    html += '<span class="filter-divider"></span>';
    [{ key:'all', label:'全部性别' }, { key:'男', label:'男' }, { key:'女', label:'女' }].forEach(function(f) {
      var active = state.genderFilter === f.key ? ' active' : '';
      html += '<button class="filter-pill' + active + '" data-gender="' + f.key + '">' + f.label + '</button>';
    });
    pills.innerHTML = html;
  }

  function renderStudentList() {
    var container = document.getElementById('studentList');
    var items = getPageItems();
    if (items.length === 0) {
      document.getElementById('emptyState').style.display = 'block';
      container.innerHTML = '';
      var pag = document.querySelector('.pagination');
      if (pag) pag.innerHTML = '';
      return;
    }
    document.getElementById('emptyState').style.display = 'none';
    if (state.view === 'grid') {
      var cards = '';
      items.forEach(function(s) { cards += UI.renderStudentCard(s, state.batchMode); });
      container.innerHTML = '<div class="student-grid">' + cards + '</div>';
    } else {
      var sortIcon = function(col) {
        if (state.sortBy !== col) return ' <span class="sort-icon">⇅</span>';
        return state.sortDir === 'asc' ? ' <span class="sort-icon active">↑</span>' : ' <span class="sort-icon active">↓</span>';
      };
      var checkAllHTML = state.batchMode ? '<th style="width:36px"><label class="checkbox-wrap"><input type="checkbox" id="checkAll"><span class="checkbox-custom"></span></label></th>' : '';
      var rows = '';
      items.forEach(function(s) { rows += UI.renderTableRow(s, state.batchMode); });
      container.innerHTML =
        '<div class="student-table-wrapper">' +
          '<table class="data-table">' +
            '<thead><tr>' + checkAllHTML +
              '<th class="sortable-th" data-sort="name">姓名' + sortIcon('name') + '</th>' +
              '<th class="sortable-th" data-sort="id">学号' + sortIcon('id') + '</th>' +
              '<th>性别</th>' +
              '<th class="sortable-th" data-sort="grade">年级/班级' + sortIcon('grade') + '</th>' +
              '<th class="sortable-th" data-sort="major">专业' + sortIcon('major') + '</th>' +
              '<th>状态</th>' +
              '<th style="width:160px">操作</th>' +
            '</tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>';
    }
    bindStudentActions();
  }

  function renderPagination() {
    var totalPages = getTotalPages();
    var pagination = document.querySelector('.pagination');
    if (!pagination) {
      pagination = document.createElement('div');
      pagination.className = 'pagination';
      document.getElementById('studentList').after(pagination);
    }
    if (totalPages <= 1) { pagination.innerHTML = ''; return; }
    var html = '<button class="pagination-btn" data-page="prev"' + (state.page <= 1 ? ' disabled' : '') + '>‹</button>';
    for (var i = 1; i <= totalPages; i++) {
      html += '<button class="pagination-btn' + (i === state.page ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }
    html += '<button class="pagination-btn" data-page="next"' + (state.page >= totalPages ? ' disabled' : '') + '>›</button>';
    html += '<span class="pagination-info">' + state.filtered.length + ' 条记录</span>';
    pagination.innerHTML = html;
  }

  function renderEmptyState() {
    var empty = document.getElementById('emptyState');
    var hasFilters = state.search || state.gradeFilter !== 'all' || state.statusFilter !== 'all' || state.genderFilter !== 'all';
    empty.innerHTML =
      '<div class="empty-state-icon">○</div>' +
      '<div class="empty-state-text">' + (hasFilters ? '没有匹配的学生' : '还没有学生记录') + '</div>' +
      '<div class="empty-state-hint">' + (hasFilters ? '尝试修改搜索条件' : '点击上方按钮添加第一位学生') + '</div>';
  }

  function updateSearchResults() {
    renderStats(); renderFilterPills(); renderStudentList(); renderPagination(); renderEmptyState();
    var clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) clearBtn.style.display = state.search ? '' : 'none';
    bindStudentActions(); bindSearchEvents();
  }

  function reRender() {
    state.students = Store.getAll();
    applyFilters();
    renderStats(); renderControls(); renderFilterPills();
    renderStudentList(); renderPagination(); renderEmptyState();
    bindEvents();
  }

  /* ===== 事件 ===== */
  function bindEvents() {
    bindSearchEvents();
    var clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) clearBtn.addEventListener('click', function() { state.search = ''; applyFilters(); reRender(); });

    document.querySelectorAll('.view-toggle-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { state.view = this.dataset.view; reRender(); });
    });

    var addBtn = document.getElementById('addStudentBtn');
    if (addBtn) addBtn.addEventListener('click', showAddForm);

    document.querySelectorAll('.filter-pill[data-grade]').forEach(function(p) {
      p.addEventListener('click', function() { state.gradeFilter = this.dataset.grade; applyFilters(); reRender(); });
    });
    document.querySelectorAll('.filter-pill[data-status]').forEach(function(p) {
      p.addEventListener('click', function() { state.statusFilter = this.dataset.status; applyFilters(); reRender(); });
    });
    document.querySelectorAll('.filter-pill[data-gender]').forEach(function(p) {
      p.addEventListener('click', function() { state.genderFilter = this.dataset.gender; applyFilters(); reRender(); });
    });

    document.querySelectorAll('.pagination-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var t = this.dataset.page, tp = getTotalPages();
        if (t === 'prev') state.page = Math.max(1, state.page - 1);
        else if (t === 'next') state.page = Math.min(tp, state.page + 1);
        else state.page = parseInt(t);
        renderStudentList(); renderPagination();
        window.scrollTo({ top: document.getElementById('studentList').offsetTop - 120, behavior: 'smooth' });
      });
    });

    // 排序
    document.querySelectorAll('.sortable-th').forEach(function(th) {
      th.addEventListener('click', function() {
        var col = this.dataset.sort;
        if (state.sortBy === col) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        else { state.sortBy = col; state.sortDir = 'asc'; }
        applyFilters(); reRender();
      });
    });

    // 批量模式
    var batchBtn = document.getElementById('batchModeBtn');
    if (batchBtn) batchBtn.addEventListener('click', function() {
      state.batchMode = !state.batchMode; state.selected = []; reRender();
    });
    var batchDelBtn = document.getElementById('batchDeleteBtn');
    if (batchDelBtn) batchDelBtn.addEventListener('click', handleBatchDelete);
    var batchStatusBtn = document.getElementById('batchStatusBtn');
    if (batchStatusBtn) batchStatusBtn.addEventListener('click', handleBatchStatus);

    // 导出菜单
    var exportBtn = document.getElementById('exportBtn');
    if (exportBtn) exportBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var menu = document.getElementById('exportMenu');
      menu.classList.toggle('show');
    });
    document.addEventListener('click', function() {
      var menu = document.getElementById('exportMenu');
      if (menu) menu.classList.remove('show');
    });
    var csvBtn = document.getElementById('exportCSVBtn');
    if (csvBtn) csvBtn.addEventListener('click', function() { downloadFile('students.csv', Store.exportCSV(), 'text/csv'); });
    var jsonBtn = document.getElementById('exportJSONBtn');
    if (jsonBtn) jsonBtn.addEventListener('click', function() { downloadFile('students-backup.json', Store.exportJSON(), 'application/json'); });
    var importBtn = document.getElementById('importJSONBtn');
    if (importBtn) importBtn.addEventListener('click', handleImportJSON);
    var resetBtn = document.getElementById('resetDataBtn');
    if (resetBtn) resetBtn.addEventListener('click', function() {
      UI.confirmDialog('确认重置所有数据？', '将恢复为初始示例数据，当前数据将丢失', function() {
        Store.resetToDefault(); state.students = Store.getAll(); reRender(); UI.showToast('数据已重置');
      }, '确认重置');
    });

    // 全选
    var checkAll = document.getElementById('checkAll');
    if (checkAll) checkAll.addEventListener('change', function() {
      var checked = this.checked;
      document.querySelectorAll('.batch-checkbox').forEach(function(cb) { cb.checked = checked; });
      updateSelected();
    });
  }

  function bindSearchEvents() {
    var si = document.getElementById('searchInput');
    if (!si || si._bound) return;
    si._bound = true;
    var isComposing = false;
    si.addEventListener('compositionstart', function() { isComposing = true; });
    si.addEventListener('compositionend', function(e) { isComposing = false; state.search = e.target.value; applyFilters(); updateSearchResults(); });
    si.addEventListener('input', function(e) { if (!isComposing) { state.search = e.target.value; applyFilters(); updateSearchResults(); } });
  }

  function bindStudentActions() {
    document.querySelectorAll('.student-view-btn').forEach(function(b) { b.addEventListener('click', function(e) { e.stopPropagation(); var s = Store.getById(this.dataset.id); if (s) showDetail(s); }); });
    document.querySelectorAll('.student-edit-btn').forEach(function(b) { b.addEventListener('click', function(e) { e.stopPropagation(); var s = Store.getById(this.dataset.id); if (s) showEditForm(s); }); });
    document.querySelectorAll('.student-delete-btn').forEach(function(b) { b.addEventListener('click', function(e) { e.stopPropagation(); var s = Store.getById(this.dataset.id); if (s) confirmDelete(s); }); });
    document.querySelectorAll('.student-card').forEach(function(c) { c.addEventListener('click', function(e) { if (e.target.closest('.student-actions') || e.target.closest('.checkbox-wrap')) return; var s = Store.getById(this.dataset.id); if (s) showDetail(s); }); });
    document.querySelectorAll('.batch-checkbox').forEach(function(cb) { cb.addEventListener('change', updateSelected); });
  }

  function updateSelected() {
    state.selected = [];
    document.querySelectorAll('.batch-checkbox:checked').forEach(function(cb) { state.selected.push(cb.dataset.id); });
  }

  /* ===== CRUD 操作 ===== */
  function showAddForm() {
    UI.openModal(UI.studentFormHTML(null));
    document.getElementById('formCancelBtn').addEventListener('click', function() { UI.closeModal(); });
    document.getElementById('formSubmitBtn').addEventListener('click', function() { handleFormSubmit(null); });
  }

  function showEditForm(student) {
    UI.openModal(UI.studentFormHTML(student));
    document.getElementById('formCancelBtn').addEventListener('click', function() { UI.closeModal(); });
    document.getElementById('formSubmitBtn').addEventListener('click', function() { handleFormSubmit(student.id); });
  }

  function handleFormSubmit(editId) {
    var form = document.getElementById('studentForm');
    var data = {
      name: form.querySelector('[name="name"]').value.trim(),
      gender: form.querySelector('[name="gender"]').value,
      grade: form.querySelector('[name="grade"]').value,
      className: form.querySelector('[name="className"]').value,
      major: form.querySelector('[name="major"]').value.trim(),
      status: form.querySelector('[name="status"]').value,
      email: form.querySelector('[name="email"]').value.trim(),
      phone: form.querySelector('[name="phone"]').value.trim(),
      birthDate: form.querySelector('[name="birthDate"]').value,
      enrollmentDate: form.querySelector('[name="enrollmentDate"]').value,
      address: form.querySelector('[name="address"]').value.trim(),
    };
    var errors = Store.validate(data, editId);
    var errEl = document.getElementById('formErrors');
    if (errors.length > 0) {
      if (errEl) errEl.innerHTML = errors.map(function(e) { return '<div class="form-error-item">• ' + e + '</div>'; }).join('');
      return;
    }
    if (editId) { Store.update(editId, data); UI.showToast('学生信息已更新'); }
    else { Store.add(data); UI.showToast('学生已添加'); }
    UI.closeModal(); reRender();
  }

  function showDetail(student) {
    UI.openModal(UI.studentDetailHTML(student), true);
    document.getElementById('detailCloseBtn').addEventListener('click', function() { UI.closeModal(); });
    document.getElementById('detailEditBtn').addEventListener('click', function() { UI.closeModal(); setTimeout(function() { showEditForm(student); }, 200); });
    document.getElementById('detailDeleteBtn').addEventListener('click', function() { UI.closeModal(); setTimeout(function() { confirmDelete(student); }, 200); });
  }

  function confirmDelete(student) {
    UI.confirmDialog('确认删除 "' + student.name + '" ？', '该操作不可撤销 — 学号 ' + student.id + ' 的所有数据将被永久移除', function() {
      Store.remove(student.id); UI.showToast('已删除 ' + student.name); reRender();
    });
  }

  /* ===== 批量操作 ===== */
  function handleBatchDelete() {
    if (state.selected.length === 0) { UI.showToast('请先选择学生'); return; }
    UI.confirmDialog('确认删除 ' + state.selected.length + ' 名学生？', '该操作不可撤销', function() {
      Store.removeBatch(state.selected); state.selected = []; UI.showToast('批量删除成功'); reRender();
    });
  }

  function handleBatchStatus() {
    if (state.selected.length === 0) { UI.showToast('请先选择学生'); return; }
    UI.openModal(
      '<div class="modal-title">修改状态</div>' +
      '<div class="form-group"><label class="form-label">新状态</label>' +
      '<select class="input-contained" id="batchStatusSelect"><option value="active">在读</option><option value="inactive">休学</option></select></div>' +
      '<div class="modal-actions"><button class="btn-ghost btn-sm" id="bsCancel">取消</button><button class="btn-primary btn-sm" id="bsOk">确认</button></div>'
    );
    document.getElementById('bsCancel').addEventListener('click', function() { UI.closeModal(); });
    document.getElementById('bsOk').addEventListener('click', function() {
      var s = document.getElementById('batchStatusSelect').value;
      Store.updateStatusBatch(state.selected, s); state.selected = []; UI.closeModal(); UI.showToast('状态已更新'); reRender();
    });
  }

  /* ===== 导入导出 ===== */
  function downloadFile(name, content, type) {
    var blob = new Blob([content], { type: type });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
    UI.showToast('已导出 ' + name);
  }

  function handleImportJSON() {
    var input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.addEventListener('change', function() {
      var file = this.files[0]; if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        var result = Store.importJSON(e.target.result);
        if (result.success) { UI.showToast(result.message); reRender(); }
        else UI.showToast(result.message, 'error');
      };
      reader.readAsText(file);
    });
    input.click();
  }

  return { init: init, navigate: navigate, getState: getState, reRender: reRender };
})();

document.addEventListener('DOMContentLoaded', function() { App.init(); });
