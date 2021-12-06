import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router";
import Sidebar from "../Sidebar";
import "../../assets/css/features.css";
import Cookies from "universal-cookie";

function Folders() {
  let { id } = useParams();
  const [folderItems, setFolderItems] = useState([]);
  let isFull = false;
  const [checked, setChecked] = useState(true);
  const [updateID, setUpdateID] = useState(null);

  useEffect(() => {
    getFolderItems();
    async function getFolderItems() {
      const response = await fetch(
        "https://localhost:44392/api/folders/getfolderprojects/" + id
      );
      const get = await response.json();
      setFolderItems(get);
    }
  }, []);

  const display = {
    display: "none",
  };
  const mr = {
    marginRight: "1em",
  };

  const handleSubmitEditFolder = (e) => {
    e.preventDefault();
    if (!e.target.projectname.value) {
      alert("Proje adı boş olamaz!");
    } else if (!e.target.projectid.value) {
      alert("Proje bulunamadı!");
    } else {
      fetch("https://localhost:44392/api/projects/updateproject", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: e.target.projectid.value,
          name: e.target.projectname.value,
          status: checked,
        }),
      }).then((res) => {
        getFolderItems();
        async function getFolderItems() {
          const response = await fetch(
            "https://localhost:44392/api/folders/getfolderprojects/" + id
          );
          const get = await response.json();
          setFolderItems(get);
        }
      });
    }
  };

  const handleSubmitDeleteProject = (e) => {
    e.preventDefault();
    fetch(
      "https://localhost:44392/api/projects/deleteproject",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: e.target.projectid.value
        })
      }
    ).then((res) => {
      getFolderItems();
      async function getFolderItems() {
        const response = await fetch(
          "https://localhost:44392/api/folders/getfolderprojects/" + id
        );
        const get = await response.json();
        setFolderItems(get);
      }
    });
  };

  if (folderItems.length > 0) {
    isFull = true; 
  }

  const cookie = new Cookies();
  var login = cookie.get("login");
  if (typeof login === "undefined") {
    login = "false";
    return <Navigate to="/login" />;
  }
  return (
    <main>
      <Sidebar />
      <div className="container">
        <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
          {isFull === true
            ? folderItems.map((item) => (
                <div>
                  <div className="col">
                    <div className="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg">
                      <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                        <h4 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">
                          {item.name}
                        </h4>
                        <ul className="d-flex list-unstyled mt-auto">
                          <a
                            href="/"
                            className="text-white"
                            style={mr}
                            aria-label="Edit project"
                            data-bs-toggle="modal"
                            data-bs-target={"#editproject" + item.id}
                          >
                            <i class="bi bi-pencil-square"></i>
                          </a>
                          <a
                            href="/"
                            className="text-white"
                            aria-label="Edit project"
                            data-bs-toggle="modal"
                            data-bs-target={"#deleteproject" + item.id}
                          >
                            <i class="bi bi-trash"></i>
                          </a>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    className="modal fade"
                    id={"editproject" + item.id}
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Edit Project
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <form onSubmit={handleSubmitEditFolder}>
                          <div className="modal-body">
                            <div className="mb-3">
                              <label
                                htmlFor="projectname"
                                className="col-form-label"
                              >
                                Project Name:
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="projectname"
                                placeholder={item.name}
                              />
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor="projectisactive"
                                className="col-form-label"
                              >
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
                            <div className="mb-3" style={display}>
                              <label
                                htmlFor="projectisactive"
                                className="col-form-label"
                              >
                                Project ID:
                              </label>
                              <br />
                              <input
                                type="text"
                                id="projectid"
                                value={item.id}
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
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div
                    className="modal fade"
                    id={"deleteproject" + item.id}
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Delete Project
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <form onSubmit={handleSubmitDeleteProject}>
                          <div className="modal-body">
                            <div className="mb-3">
                              İlgili veriyi silmek istediğinize emin misiniz?
                            </div>
                            <div className="mb-3" style={display}>
                              <label
                                htmlFor="projectid"
                                className="col-form-label"
                              >
                                Project ID:
                              </label>
                              <br />
                              <input
                                type="text"
                                id="projectid"
                                value={item.id}
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
                              className="btn btn-danger"
                              data-bs-dismiss="modal"
                            >
                              Delete
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>
    </main>
  );
}

export default Folders;
