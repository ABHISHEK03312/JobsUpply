import axios from "axios";

const API_URL = "http://localhost:8000/";

const register = (Email, Password) => {
  return axios.post(API_URL + "backend/database/Users", {
    email: Email,
    password: Password,
  })
  .then((response) => {
    if (response.data.token) {
      console.log(response.data.token);
      let data = {"token": response.data.token, "user": response.data}
      localStorage.setItem("user", JSON.stringify(data));
    }

    return response.data;
  });
};

const update = (updatedDict) => {
  return axios.put(API_URL + "backend/database/Users", updatedDict)
  .then((response) => {
    if (response.data.email) {
      console.log(response.data.email+" profile updated.");
      let currUser = JSON.parse(localStorage.getItem("user"));
      currUser.user.name = updatedDict.name;
      currUser.user.university = updatedDict.university;
      currUser.user.major = updatedDict.major;
      if (updatedDict.minor.constructor == Object || updatedDict.minor == "" || updatedDict.minor == "{}"){
        currUser.user.minor = "None";
      }
      else {
        currUser.user.minor = updatedDict.minor;
      }
      localStorage.setItem("user", JSON.stringify(currUser));
    }
    return response.data;
  });
};

const updateSkills = (updatedDict) => {
  console.log(updatedDict);
  return axios.put(API_URL + "backend/database/Users", updatedDict)
  .then((response) => {
    if (response.data.email) {
      console.log(response.data.email+" skills updated.");
      let currUser = JSON.parse(localStorage.getItem("user"));
      currUser.user.skills = updatedDict.skills;
      localStorage.setItem("user", JSON.stringify(currUser));
    }
    return response.data;
  });
};

const login = (Email, Password) => {
  return axios
    .post(API_URL + "token-auth/", {
      email: Email,
      password: Password,
    })
    .then((response) => {
      if (response.data.token) {
        console.log(response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const getOTP = async (email) => {
  let res = await axios.get(API_URL + "backend/API/genOTP?email=" + email);
  return res.data;
}

const updatePassword = async (email, newpass) => {
  let res = await axios.put(API_URL + "backend/auth", { "email": email, "newpassword": newpass });
  if (res.data == 1) {
    console.log("Password change successful");
  }
  else if (res.data == 0) {
    console.log("Password change failed");
  }
  else {
    console.log("An error may have occured");
    console.log(res.data);
  }
  return res.data;
}

const logout = async () => {
  let res = await localStorage.removeItem("user");
  console.log("Logged out successfully.")
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  register,
  update,
  login,
  logout,
  getCurrentUser,
  updateSkills,
  getOTP,
  updatePassword
};