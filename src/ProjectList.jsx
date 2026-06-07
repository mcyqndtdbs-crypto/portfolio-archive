import ProjectCard from "./ProjectCard";



function ProjectList({ 
    projects, 
    filteredProjects, 
    searchText, 
    setSearchText,
    statusFilter, 
    setStatusFilter,
    onEditProject, 
    onDeleteProject,
    onAddFileToProject
}) {
return (

<section className="panel">
  <div className="section-heading">
    <p className="section-label">Archive</p>
    <h2>Project List</h2>
  </div>

  <div className="filter-bar">
    <label className="filter-field">
      <span>検索</span>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="タイトル、概要、使用技術を検索"
      />
    </label>

    <label className="filter-field">
      <span>ステータス</span>
      <select 
      value={statusFilter} 
      onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="すべて">すべて</option>
        <option value="制作中">制作中</option>
        <option value="完成">完成</option>
        <option value="改善中">改善中</option>
        <option value="保守中">保守中</option>
      </select>
    </label>
  </div>

  {projects.length === 0 ? (
    <div className="empty-state">
    <p className="empty-title">まだ制作物が登録されていません。</p>
    <p className="empty-text">
      左側のフォームから制作物を追加してみましょう
    </p>
  </div>

  ) : filteredProjects.length === 0 ? (
    <div className="empty-state">
      <p className="empty-title">
        該当する制作物が見つかりません。</p>
      <p className="empty-text">
        検索キーワードやステータスフィルターを確認してください。</p>
    </div>
  ) : (
    <div className="project-list">
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEditProject={onEditProject}
          onDeleteProject={onDeleteProject}
          onAddFileToProject={onAddFileToProject}
        />
      ))}
    </div>
  )}
</section>
);
}
export default ProjectList;