import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import Cookies from "universal-cookie";
import {Navigate, Redirect } from 'react-router-dom'
import "../assets/css/sidebars.css";
import "../assets/js/sidebars";

export default function Sidebar() {
  const style = {
    marginRight: ".5em",
  };
  const addbtn = {
    float: "right",
    fontSize: "17px",
  };
  const cookie = new Cookies();
  let userid = cookie.get("userid");
  const [folders, setFolders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [checked, setChecked] = useState(true);
  const [projectSelected, setProjectSelected] = useState(null);
  const [folderID, setFolderID] = useState(null);
  const [projectID, setProjectID] = useState(null); 

  useEffect(() => {
    getFolders();
    getProjects();

    async function getFolders() {
      const response = await fetch(
        "https://localhost:44392/api/folders/getfolders/" + userid
      );
      const get = await response.json();

      setFolders(get);
    }

    async function getProjects() {
      const response = await fetch(
        "https://localhost:44392/api/projects/getprojects/" + userid
      );
      const get = await response.json();

      setProjects(get);
    }
  }, []);

  const handleSubmitAddFolder = (e) => {
    e.preventDefault();
    if (!e.target.foldername.value) {
      alert("Dosya adı boş olamaz!");
    } else {
      let foldername = e.target.foldername.value;

      fetch("https://localhost:44392/api/folders/addfolder", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userid,
          name: foldername,
        }),
      }).then((res) => {
        getFolders();
        async function getFolders() {
          const response = await fetch(
            "https://localhost:44392/api/folders/getfolders/" + userid
          );
          const get = await response.json();

          setFolders(get);
        }
      });
    }
  };

  const handleSubmitAddProject = (e) => {
    e.preventDefault();
    if (!e.target.projectname.value) {
      alert("Proje adı boş olamaz!");
    } else {
      let projectname = e.target.projectname.value;
      let isactive = checked;

      fetch("https://localhost:44392/api/projects/addproject", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userid,
          name: projectname,
          status: isactive,
        }),
      }).then((res) => {
        getProjects();
        async function getProjects() {
          const response = await fetch(
            "https://localhost:44392/api/projects/getprojects/" + userid
          );
          const get = await response.json();

          setProjects(get);
        }
      });
    }
  };

  const handleSubmitAddProjectToFolder = (e) => {
    e.preventDefault();
    fetch("https://localhost:44392/api/folders/additem", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        folderid: folderID,
        projectid: e.target.projectSelected.value,
        status: true,
      }),
    });
  };

  const handleSubmitAddToDoProject = (e) => {
    e.preventDefault();
    if (!e.target.todoname.value) {
      alert("ToDo adı boş olamaz!'");
    } else if (!e.target.tododescription.value) {
      alert("Todo açıklaması boş olamaz!");
    } else {
      fetch("https://localhost:44392/api/todo/addtodo", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectid: projectID,
          name: e.target.todoname.value,
          description: e.target.tododescription.value,
          status: checked,
        }),
      });
    }
  };

  const logout = (e) => {
    e.preventDefault();
    cookie.remove("login", { path: "/" });
    cookie.remove("userid", { path: "/" });
    window.location.reload(true);
  }

  const options = [];
  projects.map((item) => {
    options.push({
      value: item.id,
      label: item.name,
    });
  });
  return (
    <div className="flex-shrink-0 p-3 bg-white" style={{ width: "260px" }}>
      <a
        href="/"
        className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom"
      >
        <span className="fs-5 fw-semibold">
          <i className="bi bi-menu-button-wide-fill" style={style}></i>
          ToDo App
        </span>
      </a>
      <ul className="list-unstyled ps-0">
        <li className="mb-1">
          <button
            className="btn btn-toggle align-items-center rounded collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#folders-collapse"
            aria-expanded="true"
          >
            Klasörler
          </button>
          <a
            className="link-secondary"
            href="/"
            aria-label="Add a new folder"
            style={addbtn}
            data-bs-toggle="modal"
            data-bs-target="#addfolder"
          >
            <i className="bi bi-plus-square"></i>
          </a>
          <div className="collapse show" id="folders-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              {folders.map((folder, index) => (
                <li>
                  <a
                    href={"/folders/" + folder.id}
                    className="link-dark rounded"
                  >
                    {folder.name}
                  </a>
                  <a
                    className="link-secondary"
                    href="/"
                    aria-label="Add a new report"
                    data-bs-toggle="modal"
                    data-bs-target={"#addprojecttofolder" + folder.id}
                  >
                    <i className="bi bi-plus-circle"></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </li>
        <li className="mb-1">
          <button
            className="btn btn-toggle align-items-center rounded collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#projects-collapse"
            aria-expanded="true"
          >
            Projeler
          </button>
          <a
            className="link-secondary"
            href="/"
            aria-label="Add a new project"
            style={addbtn}
            data-bs-toggle="modal"
            data-bs-target="#addproject"
          >
            <i className="bi bi-plus-square"></i>
          </a>
          <div className="collapse show" id="projects-collapse">
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              {projects.map((project, index) => (
                <li>
                  <a
                    href={"/projects/" + project.id}
                    className="link-dark rounded"
                  >
                    {project.name}
                  </a>
                  <a
                    className="link-secondary"
                    href="/"
                    aria-label="Add a new report"
                    data-bs-toggle="modal"
                    data-bs-target={"#addtodoproject" + project.id}
                  >
                    <i className="bi bi-plus-circle"></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>
      <form onSubmit={logout}>
        <button className="btnlogout">
          <i class="bi bi-box-arrow-left btnlogouticon"></i>
          Çıkış Yap
        </button>
      </form>

      <div
        className="modal fade"
        id="addfolder"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add Folder
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmitAddFolder}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Folder Name:
                  </label>
                  <input type="text" className="form-control" id="foldername" />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="addproject"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add Project
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmitAddProject}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="projectname" className="col-form-label">
                    Project Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="projectname"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="projectisactive" className="col-form-label">
                    Project Status:
                  </label>
                  <br />
                  <input
                    type="checkbox"
                    id="projectisactive"
                    defaultChecked={checked}
                    onChange={() => setChecked(!checked)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {folders.map((folder, index) => (
        <div
          className="modal fade"
          id={"addprojecttofolder" + folder.id}
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add Project To Folder
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmitAddProjectToFolder}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="projectSelected" className="col-form-label">
                      Project:
                    </label>
                    <Select
                      name="projectSelected"
                      value={projectSelected}
                      onChange={(val) => setProjectSelected(val)}
                      options={options}
                      isClearable="true"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={() => setFolderID(folder.id)}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ))}
      {projects.map((project, index) => (
        <div
          className="modal fade"
          id={"addtodoproject" + project.id}
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add ToDo To Project
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmitAddToDoProject}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="todoname" className="col-form-label">
                      ToDo Name:
                    </label>
                    <input type="text" className="form-control" id="todoname" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tododescription" className="col-form-label">
                      ToDo Description:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="tododescription"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="projectisactive" className="col-form-label">
                      ToDo Status:
                    </label>
                    <br />
                    <input
                      type="checkbox"
                      id="projectisactive"
                      defaultChecked={checked}
                      onChange={() => setChecked(!checked)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={() => setProjectID(project.id)}
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
