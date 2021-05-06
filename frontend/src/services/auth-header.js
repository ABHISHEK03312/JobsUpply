export default function authHeader() {
    let user = JSON.parse(localStorage.getItem('user'));
  
    if (user.token) {
      // return {
      //   auth: {
      //   username: user.user.email,
      //   password: user.user.password
      // }};
      console.log(user.token)
      return { Authorization: 'Bearer ' + user.token };
    } else {
      console.log("Error. No token found");
      return { Authorization: 'Bearer ' + user.token };
    }
  }