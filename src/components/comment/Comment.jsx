import { addDoc, collection, getDoc, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { fireDB } from "../../firebase/FirebaseConfig";
import { Navigate, useParams } from "react-router-dom";


function Comment() {
  const [text, setText] = useState();
  const [userName, setUserName] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    const parsedAdmin = JSON.parse(admin);
    const userName = parsedAdmin?.displayName;
    setUserName(userName)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userName == "") {
      Navigate("/adminLogin");
      return;
    }
    try {
      const commentRef = collection(fireDB, 'blogPost', id, 'comments');
      await addDoc(commentRef, {
        name: userName,
        text,
        timestamp: serverTimestamp(),
      });
      setText('');

    } catch (err) {
      console.log("Error adding comment", err);
    }
  };

  return (
    <div className="container py-5 px-3 px-md-5 mt-2 ">
      <div className="bg-white shadow p-4 rounded mb-5">
        <h4 className="mb-4 text-success">Leave a Comment</h4>

        <form onSubmit={handleSubmit}>
          {/* <div className="mb-3">
            <input
              type="text" 
              className="form-control"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(userName)}
              required
            />
          </div> */}

          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Your comment"
              rows="4"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-success">
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
}

export default Comment;
