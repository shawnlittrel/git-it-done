var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

function getRepoIssues(repo){
    //make a get request to the URL
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl)
    .then(function(response){
        //request was successful
        if (response.ok){
            response.json()
            .then(function(data){
                console.log(data);
                displayIssues(data);

                //check if api has paginated issues
                if(response.headers.get("Link")){
                    displayWarning(repo);
                }
            })
        }
        else{
            //if not successful redirect to home page
            document.location.replace("./index.html");
        }
    })
};

function getRepoName(){
    //find query string on document
    var queryString = document.location.search;
    //pull repo name out of query string
    var repoName = queryString.split("=")[1];
    //if repo exists, fetch data and display name on page
    if(repoName){
        getRepoIssues(repoName);
        repoNameEl.textContent = repoName;
    }
    //otherwise redirect to index.html
    else{
        document.location.replace("./index.html");
    }
}

function displayIssues(issues){
    if(issues.length === 0){
        issueContainerEl.textContent = "This repo has no open issues."
    }
    for (i = 0; i < issues.length; i++){
        //create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");
        console.log('issueEl', issueEl)

        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container
        issueEl.appendChild(titleEl);

        //create a type element
        var typeEl = document.createElement("span");

        //chick if issue is an actual issue or a pull request
        if (issues[i].pull_request){
            typeEl.textContent = "(Pull Request)";
        }
        else{
            typeEl.textContent = "(Issue)";
        }

        //append to container
        issueEl.appendChild(typeEl);
        issueContainerEl.appendChild(issueEl);
    }
};

function displayWarning(repo){
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit: ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "github.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    //append to Warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();