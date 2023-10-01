//*? ----------------------------------------IMPORTS,LOCAL_STORAGE,ELEMENTS FROM HTML---------------------------------------------------------------

// import LS & class
import { saveInLs, loadFromLs } from "./LS/ls.js";

// init jobs array
let jobsData = loadFromLs("saved_jobs") ? loadFromLs("saved_jobs") : [];
let jobsId = loadFromLs("job_id") ? loadFromLs("job_id") : [];

// selecting elements from html
const homeCon = document.querySelector(".homeCon");
const con = document.querySelector(".con");
const jobsBtn = document.querySelector("#jobs");
const categoriesBtn = document.querySelector("#categories");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const savedJobs_btn = document.querySelector("#savedJobs_btn");
const dateData = document.querySelector("#date_data");
const timeData = document.querySelector("#time_data");

// time & date display
setInterval(() => {
  const current_day = new Date();

  const current_date = current_day.toLocaleDateString();
  const current_time = current_day.toLocaleTimeString();

  dateData.innerHTML = current_date;
  timeData.innerHTML = current_time;
}, 0);

/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

//*? ---------------------------------------------------//JOBS BTN FUNCTIONS//----------------------------------------------------------------

// event listener for jobs button
jobsBtn.addEventListener("click", () => {
  homeCon.classList.add("hidden");
  con.classList.remove("hidden");

  loader();

  jobsFetch();
});

//funnction that builds a loader before displaying content
const loader = () => {
  // loader runing
  con.innerHTML = `<div class="boxes">
    <div class="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div class="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div class="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div class="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    </div>`;
};

// function that fetch jobs
const jobsFetch = async () => {
  try {
    const response = await fetch(
      "https://remotive.com/api/remote-jobs?limit=150"
    );
    const data = await response.json();

    homeCon.innerHTML = "";
    con.innerHTML = "";

    // loop through data and calling the buildCard function
    for (let card of data.jobs) {
      buildCard(card);
    }
  } catch (error) {
    console.log(error);
  } finally {
    console.log("all set :)");
  }
};

// function that builds card for each job
const buildCard = (obj) => {
  const mainDiv = document.createElement("div");
  mainDiv.setAttribute(
    "class",
    "card border border-4 border border-warning shadow p-3 bg-body rounded rounded"
  );

  const name = document.createElement("p");
  name.setAttribute("class", "card-header");
  name.textContent = `company name : ${obj.company_name}`;

  const img = document.createElement("img");
  img.src = obj.company_logo;
  img.style = "padding-block:1.5em;";

  const title = document.createElement("h2");
  title.setAttribute("class", "titleDiv");
  title.style = "text-decoration:underline;";
  title.textContent = obj.title;

  const salary = document.createElement("p");
  salary.textContent = `salary: ${obj.salary ? obj.salary : "not mentioned"}`;
  salary.style = "padding-block:1em;";

  const description = document.createElement("div");
  description.setAttribute("class", "cardDes");
  description.style = "max-height:16rem;padding-inline:1.5em";
  description.innerHTML = obj.description;

  // see job btn
  const seeJob = document.createElement("a");
  seeJob.setAttribute("class", "btn btn-primary");
  seeJob.setAttribute("href", obj.url);
  seeJob.setAttribute("target", "_blank");
  seeJob.textContent = "see job";

  const buttonsDiv = document.createElement("div");
  buttonsDiv.setAttribute("class", "buttonsDiv");

  // save job btn
  const saveJob_btn = document.createElement("a");
  saveJob_btn.setAttribute("class", "btn btn-danger");
  saveJob_btn.textContent = "save job";

  // remove job btn
  const removeJob_btn = document.createElement("a");
  removeJob_btn.setAttribute("class", "btn btn-warning");
  removeJob_btn.textContent = "remove";

  if (jobsId.includes(obj.id)) {
    buttonsDiv.append(removeJob_btn, seeJob);

    // EL for remove job btn if its saved in LS
    removeJob_btn.addEventListener("click", () => {
      let filteredJobs = jobsData.filter((job) => job.id != obj.id);
      jobsData = filteredJobs;

      let filteredJobs_id = jobsId.filter((id) => id != obj.id);
      jobsId = filteredJobs_id;

      saveInLs("saved_jobs", filteredJobs);
      saveInLs("job_id", filteredJobs_id);

      buttonsDiv.replaceChild(saveJob_btn, removeJob_btn);
    });
  } else {
    buttonsDiv.append(saveJob_btn, seeJob);
  }

  // EL for save job btn
  saveJob_btn.addEventListener("click", () => {
    jobsData.push(obj);
    jobsId.push(obj.id);

    buttonsDiv.replaceChild(removeJob_btn, saveJob_btn);

    saveInLs("saved_jobs", jobsData);
    saveInLs("job_id", jobsId);

    // EL for remove job btn
    removeJob_btn.addEventListener("click", () => {
      let filteredJobs = jobsData.filter((job) => job.id != obj.id);
      jobsData = filteredJobs;

      let filteredJobs_id = jobsId.filter((id) => id != obj.id);
      jobsId = filteredJobs_id;

      saveInLs("saved_jobs", filteredJobs);
      saveInLs("job_id", filteredJobs_id);

      buttonsDiv.replaceChild(saveJob_btn, removeJob_btn);
    });
  });

  const type = document.createElement("p");
  type.setAttribute("class", "card-header");
  type.textContent = `type: ${obj.job_type}`;

  mainDiv.append(name, img, title, salary, description, buttonsDiv, type);
  con.append(mainDiv);
};

/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

//*? ---------------------------------------------------//CATEGORIES BTN FUNCTIONS//-------------------------------------------------------------

// event listener for categories button
categoriesBtn.addEventListener("click", () => {
  categoriesFetch();
});

// function that fetch categories name
const categoriesFetch = async () => {
  try {
    const response = await fetch(
      "https://remotive.com/api/remote-jobs/categories"
    );
    const data = await response.json();
    const finalData = data.jobs;

    buildCategories(finalData);
  } catch (error) {
    console.log(error);
  }
};

// function that builds an ul by using finalData fetch
const buildCategories = (finalData) => {
  const ul = document.querySelector(".dropdown-menu");

  ul.textContent = "";

  finalData.forEach((categoryObj) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute("class", "dropdown-item");
    a.href = "#";
    a.textContent = categoryObj.name;

    li.append(a);
    ul.append(li);

    // EL that getting the positionsByCategory_fetch
    li.addEventListener("click", () => {
      homeCon.classList.add("hidden");
      con.classList.remove("hidden");

      positionsByCategory_fetch(categoryObj.name);
    });
  });
};

// function that fetch positions by categories name
const positionsByCategory_fetch = async (position) => {
  try {
    con.innerHTML = "";
    homeCon.innerHTML = "";

    loader();

    const response = await fetch(
      `https://remotive.com/api/remote-jobs?category=${position}`
    );
    const data = await response.json();

    setTimeout(() => {
      con.innerHTML = "";
      homeCon.innerHTML = "";

      for (let card of data.jobs) {
        buildCard(card);
      }
    }, 3000);
  } catch (error) {
    console.log(error);
  }
};

/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

//*? -------------------------------------------------------//SEARCH FUNCTIONS//----------------------------------------------------------------

// event listener for search button
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  homeCon.classList.add("hidden");
  con.classList.remove("hidden");

  loader();

  if (searchInput.value == "") {
    alert("Enter a search term");
    location.reload();
  } else {
    searchFetch(searchInput.value);
  }
});

// function that fetch jobs through inputs value
const searchFetch = async (search) => {
  try {
    const response = await fetch(
      `https://remotive.com/api/remote-jobs?search=${search}`
    );
    const data = await response.json();

    if (data.jobs < 1) {
      alert("No jobs found");
      location.reload();
    } else {
      con.innerHTML = "";
      homeCon.innerHTML = "";

      for (let card of data.jobs) {
        buildCard(card);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

//*? -------------------------------------------------------//SAVED JOBS FUNCTIONS//----------------------------------------------------------------

// function that builds card for each saved job
const buildSaved_card = (obj) => {
  const mainDiv = document.createElement("div");
  mainDiv.setAttribute(
    "class",
    "card border border-4 border border-warning shadow p-3 mb-5 bg-body rounded rounded"
  );

  const name = document.createElement("p");
  name.setAttribute("class", "card-header");
  name.textContent = `company name : ${obj.company_name}`;

  const img = document.createElement("img");
  img.src = obj.company_logo;
  img.style = "padding-block:1.5em;";

  const title = document.createElement("h2");
  title.setAttribute("class", "titleDiv");
  title.style = "text-decoration:underline;";
  title.textContent = obj.title;

  const salary = document.createElement("p");
  salary.textContent = `salary: ${obj.salary ? obj.salary : "not mentioned"}`;
  salary.style = "padding-block:1em;";

  const description = document.createElement("div");
  description.setAttribute("class", "cardDes");
  description.style = "max-height:16rem;padding-inline:1.5em";
  description.innerHTML = obj.description;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.setAttribute("class", "buttonsDiv");

  // see job btn
  const seeJob = document.createElement("a");
  seeJob.setAttribute("class", "btn btn-primary");
  seeJob.setAttribute("href", obj.url);
  seeJob.setAttribute("target", "_blank");
  seeJob.textContent = "see job";

  // remove job btn
  const removeJob_btn = document.createElement("a");
  removeJob_btn.setAttribute("class", "btn btn-warning");
  removeJob_btn.textContent = "remove";

  removeJob_btn.addEventListener("click", () => {
    let filteredJobs = jobsData.filter((job) => job.id != obj.id);
    jobsData = filteredJobs;

    let filteredJobs_id = jobsId.filter((id) => id != obj.id);
    jobsId = filteredJobs_id;

    saveInLs("saved_jobs", filteredJobs);
    saveInLs("job_id", filteredJobs_id);

    mainDiv.remove();

    if (jobsId < 1) {
      const p = document.createElement("p");
      p.innerHTML = "no saved jobs...";
      p.className = "savedJob_p";
      con.append(p);
    }
  });

  const type = document.createElement("p");
  type.setAttribute("class", "card-header");
  type.textContent = `type: ${obj.job_type}`;

  buttonsDiv.append(removeJob_btn, seeJob);
  mainDiv.append(name, img, title, salary, description, buttonsDiv, type);
  con.append(mainDiv);
};

// event listener for saved job button
savedJobs_btn.addEventListener("click", () => {
  homeCon.classList.add("hidden");
  con.classList.remove("hidden");

  loader();

  if (jobsId < 1) {
    homeCon.innerHTML = "";
    con.innerHTML = "";

    const p = document.createElement("p");
    p.innerHTML = "no saved jobs...";
    p.className = "savedJob_p";
    con.append(p);
  } else {
    setTimeout(() => {
      con.innerHTML = "";
      homeCon.innerHTML = "";

      for (const favorites of jobsData) {
        buildSaved_card(favorites);
      }
    }, 3000);
  }
});
/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
