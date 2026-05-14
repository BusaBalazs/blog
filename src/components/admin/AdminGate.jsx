import { useEffect, useState } from "react";
import { auth } from "../../data/firebase";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  onAuthStateChanged,
} from "firebase/auth";
import { ALLOWED_ADMINS } from "../../data/admins";

//-----------------------------------------------------
//-----------------------------------------------------
//-----------------------------------------------------
const AdminGate = ({ children }) => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [sent, setSent] = useState(false);

  //-----------------------------------------------------
  useEffect(() => {
    let used = false;

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let storedEmail = localStorage.getItem("adminEmail");
      if (!storedEmail) {
        storedEmail = window.prompt("Confirm your email");
      }

      if (!used) {
        used = true;
        signInWithEmailLink(auth, storedEmail, window.location.href)
          .then(() => {
            localStorage.removeItem("adminEmail");
            // clean URL (remove oobCode)
            window.history.replaceState({}, document.title, "/admin");
          })
          .catch(() => {
            // swallow invalid-action-code silently
          });
      }
    }

    return onAuthStateChanged(auth, setUser);
  }, []);

  //-----------------------------------------------------
  if (user) {
    if (!ALLOWED_ADMINS.includes(user.email)) {
      return <div className="p-10 text-red-600">Access denied</div>;
    }
    return children;
  }

  //-----------------------------------------------------
  const sendLink = async () => {
    if (!ALLOWED_ADMINS.includes(email)) {
      alert("Not allowed");
      return;
    }

    await sendSignInLinkToEmail(auth, email, {
      url: window.location.origin + "/admin",
      handleCodeInApp: true,
    });

    localStorage.setItem("adminEmail", email);
    setSent(true);
  };

  //-----------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl mb-3">Admin login</h2>

        {sent ? (
          <p className="text-green-600">Check your email for the login link</p>
        ) : (
          <>
            <input
              className="border p-2 w-full mb-3 text-text-900"
              placeholder="admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={sendLink}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Send magic link
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminGate;