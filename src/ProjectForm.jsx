function ProjectForm({
    form,
    editingId,
    handleChange,
    handleAddProject,
    handleCancelEdit
  }) {
  return (

  <section className="panel">
            <div className="section-heading">
              <p className="section-label">Register</p>
              <h2>Project Form</h2>
            </div>

              <form className="project-form">
                <label className="form-group">
                  <span>タイトル</span>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="例:Snipet List"
                  />
                </label>

                <label className="form-group">
                  <span>概要</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="アプリ概要を入力"
                  />
                </label>

                <label className="form-group">
                  <span>使用技術</span>
                  <input
                    type="text"
                    name="techs"
                    value={form.techs}
                    onChange={handleChange}
                    placeholder="例:React, CSS.Tauri"
                  />
                </label>

                <label className="form-group">
                  <span>制作目的</span>
                  <textarea
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    placeholder="作った理由を入力"
                  />
                </label>

                <label className="form-group">
                  <span>学んだこと</span>
                  <textarea
                    name="learning"
                    value={form.learning}
                    onChange={handleChange}
                    placeholder="制作を通して学んだこと"
                  />
                </label>

                <label className="form-group">
                  <span>改善予定</span>
                  <textarea
                    name="improvement"
                    value={form.improvement}
                    onChange={handleChange}
                    placeholder="今後の実装予定や改善点"
                  />
                </label>

                <label className="form-group">
                  <span>GitHub URL</span>
                  <input
                    type="url"
                    name="githubUrl"
                    value={form.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                  />
                </label>

                <label className="form-group">
                  <span>デモURL</span>
                  <input
                    type="url"
                    name="demoUrl"
                    value={form.demoUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </label>

                <label className="form-group">
                  <span>ステータス</span>
                  <select name="status" value={form.status} onChange={handleChange}>
                  
                    <option value="制作中">制作中</option>
                    <option value="完成">完成</option>
                    <option value="改善中">改善中</option>
                    <option value="保守中">保守中</option>
                  </select>
                </label>

                <button className="primary-button" type="button" onClick={handleAddProject}>
                  {editingId !== null ? "更新" : "登録"}
                </button>

                {editingId !== null && (
                  <button 
                    className="secondary-button"
                    type="button"
                    onClick={handleCancelEdit}
                  >
                    キャンセル
                  </button>
                )}
                
              </form>
          </section>
    );
}

export default ProjectForm;