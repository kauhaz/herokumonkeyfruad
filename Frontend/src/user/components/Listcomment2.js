import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import usercontext from "../context/usercontext";
import "./Listcomment2.css";
import * as moment from "moment";
import "moment/locale/th";
import _ from "lodash";
import ClipLoader from "./clipLoader";
const Listcomment2 = ({
  commentmore,
  handledeletetorerender,
  handleedittorerender,
}) => {
  const [imagesFile, setImagesFile] = useState(); //สร้าง State เพื่อเก็บไฟล์ที่อัพโหลด
  const [files, Setfiles] = useState();
  const [error, Seterror] = useState();
  const [isActive, setIsActive] = useState(false);
  const onClick = () => setIsActive(!isActive);
  const [item, Setitem] = useState([]);
  const [checkedittext, Setcheckedittext] = useState(false);
  const [textcomment, Settextcomment] = useState();
  const [edittextcomment, Setedittextcomment] = useState();
  const [imagecomment, Setimagecomment] = useState();
  const [loading, Setloading] = useState();
  let { user, setUser } = useContext(usercontext);

  const FileUpload = (event) => {
    event.preventDefault(); // ใส่ไว้ไม่ให้ refresh หน้าเว็บ
    setImagesFile([]); // reset state รูป เพื่อกันในกรณีที่กดเลือกไฟล์ซ้ำแล้วรูปต่อกันจากอันเดิม
    let files = event.target.files; //ใช้เพื่อแสดงไฟลทั้งหมดที่กดเลือกไฟล
    Setfiles([...files]);
    Seterror();

    //ทำการวนข้อมูลภายใน Array
    for (var i = 0; i < files.length; i++) {
      let reader = new FileReader(); //ใช้ Class  FileReader เป็นตัวอ่านไฟล์
      reader.readAsDataURL(files[i]); //เป็นคำสั่งสำหรับการแปลง url มาเป็น file
      reader.onloadend = () => {
        // ใส่ข้อมูลเข้าไปยัง state ผาน  setimagesPreviewUrls
        setImagesFile((prevState) => [...prevState, reader.result]);
        //  PrevState เป็น Parameter ในการเรียก State ก่อนหน้ามาแล้วรวม Array กับ fileที่อัพโหลดเข้ามา
      };
    }
  };

  const handledeleteimage = async (index) => {
    try {
      imagesFile.splice(index, 1);
      setImagesFile([...imagesFile]);

      files.splice(index, 1);
      Setfiles([...files]);
    } catch (err) {
      console.log(err);
    }
  };

  const deleted = async (commentid) => {
    const postdelete = await Axios.post(
      `http://localhost:7000/post/delete/comment/${commentid}`
    );
    setIsActive(false);
    handledeletetorerender();
  };

  const edit = async () => {
    Setcheckedittext(true);
    setIsActive(false);
  };
  const handleedit = async (commentid) => {
    try {
      let formdata = new FormData();
      _.forEach(files, (file) => {
        formdata.append("photocomment", file);
      });
      formdata.append("edittextcomment", edittextcomment);
      formdata.append("photocomment", commentmore.photocomment);
      Setloading(true);
      const editcomment = await Axios.post(
        `http://localhost:7000/post/edit/comment/${commentid}`,
        formdata
      );
      handleedittorerender();
      setImagesFile([]);
      Setfiles();
      Setcheckedittext(false);
      Setloading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const gg = async () => {
    try {
      if (commentmore) {
        Setedittextcomment(commentmore.textcomment);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    gg();
  }, [commentmore]);

  return (
    <div>
      {commentmore ? (
        <div className="row mypostcommentrow">
          <div className="column1 mypostcommentrow1">
            <div class="vl"></div>
            <div className="mypost-comment-img1">
              <div className="mypost-profilecomment-img1">
                {commentmore.photoURL ? (
                  <img
                    className="img-circle"
                    src={`${commentmore.photoURL.url}`}
                  />
                ) : (
                  <img className="img-circle" src="/img/profile.png" />
                )}
              </div>
              <div className="mypost-comment-name1">
                {commentmore ? "@" : null}
                {commentmore.username}
                <span className="mypost-comment-time1">
                  {" "}
                  {moment(new Date(commentmore.datetime.seconds * 1000)).format(
                    "LTS"
                  )}{" "}
                </span>
              </div>
              <br />
              {loading ? (
                <div className="col-lg-10 col-4">
                  <ClipLoader loading={loading} />
                </div>
              ) : checkedittext ? (
                <div className="row">
                  <div className="commenttextarea">
                    <textarea
                      value={edittextcomment}
                      onChange={(e) => {
                        Setedittextcomment(e.target.value);
                      }}
                    ></textarea>
                  </div>
                  <div className="row mypost-comment-commentsall">
                    <div className="container-img-holder-imgpreview1">
                      <label>
                        <img className="uploadprove1" src="/img/addphoto.png" />
                        <input
                          id="FileInput"
                          className="uploadsmypostcomment"
                          type="file"
                          onChange={FileUpload}
                          multiple
                          accept="image/png, image/jpeg , image/jpg"
                        />
                      </label>
                    </div>
                    {imagesFile
                      ? imagesFile.map((imagePreviewUrl, index) => {
                          return (
                            <div>
                              <img
                                key={index}
                                className="imgpreview1"
                                alt="previewImg"
                                src={imagePreviewUrl}
                                style={{ overflow: "hidden" }}
                                onMouseOver={(e) =>
                                  (e.currentTarget.style = {
                                    transform: "scale(1.25)",
                                    overflow: "hidden",
                                  })
                                }
                                onMouseOut={(e) =>
                                  (e.currentTarget.style = {
                                    transform: "scale(1)",
                                    overflow: "hidden",
                                  })
                                }
                              />
                              <img
                                src="/img/delete.png"
                                onClick={() => handledeleteimage(index)}
                              />
                            </div>
                          );
                        })
                      : commentmore
                      ? commentmore.photocomment
                        ? commentmore.photocomment.map((doc) => {
                            return <img src={doc.url}></img>;
                          })
                        : null
                      : null}
                  </div>

                  <div className="buttoncommentsave1">
                    <button
                      className="buttoncommentsave2"
                      onClick={() => handleedit(commentmore.commentid)}
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mypost-comment-comments1">
                  <div className="mypostcomment1">
                    {commentmore.textcomment}
                  </div>

                  {commentmore.photocomment
                    ? commentmore.photocomment.map((doc) => {
                        return (
                          <div>
                            <img
                              className="imgcommentmypost"
                              src={`${doc.url}`}
                            />
                          </div>
                        );
                      })
                    : null}
                </div>
              )}
            </div>
          </div>
          {user && commentmore.userid == user.uid ? (
            <div className="column2 mypostcommentrow2">
              <div className="menu-containermypostcommentsetting">
                <div onClick={onClick} className="mypostcommentbuttonsetting">
                  <img
                    className="mypostcommentimg-setting"
                    src="/img/setting.png"
                    alt="avatar"
                  ></img>
                </div>

                <div
                  className={`mypostcommentmenusetting ${
                    isActive ? "active" : "inactive"
                  }`}
                >
                  <ul className="ul-mypostcommentmenusetting">
                    <li className="li-mypostcommentmenusetting">
                      <a
                        className="a-mypostcommentmenusetting"
                        onClick={() => edit(commentmore.commentid)}
                      >
                        แก้ไขคอมเมนต์
                      </a>
                    </li>
                    <li className="li-mypostcommentmenusetting">
                      <a
                        className="a-mypostcommentmenusetting"
                        onClick={() => deleted(commentmore.commentid)}
                      >
                        {" "}
                        ลบคอมเมนต์{" "}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
export default Listcomment2;
