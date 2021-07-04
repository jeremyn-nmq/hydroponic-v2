import fb from "./firebase";

let getDataFromFb = fb.database().ref();
getDataFromFb.get().then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
const fbData = fb.database();
console.log(fbData)

