import { useEffect, useState } from "react";
import {
  readTextFile,
  writeTextFile,
  BaseDirectory,
  mkdir,
} from "@tauri-apps/plugin-fs";
import { appDataDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";
import { revealItemInDir,openPath } from "@tauri-apps/plugin-opener";
import StatsPanel from "./StatsPanel";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import "./App.css";

function getToday() {
  return new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Tokyo",
  });
}

function normalizeFile(file) {
  return {
    id: file.id || crypto.randomUUID(),
    name: file.name || "",
    type: file.type || "",
    size: file.size || 0,
    path: file.path || "",
    addedAt: file.addedAt || getToday(),
  };
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
    files: Array.isArray(project.files) ? project.files.map(normalizeFile) : [],
  };
}

const PROJECT_FILE_NAME = "projects.json";

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
    const [projects, setProjects] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [message, setMessage] = useState(null);

    const [editingId, setEditingId] = useState(null);
    useEffect(() => {
  loadProjectsFromFile();
}, []);

function showMessage(type, text) {
  setMessage({ type, text });

  window.setTimeout(() => {
    setMessage(null);
  }, 4000);
}

async function loadProjectsFromFile() {
  try {
    const jsonText = await readTextFile(PROJECT_FILE_NAME, {
      baseDir: BaseDirectory.AppData,
    });

    const parsedProjects = JSON.parse(jsonText);

    if (!Array.isArray(parsedProjects)) {
      throw new Error("projects.jsonの内容が配列ではありません");
    }

    setProjects(parsedProjects.map((project) => normalizeProject(project)));
    console.log("projects.jsonから読み込みました");
  } catch (error) {

    console.error("projects.jsonの読み込みに失敗しました", error);
    setProjects([]);
    showMessage("error", "projects.jsonの読み込みに失敗しました。新しいデータとして開始します。");
  } finally {
    setIsDataLoaded(true);
  }
}

    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("すべて");

  //保存処理
useEffect(() => {
  if (!isDataLoaded) {
    return;
  }

  saveProjectsToFile(projects);
}, [projects, isDataLoaded]);

async function saveProjectsToFile(projectList) {
  try {
    const appDataPath = await appDataDir();

    await mkdir(appDataPath, {
      recursive: true,
    });

    const jsonText = JSON.stringify(projectList, null, 2);

    await writeTextFile(PROJECT_FILE_NAME, jsonText, {
      baseDir: BaseDirectory.AppData,
    });

    console.log("projects.jsonに保存されました");
  } catch (error) {
    console.error("projects.jsonへの保存に失敗しました", error);
    showMessage("error", "データの保存に失敗しました。アプリを閉じる前にもう一度操作してください。");
  }
}

  //イベント処理
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prevForm) => ({
    ...prevForm,
    [name]: value,
  }));
}

function handleDeleteFileFromProject(projectId, fileId) {
  setProjects((prevProjects) =>
    prevProjects.map((project) => {
      if (project.id !== projectId) {
        return project;
      }

      return {
        ...project,
        files: Array.isArray(project.files)
          ? project.files.filter((file) => file.id !== fileId)
          : [],
        updatedAt: getToday(),
      };
    })
  );
}

  async function handleRevealFileInDir(filePath) {
    try {
      if (!filePath) {
        showMessage("error", "ファイルの保存場所が登録されていません。");
        return;
      }

      await revealItemInDir(filePath);
      
    } catch (error) {
      console.error("保存場所を開けませんでした", error);
      showMessage("error", "保存場所を開けませんでした。元ファイルが移動または削除された可能性があります。");
    }
  }

  async function handleOpenFile(filePath) {
    try {
      if (!filePath) {
        showMessage("error", "ファイルのパスが登録されていません。");
        return;
      }

      await openPath(filePath);
    } catch (error) {
      console.error("ファイルを開けませんでした", error);
      showMessage("error", "ファイルを開けませんでした。元ファイルが移動または削除された可能性があります。");
    }
  }



  function handleAddProject() {
    if (form.title.trim() === "") {
      showMessage("error", "アプリ名を入力してください。");
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
        showMessage("error", "GitHub URLはhttps://またはhttp://で始まる必要があります");
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

async function handleAddFileToProject(projectId) {
  try {
    console.log("ファイル追加ボタンが押されました", projectId);

    const selectedPath = await open({
      multiple: false,
      directory: false,
    });

    if (selectedPath === null) {
      return;
    }

    if (Array.isArray(selectedPath)) {
      return;
    }

    const fileName = selectedPath.split(/[\\/]/).pop() || selectedPath;

    const newFile = {
      id: crypto.randomUUID(),
      name: fileName,
      type: "",
      size: 0,
      path: selectedPath,
      addedAt: getToday(),
    };

    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        return {
          ...project,
          files: [
            ...(Array.isArray(project.files) ? project.files : []),
            newFile,
          ],
          updatedAt: getToday(),
        };
      })
    );
  } catch (error) {
    console.error("ファイルの追加に失敗しました", error);
    showMessage("error", "ファイルの追加に失敗しました。もう一度選択してください。");
  }
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

        {message && (
          <div className={`app-message app-message-${message.type}`}>
            {message.text}
          </div>
        )}

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
            onAddFileToProject={handleAddFileToProject}
            onDeleteFileFromProject={handleDeleteFileFromProject}
            onRevealFileInDir={handleRevealFileInDir}
            onOpenFile={handleOpenFile}
          />
        </main>
      </div>
    </div>
  );
}

export default App;