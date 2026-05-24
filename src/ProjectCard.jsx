function ProjectCard({ project, onEditProject, onDeleteProject }) {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <h3>{project.title}</h3>
        <span className="status-badge">{project.status}</span>
      </div>

      <p className="project-description">{project.description}</p>

      <div className="tech-list">
        {(project.techs || "")
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech !== "")
          .map((tech) => (
           <span className="tech-tag" key={tech}>
             {tech}
           </span>
       ))}
      </div>

      <dl className="project-meta">
        <div>
          <dt>制作目的</dt>
          <dd>{project.purpose || "未入力"}</dd>
        </div>

        <div>
          <dt>学んだこと</dt>
          <dd>{project.learning || "未入力"}</dd>
        </div>

        <div>
          <dt>改善予定</dt>
          <dd>{project.improvement || "未入力"}</dd>
        </div>

        {project.githubUrl && (
          <div>
            <dt>GitHub</dt>
            <dd>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                {project.githubUrl}
              </a>
            </dd>
          </div>
        )}

        {project.demoUrl && (
          <div>
            <dt>デモURL</dt>
            <dd>
              <a href={project.demoUrl} target="_blank" rel="noreferrer">
                デモを開く
                {project.demoUrl}
              </a>
            </dd>
          </div>
        )}  
      </dl>

      <p className="project-date">
        登録日：{project.createdAt || "未記録"} / 更新日：{project.updatedAt || "未記録"}
      </p>

      <button
        className="edit-button"
        type="button"
        onClick={() => onEditProject(project)}
      >
        編集
      </button>

      <button
        className="delete-button"
        type="button"
        onClick={() => onDeleteProject(project.id)}
      >
        削除
      </button>
    </article>
  );
}

export default ProjectCard;