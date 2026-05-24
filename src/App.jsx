import { useEffect, useState } from "react";
import StatsPanel from "./StatsPanel";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import "./App.css";

function getToday() {
  return new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Tokyo",
  });
}

function normalizeProject(project) {
  return {
    id: project.id || crypto.randomUUID(),
    title: project.title || "",
    description: project.description || "",
    techs: project.techs || "",
    purpose: project.purpose || "",
    learning: project.learning || "",
    improvement: project.improvement || "",
    githubUrl: project.githubUrl || "",
    demoUrl: project.demoUrl || "",
    status: project.status || "制作中",
    createdAt: project.createdAt || getToday(),
    updatedAt: project.updatedAt || getToday(),
    files: Array.isArray(project.files) ? project.files : [],
  };
}

const STORAGE_KEY = "portfolio-archive-projects";

  const initialForm = {
  title: "",
  description: "",
  techs: "",
  purpose: "",
  learning: "",
  improvement: "",
  githubUrl: "",
  demoUrl: "",
  status: "制作中",
  };

  function App() {
    //state
    const [form, setForm] = useState(initialForm);
    const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem(STORAGE_KEY);

    if (savedProjects === null) {
      return[];
    }

    try {
      const parsedProjects = JSON.parse(savedProjects);

      if (!Array.isArray(parsedProjects)) {
       return [];
      }

      return parsedProjects.map((project) => normalizeProject(project));
    } catch (error) {
      console.error("保存データの読み込みに失敗しました", error);
      return [];
    }
  });

    const [editingId, setEditingId] = useState(null);

    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("すべて");

  //localStorage保存
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}, [projects]);

  //イベント処理
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prevForm) => ({
    ...prevForm,
    [name]: value,
  }));
}

  function handleAddProject() {
    if (form.title.trim() === "") {
      alert("アプリ名を入力");
      return;
    }

    const isInvalidGithubUrl = 
      form.githubUrl.trim() !== "" &&
      !form.githubUrl.startsWith("https://") &&
      !form.githubUrl.startsWith("http://");

    const isInvalidDemoUrl =
      form.demoUrl.trim() !== "" &&
      !form.demoUrl.startsWith("https://") &&
      !form.demoUrl.startsWith("http://");

    if (isInvalidGithubUrl || isInvalidDemoUrl) {
        alert("GitHub URLはhttps://またはhttp://で始まる必要があります");
        return;
      }


    if (editingId !== null) {
      const updatedProjects = projects.map((project) => {
      if (project.id === editingId) {
        return {
          id: project.id,
          ...form,
          createdAt: project.createdAt,
          updatedAt: getToday(),
          files: Array.isArray(project.files) ? project.files : [],
        };
      }

       return project;
     });
    
    

      setProjects(updatedProjects);
      setEditingId(null);
      setForm(initialForm);
      return;
    }

    const newProject = {
      id: crypto.randomUUID(),
      ...form,
      createdAt: getToday(),
      updatedAt: getToday(),
      files: [],
    };

    setProjects([...projects, newProject]);
    setForm(initialForm);
  }

  function handleDeleteProject(id) {
    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(updatedProjects);
  }

  function handleEditProject(project) {
  setForm({
    title: project.title || "",
    description: project.description || "",
    techs: project.techs || "",
    purpose: project.purpose || "",
    learning: project.learning || "",
    improvement: project.improvement || "",
    githubUrl: project.githubUrl || "",
    demoUrl: project.demoUrl || "",
    status: project.status || "制作中",
  });
  setEditingId(project.id);
} 

function handleCancelEdit() {
  setForm(initialForm);
  setEditingId(null);
}

//表示用計算
const totalCount = projects.length;

const completedCount = projects.filter(
  (project) => project.status === "完成"
).length;

const inProgressCount = projects.filter(
  (project) => project.status === "制作中"
).length;

const improvingCount = projects.filter(
  (project) => project.status === "改善中"
).length;

const maintenanceCount = projects.filter(
  (project) => project.status === "保守中"
).length;

const filteredProjects = projects.filter((project) => {
  const keyword = searchText.toLowerCase();

  const matchesSearch =
    (project.title || "").toLowerCase().includes(keyword) ||
    (project.description || "").toLowerCase().includes(keyword) ||
    (project.techs || "").toLowerCase().includes(keyword) ||
    (project.purpose || "").toLowerCase().includes(keyword) ||
    (project.learning || "").toLowerCase().includes(keyword) ||
    (project.improvement || "").toLowerCase().includes(keyword);

  const matchesStatus =
    statusFilter === "すべて" || project.status === statusFilter;

  return matchesSearch && matchesStatus;
});

return (

    <div className="app">
      <div className="app-shell">
        <header className="hero">
          <p className="hero-label">Project Storage</p>
          <h1 className="hero-title">Portfolio Archive</h1>
        </header>

        <StatsPanel
          totalCount={totalCount}
          completedCount={completedCount}
          inProgressCount={inProgressCount}
          improvingCount={improvingCount}
          maintenanceCount={maintenanceCount}
        />  

        <main className="main-layout">

          <ProjectForm
           form={form}
           editingId={editingId}
           handleChange={handleChange}
           handleAddProject={handleAddProject}
           handleCancelEdit={handleCancelEdit}
          />

          <ProjectList
            projects={projects}
            filteredProjects={filteredProjects}
            searchText={searchText}
            setSearchText={setSearchText}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
          />
        </main>
      </div>
    </div>
  );
}

export default App;