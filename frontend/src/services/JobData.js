import axios from "axios";
import authHeader from "./auth-header";
import getCurrentUser from "./auth.service"
const API_URL = "http://localhost:8000/";

const jobQuery = async () => {
    let user = JSON.parse(localStorage.getItem('user'));
    const res = await axios.get(API_URL+"backend/API/Recommend/Jobs?email="+user.user.email);
    if (res.data == 0) {
        console.log("error in fetching job data");
        return;
    }
    console.log(res.data);
    const industry=Object.keys(res.data);
    console.log(industry.toString);
    const response = await axios.get(API_URL+"backend/database/JobCache?industries="+industry.toString());
    console.log(response.data);
    console.log("before return");
    return response.data;
};

const courseQuery = async (courseUrl) =>{
    if (courseUrl!==""){
        const resp = await axios.post(API_URL+"backend/database/Courses/get", {"url":courseUrl});
        return resp.data;
    }
    return {};
};

const courseRecommendation = async (userSkills, jobSkills) =>{
    let data={}
    data["jobSkills"]=jobSkills;
    data["userSkills"]=userSkills;
    const resp = await axios.post(API_URL+"backend/API/Recommend/Courses", data);
    console.log(resp.data)
    return resp.data;
};

export default {
    jobQuery,
    courseQuery,
    courseRecommendation
  };