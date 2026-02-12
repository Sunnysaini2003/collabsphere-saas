import { useEffect, useState } from "react";
import axios from "axios";
import { FaRocket, FaPlus, FaSignOutAlt, FaFolder } from "react-icons/fa";
const token = localStorage.getItem("token");

// if(!token){
//   window.location.href="/";
// }

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem("token");
  const API = "https://collabsphere-saas.onrender.com";

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const res = await axios.get(`${API}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProjects(res.data);
  };

  const createProject = async () => {
    const name = prompt("Project name");
    if (!name) return;

    await axios.post(`${API}/api/projects`, { name }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchProjects();
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
        background:"rgba(0,0,0,0.6)",
        backdropFilter:"blur(10px)",
        padding:"25px",
        position:"fixed"
      }}>
        <h4><FaRocket/> CollabSphere</h4>
        <hr />

        <p style={{opacity:.7}}><FaFolder/> Projects</p>
      </div>

      {/* MAIN */}
      <div style={{marginLeft:"270px", width:"100%", padding:"40px"}}>

        {/* TOP BAR */}
        <div className="d-flex justify-content-between">
          <h2>Dashboard</h2>

          <button className="btn btn-danger" onClick={logout}>
            <FaSignOutAlt/> Logout
          </button>
        </div>

        {/* CREATE */}
        <button className="btn btn-dark mt-4" onClick={createProject}>
          <FaPlus/> New Project
        </button>

        {/* PROJECT GRID */}
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