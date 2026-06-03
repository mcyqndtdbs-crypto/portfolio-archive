function ProjectCard({ project, onEditProject, onDeleteProject }) {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <h3>{project.title}</h3>
        <span className={`status-badge status-${project.status}`}>
          {project.status}
        </span>
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
      </dl>

      {project.files.length > 0 && (
        <div className="project-files">
          <p className="project-files-title">関連ファイル</p>

          <ul className="project-files-list">
            {project.files.map((file) => (
              <li className="project-file-item" key={file.id}>
                <span>{file.name}</span>
                <span>{file.addedAt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(project.githubUrl || project.demoUrl) && (
        <div className="project-links">
          {project.githubUrl && (
            <a
              className="project-link"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              GitHubを開く
            </a>
          )}

          {project.demoUrl && (
            <a
              className="project-link"
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
            >
              デモを開く
            </a>
          )}
        </div>
      )}

      <p className="project-date">
        登録日：{project.createdAt || "未記録"} / 更新日：
        {project.updatedAt || "未記録"}
      </p>


      <div className="project-actions">
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
      </div>
    </article>
  );
}

export default ProjectCard;