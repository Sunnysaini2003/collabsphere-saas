import { useEffect, useState } from "react";
import API from "../services/api";
import { FaRocket, FaPlus, FaSignOutAlt, FaFolder } from "react-icons/fa";
console.log("DASHBOARD LOADED");

export default function Dashboard() {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/api/projects");
      console.log("PROJECTS:", res.data);
      setProjects(res.data);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      alert("Auth failed");
    }
  };

  const createProject = async () => {
    const name = prompt("Enter project name");
    if (!name) return;

    try {
      await API.post("/api/projects", { name });
      fetchProjects();
    } catch (err) {
      alert("Create failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="d-flex">

      {/* SIDEBAR */}
      <div style={{
        width:"250px",
        height:"100vh",
        background:"#0f172a",
        color:"white",
        padding:"25px",
        position:"fixed"
      }}>
        <h4><FaRocket/> CollabSphere</h4>
        <hr />
        <p style={{opacity:.7}}><FaFolder/> Projects</p>
      </div>

      {/* MAIN */}
      <div style={{marginLeft:"270px", width:"100%", padding:"40px"}}>

        <div className="d-flex justify-content-between">
          <h2>Dashboard</h2>
          <button className="btn btn-danger" onClick={logout}>
            <FaSignOutAlt/> Logout
          </button>
        </div>

        <button className="btn btn-dark mt-4" onClick={createProject}>
          <FaPlus/> New Project
        </button>

        <div className="row mt-4">
          {projects.map((p)=>(
            <div className="col-md-4" key={p.id}>
              <div className="card p-4 shadow-lg" style={{borderRadius:"18px"}}>
                <h5><FaFolder/> {p.name}</h5>
                <p style={{opacity:.6}}>Project #{p.id}</p>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={()=>window.location.href=`/project/${p.id}`}
                >
                  Open →
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}