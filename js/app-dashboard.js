/* js/app-dashboard.js — 数据总览 / 仪表盘 */
var DashboardPage = (function() {

  function render() {
    var container = document.getElementById('pagDashboardContent');
    if (!container) return;
    var stats = Store.getStats();
    var gradeStats = Store.getGradeStats();
    var ranking = Store.getStudentRanking();
    var logs = Store.getLogs(15);

    /* 顶部统计卡片 */
    var topCards =
      '<div class="dash-cards">' +
        '<div class="dash-card">' +
          '<div class="dash-card-num">' + stats.total + '</div>' +
          '<div class="dash-card-label">学生总数</div>' +
        '</div>' +
        '<div class="dash-card">' +
          '<div class="dash-card-num">' + stats.active + '</div>' +
          '<div class="dash-card-label">在读人数</div>' +
        '</div>' +
        '<div class="dash-card">' +
          '<div class="dash-card-num">' + stats.inactive + '</div>' +
          '<div class="dash-card-label">休学人数</div>' +
        '</div>' +
        '<div class="dash-card">' +
          '<div class="dash-card-num">' + Object.keys(gradeStats).length + '</div>' +
          '<div class="dash-card-label">开设科目</div>' +
        '</div>' +
      '</div>';

    /* 年级分布 */
    var gradeOrder = ['一年级','二年级','三年级','四年级'];
    var gradeData = {};
    var maxGrade = 0;
    gradeOrder.forEach(function(g) {
      gradeData[g] = stats.gradeCount[g] || 0;
      if (gradeData[g] > maxGrade) maxGrade = gradeData[g];
    });
    var gradeChart = UI.renderBarChart(gradeData, maxGrade);

    /* 专业分布 */
    var maxMajor = 0;
    Object.keys(stats.majorCount).forEach(function(k) {
      if (stats.majorCount[k] > maxMajor) maxMajor = stats.majorCount[k];
    });
    var majorChart = UI.renderBarChart(stats.majorCount, maxMajor);

    /* 性别比例 */
    var genderHTML =
      '<div class="gender-stats">' +
        UI.renderDonutStat('男生', stats.genderCount['男'], stats.total) +
        UI.renderDonutStat('女生', stats.genderCount['女'], stats.total) +
        UI.renderDonutStat('在读率', stats.active, stats.total) +
      '</div>';

    /* 学科均分 */
    var subjectAvgData = {};
    var maxAvg = 0;
    Object.keys(gradeStats).forEach(function(sub) {
      subjectAvgData[sub] = gradeStats[sub].avg;
      if (gradeStats[sub].avg > maxAvg) maxAvg = gradeStats[sub].avg;
    });
    var subjectChart = Object.keys(subjectAvgData).length > 0 ? UI.renderBarChart(subjectAvgData, 100) : '<div style="color:var(--color-gravel);padding:16px">暂无成绩数据</div>';

    /* 成绩排名 TOP 5 */
    var top5 = ranking.slice(0, 5);
    var rankHTML = '';
    if (top5.length > 0) {
      rankHTML = '<div class="rank-list">';
      top5.forEach(function(r, i) {
        var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
        rankHTML +=
          '<div class="rank-item">' +
            '<span class="rank-medal">' + medal + '</span>' +
            '<span class="rank-name">' + r.student.name + '</span>' +
            '<span class="rank-info">' + r.student.grade + ' · ' + r.subjectCount + '科</span>' +
            '<span class="rank-score">' + r.avgScore + ' 均分</span>' +
          '</div>';
      });
      rankHTML += '</div>';
    } else {
      rankHTML = '<div style="color:var(--color-gravel);padding:16px">暂无排名数据</div>';
    }

    /* 操作日志 */
    var logHTML = UI.renderLogList(logs);

    container.innerHTML =
      topCards +
      '<div class="dash-grid">' +
        '<div class="dash-panel">' +
          '<div class="dash-panel-title">年级分布</div>' +
          gradeChart +
        '</div>' +
        '<div class="dash-panel">' +
          '<div class="dash-panel-title">数据概览</div>' +
          genderHTML +
        '</div>' +
        '<div class="dash-panel">' +
          '<div class="dash-panel-title">专业分布</div>' +
          majorChart +
        '</div>' +
        '<div class="dash-panel">' +
          '<div class="dash-panel-title">学科均分</div>' +
          subjectChart +
        '</div>' +
        '<div class="dash-panel">' +
          '<div class="dash-panel-title">成绩排名 TOP 5</div>' +
          rankHTML +
        '</div>' +
        '<div class="dash-panel">' +
          '<div class="dash-panel-title">最近操作</div>' +
          logHTML +
        '</div>' +
      '</div>';
  }

  return { render: render };
})();
