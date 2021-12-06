import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import Sidebar from "../Sidebar";
import { Navigate } from "react-router-dom";

function Dashboard() {
  let isFull = false;
  const [folders, setFolders] = useState([]);
  const [checked, setChecked] = useState(true);
  const display = {
    display: "none",
  };
  const mr = {
    marginRight: "1em",
  };

  useEffect(() => {
    getFolders();
    async function getFolders() {
      const response = await fetch(
        "https://localhost:44392/api/folders/getfolders"
      );
      const get = await response.json();

      setFolders(get);
    }
  }, []);

  const handleSubmitEditFolder = (e) => {
    e.preventDefault();
    if (!e.target.foldername.value) {
      alert("Dosya adı boş olamaz!");
    } else {
      fetch("https://localhost:44392/api/folders/updatefolder", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: e.target.folderid.value,
          name: e.target.foldername.value,
        }),
      }).then((res) => {
        getFolders();
        async function getFolders() {
          const response = await fetch(
            "https://localhost:44392/api/folders/getfolders"
          );
          const get = await response.json();

          setFolders(get);
        }
      });
    }
  };

  const handleSubmitDeleteFolder = (e) => {
    e.preventDefault();
    fetch("https://localhost:44392/api/folders/deletefolder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: e.target.folderid.value,
      }),
    }).then((res) => {
      getFolders();
      async function getFolders() {
        const response = await fetch(
          "https://localhost:44392/api/folders/getfolders"
        );
        const get = await response.json();

        setFolders(get);
      }
    });
  };

  if (folders.length > 0) {
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
            ? folders.map((item) => (
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
                            aria-label="Edit Folder"
                            data-bs-toggle="modal"
                            data-bs-target={"#editfolder" + item.id}
                          >
                            <i class="bi bi-pencil-square"></i>
                          </a>
                          <a
                            href="/"
                            className="text-white"
                            aria-label="Delete Folder"
                            data-bs-toggle="modal"
                            data-bs-target={"#deletefolder" + item.id}
                          >
                            <i class="bi bi-trash"></i>
                          </a>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    className="modal fade"
                    id={"editfolder" + item.id}
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Edit Folder
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
                                Folder Name:
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="foldername"
                                placeholder={item.name}
                              />
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor="folderisactive"
                                className="col-form-label"
                              >
                                Folder Status:
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
                                Folder ID:
                              </label>
                              <br />
                              <input
                                type="text"
                                id="folderid"
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
                    id={"deletefolder" + item.id}
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Delete Folder
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <form onSubmit={handleSubmitDeleteFolder}>
                          <div className="modal-body">
                            <div className="mb-3">
                              İlgili veriyi silmek istediğinize emin misiniz?
                            </div>
                            <div className="mb-3" style={display}>
                              <label
                                htmlFor="projectid"
                                className="col-form-label"
                              >
                                Folder ID:
                              </label>
                              <br />
                              <input
                                type="text"
                                id="folderid"
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

export default Dashboard;
