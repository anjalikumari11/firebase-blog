import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { create } from "zustand";
import { auth, fireDB } from "../firebase/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const UseGoogleLoginStore = create((set) => ({
    user: null,

    setUser: (user) => {
        localStorage.setItem("admin", JSON.stringify(user));
        set({ user });
    },

    getUser: () => {
        const user = localStorage.getItem("admin");
        if (user) {
            const parsedUser = JSON.parse(user);
            set({ user: parsedUser });
            return parsedUser;
        }
        return null;
    },

    loginWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const { isNewUser } = result._tokenResponse || {};
            if (isNewUser) {
                await UseGoogleLoginStore.getState().createUserInFirestore(user);
            }

            // Save user to store and localStorage
            UseGoogleLoginStore.getState().setUser(user);

            console.log("User", user);
            console.log("Access Token:", token);
            toast.success("Login with Google.")

        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    },

    createUserInFirestore: async (user) => {
        try {
            await setDoc(doc(fireDB, "users", user.uid), {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: new Date(),
            });
            console.log("New user created in Firestore");
        } catch (err) {
            console.log("Error creating Firestore user:", err.message);
        }
    },

    logout: async () => {
        try {
            await auth.signOut();
            localStorage.removeItem("admin");
            set({ user: null });
            toast.success("Logout Successfully!")
            console.log("User logged out");
        } catch (err) {
            console.error("Logout failed:", err.message);
        }
    }
}));

export default UseGoogleLoginStore;
