function StatsPanel({
    totalCount,
    completedCount,
    inProgressCount,
    improvingCount,
    maintenanceCount,
  }) {
    return (
      
    <section className="stats-grid">
          <article className="stats-card">
            <span className="stats-label">Total</span>
            <strong>{totalCount}</strong>
            <p>登録済み制作物</p>
          </article>

          <article className="stats-card">
            <span className="stats-label">Completed</span>
            <strong>{completedCount}</strong>
            <p>完成</p>
          </article>

          <article className="stats-card">
            <span className="stats-label">In Progress</span>
            <strong>{inProgressCount}</strong>
            <p>制作中</p>
          </article>

          <article className="stats-card">
            <span className="stats-label">Improving</span>
            <strong>{improvingCount}</strong>
            <p>改善中</p>
          </article>

          <article className="stats-card">
            <span className="stats-label">Maintenance</span>
            <strong>{maintenanceCount}</strong>
            <p>保守中</p>
          </article>
        </section>
    );
    }
    export default StatsPanel;